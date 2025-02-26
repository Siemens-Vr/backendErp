const multer = require('multer');
const path = require('path');

const fs = require('fs');


const storage = multer.diskStorage({

  
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanFieldName = file.fieldname.replace(/\[\d+\]\.file$/, '');
    cb(null, `${cleanFieldName}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const checkFileType = (file, allowedTypes) => {
  const mimetype = file.mimetype.toLowerCase();
  return allowedTypes.test(mimetype);
};

const fileFilter = (req, file, cb) => {
  const fieldMappings = {
    'personalInfo.passportPhoto': 'passport_photo',
    'personalInfo.idDocument': 'nationalId_birthCertificate_passport',
    'kcseGrades.kcseCertificate': 'kcse_certificate',
    'additionalDocuments.documents': 'documents'
  };

  const allowedTypes = {
    'personalInfo.passportPhoto': /^image\/(jpeg|png|jpg)$/,
    'personalInfo.idDocument': /^application\/pdf$/,
    'kcseGrades.kcseCertificate': /^application\/pdf$/,
    'additionalDocuments.documents': /^application\/pdf$/
  };

  const baseFieldName = file.fieldname.replace(/\[\d+\]\.file$/, '');
  const fileType = allowedTypes[baseFieldName];

  if (!fileType) {
    return cb(new Error(`Invalid field name: ${baseFieldName}`), false);
  }

  if (checkFileType(file, fileType)) {
    file.mappedFieldName = fieldMappings[baseFieldName] || baseFieldName;
    return cb(null, true);
  }

  cb(new Error(
    `Invalid file type for ${baseFieldName}. Only allowed types are PDF for documents and JPEG/PNG for passport photos.`
  ));
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 12
  },
  fileFilter: fileFilter
}).fields([
  { name: 'personalInfo.passportPhoto', maxCount: 1 },
  { name: 'personalInfo.idDocument', maxCount: 1 },
  { name: 'kcseGrades.kcseCertificate', maxCount: 1 },
  { name: 'additionalDocuments.documents[0].file', maxCount: 1 },
  // Additional document fields...
]);

const handleBase64Files = (req) => {
  if (!req.body) return;

  const convertBase64ToBuffer = (base64String) => {
    if (!base64String || typeof base64String !== 'string') return null;
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) return null;
    return { buffer: Buffer.from(matches[2], 'base64'), type: matches[1] };
  };

  if (req.body.personalInfo?.passportPhoto) {
    const fileData = convertBase64ToBuffer(req.body.personalInfo.passportPhoto);
    if (fileData) {
      req.body.personalInfo.passportPhoto = fileData.buffer;
    }
  }

  // Handle other documents similarly if needed
};

const uploadMiddleware = (req, res, next) => {
  console.log("uPLOAD MIDDLEWA/RE")
  handleBase64Files(req);

  upload(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            error: 'Unexpected field',
            message: 'Please check the field names in your form data.',
            details: err
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'File too large',
            message: 'Maximum file size is 5MB'
          });
        }
        return res.status(400).json({ error: err.code, message: err.message });
      }
      return res.status(400).json({ error: 'File upload error', message: err.message });
    }

    if (req.files) {
      const mappedFiles = {};

      Object.entries(req.files).forEach(([key, files]) => {
        const baseFieldName = key.replace(/\[\d+\]\.file$/, '');

        if (key.includes('additionalDocuments.documents')) {
          if (!mappedFiles.documents) mappedFiles.documents = [];
          mappedFiles.documents.push(...files);
        } else {
          switch (baseFieldName) {
            case 'personalInfo.passportPhoto':
              mappedFiles.passport_photo = files;
              break;
            case 'personalInfo.idDocument':
              mappedFiles.nationalId_birthCertificate_passport = files;
              break;
            case 'kcseGrades.kcseCertificate':
              mappedFiles.kcse_certificate = files;
              break;
          }
        }
      });

      req.files = mappedFiles;
    }

    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON'
        });
      }
    }

    next();
  });
};

module.exports = uploadMiddleware;