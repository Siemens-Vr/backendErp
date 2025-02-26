const multer = require('multer');
const path = require('path');

const storage = (directory) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', directory));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure multer for multiple file types
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir = 'files'; 
      
      if (file.fieldname === 'videos') {
        uploadDir = 'videos';
      } else if (file.fieldname === 'report') {
        uploadDir = 'reports';
      } else if (file.fieldname === 'procurement') {
        uploadDir = 'procurements';
      } else if (file.fieldname === 'transport') {
        uploadDir = 'transports';
      } 
  
      cb(null, path.join(__dirname, '..', 'uploads', uploadDir));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
}).fields([
  { name: 'videos', maxCount: 10 },
  { name: 'report', maxCount: 10 },
  { name: 'files', maxCount: 10 },
  { name: 'procurement', maxCount: 10 },
  { name: 'transport', maxCount: 10 }, 
]);

module.exports = { upload };