import multer from "multer";

export function fileUpload(customValidation = []) {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("In-valid file format"), false);
    }
  }

  const upload = multer({ fileFilter, storage });
  return upload;
}
