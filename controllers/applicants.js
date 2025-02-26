const { StudentInfo, KcseGrade, Subject, AcademicQualification, AdditionalDocumentUpload, PaymentDetail } = require('../models'); 
const fs = require('fs');
const passport = require('passport');
const path = require('path');


function unflattenData(data) {
  const result = {};
  for (const key in data) {
    const keys = key.split('.');
    keys.reduce((acc, part, index) => {
      if (index === keys.length - 1) {
        acc[part] = data[key];
      } else {
        acc[part] = acc[part] || {};
      }
      return acc[part];
    }, result);
  }
  return result;
}


const createStudentApplication = async (req, res) => {
  const parsedData = unflattenData(req.body);
  console.log(parsedData);
  const transaction = await StudentInfo.sequelize.transaction();

  try {
    // Get file paths from the mapped files
    const passportPhotoPath = req.files['personalInfo.passportPhoto']
      ? req.files['passport_photo'][0].path
      : null;
    const idDocumentPath = req.files['nationalId_birthCertificate_passport']
      ? req.files['nationalId_birthCertificate_passport'][0].path
      : null;
    const kcseCertificatePath = req.files['kcse_certificate']
      ? req.files['kcse_certificate'][0].path
      : null;
      const documentPaths = req.files['documents'] || [];
   

    // Capitalize nationality to match ENUM values
    const capitalizeFirstLetter = (string) =>
      string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    console.log(parsedData.personalInfo.nationality)
    // Create student data
    const studentData = {
      passport_photo: passportPhotoPath,
      nationality: capitalizeFirstLetter(parsedData.personalInfo.nationality),
      identification_type: parsedData.personalInfo?.idType,
      full_name: parsedData.personalInfo?.fullName,
      gender: parsedData.personalInfo?.gender,
      phone_number: parsedData.personalInfo?.phoneNumber,
      alternate_phone_no:parsedData.personalInfo?.alternativePhone,
      email_address: parsedData.personalInfo?.email,
      postal_address_no: parsedData.personalInfo?.postalAddress,
      postal_town: parsedData.personalInfo?.postalTown,
      county_of_birth: parsedData.personalInfo?.countyOfBirth,
      county_of_residence: parsedData.personalInfo?.countyOfResidence,
      preferred_intake: parsedData.personalInfo?.preferredIntake,
      preferred_study_mode: parsedData.personalInfo?.modeOfStudy,
      nationalId_birthCertificate_passport: idDocumentPath
    };

    // Create student record
    const student = await StudentInfo.create(studentData, { transaction });

    // Create KCSE record if provided
    if (parsedData.kcseGrades) {
      const kcseData = {
        student_id: student.uuid,
        kcse_index: parsedData.kcseGrades.indexNumber,
        kcse_year: parsedData.kcseGrades.year,
        preferred_campus: parsedData.kcseGrades.preferredCampus,
        kcse_mean_grade: parsedData.kcseGrades.meanGrade,
        kcse_certificate: kcseCertificatePath
      };

      await KcseGrade.create(kcseData, { transaction });

   // Create Subject records
   if (Array.isArray(parsedData.kcseGrades.subjects) && parsedData.kcseGrades.subjects.length > 0) {
    const subjectData = parsedData.kcseGrades.subjects.map(subject => ({
      student_id: student.uuid,
      subject_name: subject.name,
      grade: subject.grade,
    }));
    await Subject.bulkCreate(subjectData, { transaction });
  }
}

// Create Academic Qualifications records
if (parsedData.academicQualifications?.qualifications) {
  let qualifications;
  try {
    qualifications = JSON.parse(JSON.stringify(parsedData.academicQualifications.qualifications));
  } catch (e) {
    console.error('Error parsing qualifications data:', e);
    qualifications = [];
  }

  const qualificationsData = Object.values(qualifications).map(qual => ({
    student_id: student.uuid,
    qualification_name: qual.name,
    award_attained: qual.award,
  }));
  console.log(qualificationsData)
  await AcademicQualification.bulkCreate(qualificationsData, { transaction });
}
    

    // Handle additional documents
    if (documentPaths.length > 0) {
      const documentUploads = documentPaths.map((file, index) => ({
        student_id: student.uuid,
        document_name: parsedData.additionalDocuments?.documents[index]?.name || file.originalname,
        file: file.path
      }));
      await AdditionalDocumentUpload.bulkCreate(documentUploads, { transaction });
    }

    // Create Payment Details record
    if (parsedData.paymentDetails) {
      const paymentData = {
        student_id: student.uuid,
        invoice_code: parsedData.paymentDetails.invoiceCode,
        mpesa_code: parsedData.paymentDetails.mpesaCode,
      };
      await PaymentDetail.create(paymentData, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      message: 'Student application created successfully',
      studentId: student.uuid
    });
  } catch (error) {
    await transaction.rollback();

    // Clean up uploaded files if there was an error
    if (req.files) {
      try {
        const cleanupPromises = [];

        const addCleanupTask = (fileArray) => {
          if (fileArray && Array.isArray(fileArray)) {
            fileArray.forEach(file => {
              if (file && file.path) {
                cleanupPromises.push(fs.promises.unlink(file.path));
              }
            });
          }
        };

        addCleanupTask(req.files['passport_photo']);
        addCleanupTask(req.files['nationalId_birthCertificate_passport']);
        addCleanupTask(req.files['kcse_certificate']);
        addCleanupTask(req.files['documents']);

        await Promise.all(cleanupPromises);
      } catch (cleanupError) {
        console.error('Error cleaning up files:', cleanupError);
      }
    }

    console.error('Application creation error:', error);
    return res.status(500).json({
      message: 'Error creating student application',
      error: error.message
    });
  }
};

  
  module.exports = {
    createStudentApplication,
   
    
  };
  