const multer = require("multer");
const path = require("path");

const multerMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = "./uploads/";

      // Check the fieldname to determine the destination folder
      if (file.fieldname === 'avatar') {
        uploadPath += 'avatar';
      } else if (file.fieldname === 'foto') {
        uploadPath += 'notification';
      } else if (file.fieldname === 'document') {
        uploadPath += 'document';
      } else {
        uploadPath += 'default';
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = multerMiddleware