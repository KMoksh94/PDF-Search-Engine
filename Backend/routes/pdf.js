const epxress = require("express")
const router = epxress.Router();
const multer = require("multer");
const {uploadFunction, askFunction} = require("../controllers/pdf-controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-'+ file.originalname + '-' + uniqueSuffix)
  }
})
const upload = multer({storage : storage})

router.post("/upload",upload.single("pdf"), uploadFunction)
router.post("/ask",askFunction)

module.exports = router;