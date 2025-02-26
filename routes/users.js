const {Router } =  require('express')

const userRouter = Router();
const {verifyToken} = require('../middleware/verifyAdminSignUp')
const {isAdmin} = require('../middleware/isAdmin')

const { login, signUp , profile, getUsers, refreshToken,approveUser, forgotPass,getPendingUsers, resetPassword} = require('../controllers/users')

// const isAuthenticated = require('../middleware/isAuthenticated');
 
userRouter.get('/', getUsers)
userRouter.post('/signup',verifyToken, signUp)
userRouter.post('/login', login)
userRouter.get('/unApproved', getPendingUsers)
userRouter.get('/:id/approved', approveUser)
userRouter.post('/refresh-token', verifyToken, refreshToken); 
userRouter.get('/profile',  profile)
userRouter.post('/forgotPassword',  forgotPass)
userRouter.post('/resetPassword/:resetPasswordToken',  resetPassword)

module.exports = userRouter