const multer = require("multer");
const path = require("path");

const imageUploadMiddleware = multer({
  storage: multer.diskStorage({
    filename: (_req, file, done) => {
      const fileName = Buffer.from(file.originalname, "latin1") //
        .toString("utf-8");
      return done(null, `${new Date().getTime()}-${fileName}`);
    },
    destination: (req, file, done) => {
      const rootPath = process.cwd();
      return done(null, path.join(rootPath, "public", "images"));
    },
  }),
}).single("image");

module.exports = imageUploadMiddleware;
