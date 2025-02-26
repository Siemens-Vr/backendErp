const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;

// const sendResetEmail = require('../mail/mailer')
const {sendPasswordResetEmail, sendResetSuccessEmail} = require('../mail/emails')

const dotenv = require('dotenv');
dotenv.config()
// const models = require('../models');
// console.log(models)
const { User ,Notification, RefreshToken } = require('../models');




// Passport configuration
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Find user by email
    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      })
      .catch(error => {
        console.error('Error finding user:', error);
        return done(error);
      });
  })
);




// JWT function to generate token
function generateToken(user) {
  return jwt.sign({ userId: user.uuid ,type: user.type,isApproved:isApproved, isDefaultPassword:isDefaultPassword,  role: user.role }, process.env.SECRET_KEY , { expiresIn: '1h' });
}


// Generate a refresh token
async function generateRefreshToken(user) {
  const token = crypto.randomBytes(40).toString('hex'); // Random token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7 days

  // Save refresh token in the database
  await RefreshToken.create({
    token,
    userId: user.uuid,
    expiresAt,
  });

  return token;
}



module.exports.signUp = async (req, res) => {
  // console.log("running manu")
  const userId = req.userId; // This can be null now
  const { firstName, lastName, email, gender, phoneNumber, idNumber, dateJoined, type, password, role, confirm_password } = req.body;

  let isApproved = false;
  let isDefaultPassword = false;
  let hashedPassword;

  try {
    if (userId) {
      const user = await User.findOne({ where: { uuid: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.role === "Admin") {
        isApproved = true;
        isDefaultPassword = true;
        const defaultPassword = "DVRLAB@2025";
        hashedPassword = await bcrypt.hash(defaultPassword, 10);
      } else {
        return res.status(403).json({ message: "Only Admins can create new users." });
      }
    } else {
      // No token = user is signing up themselves, so they must set a password
      if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      hashedPassword = await bcrypt.hash(password, 10);
    }

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      gender,
      phoneNumber,
      idNumber,
      dateJoined,
      password: hashedPassword,
      role,
      isApproved,
      isDefaultPassword,
    });
      // If the user is not approved, add a notification for the admin
      if (!isApproved) {
      await Notification.create({
        message: `New user pending approval: ${newUser.firstName} ${newUser.lastName} (${newUser.email})`,
        userId: newUser.uuid, // Reference to the user
      });
    }

    return res.status(201).json({ message: "User created successfully." , user:newUser});
  } catch (error) {
    console.error("Error in signUp:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports.login = async (req, res, next) => {
  passport.authenticate("local", { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Check if the user is approved
    if (!user.isApproved) {
      return res.status(403).json({
        message: "Your account has not been approved yet. Please contact support.",
        approvalRequired: true,
      });
    }

    // Check if the user is using the default password
    if (user.isDefaultPassword) {
      return res.status(403).json({
        message: "You must change your password before proceeding",
        changePasswordRequired: true,
      });
    }

    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.status(200).json({
      user,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  })(req, res, next);
};




module.exports.profile = async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        details: info?.message || 'Invalid or expired token'
      });
    }

    try {
      // Fetch fresh user data from database
      const userData = await User.findOne({ 
        where: { uuid: user.uuid },
        attributes: [
          'uuid',
          'firstName',
          'lastName',
          'email',
          'role',
          'isActive',
          'createdAt',
          'updatedAt'
        ],
        raw: true
      });

      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  })(req, res, next);
};


module.exports.refreshToken = async (req, res) => {
  const {  refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Find the refresh token in the database
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token is invalid or expired' });
    }

    // Find the user associated with the refresh token
    const user = await User.findByPk(storedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new access token
    const newAccessToken = generateToken(user);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports.getUsers = async(req, res)=>{
      try{
        const users = await User.findAll()

        res.status(200).json(users)

      }catch(error){
        console.log(error.message)
      }
}

module.exports.forgotPass = async(req, res)=>{
  const {email} = req.body
  try{
    const user = await User.findOne({where: {email:email}})
    if(!user) return res.status(404).json({error: "User not found"})


     // Generate a secure token
     const resetToken = crypto.randomBytes(32).toString('hex');
     const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour


     // Save the token and expiration time (adjust this based on your DB schema)
     user.resetPasswordToken = resetToken
     user.resetPasswordExpiresAt = resetTokenExpiresAt
     await user.save();

     
 
     // Send the reset email
     await sendPasswordResetEmail(email,`${process.env.CLIENT_URL}/resetPassword/${resetToken}` );
 
     res.status(200).json({ message: "Reset email sent!" });



  }catch(error){
    console.log({"Error in the forgotPassword controller": error.message})
    res.status(500).json({error: "Internal server error"})
  }
}

module.exports.resetPassword = async(req, res)=>{
  console.log("return")
try {
  const {resetPasswordToken} = req.params
  const {password, confirmPassword} = req.body;

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });


  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  if(password !== confirmPassword ) return res.status(404).json({error: "Passwords do not match"})

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();


  await sendResetSuccessEmail(user.email);

  res.status(200).json({ success: true, message: "Password reset successful" });

  
}catch(error){
  console.log("Error in resetPassword ", error);
  res.status(400).json({ success: false, message: error.message });
}

}


module.exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({
      where: { isApproved: false },
      attributes: ['uuid', 'firstName', 'lastName', 'email', 'role', 'dateJoined'],
    });

    return res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports.approveUser = async (req, res) => {
  const { id } = req.params; // User ID to approve

  try {
    const user = await User.findOne({ where: { uuid: id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isApproved = true;
    await user.save();

    return res.status(200).json({ message: "User approved successfully." });
  } catch (error) {
    console.error("Error approving user:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

