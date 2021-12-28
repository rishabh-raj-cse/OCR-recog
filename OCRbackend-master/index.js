//express server setup
const express = require("express");
const app = express();
const port = process.env.PORT || 3005;
var cors = require("cors");
const FormData = require("form-data");
const multer = require("multer");
const { ocrSpace } = require("ocr-space-api-wrapper");
const tesseract = require("node-tesseract-ocr")
//


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
//routes
app.post("/", upload.array("file"), async (req, res) => {
  console.log("running");
  const id = req.body.id;
  const files = req.files;

  //validation for id
  const validationVariables = [15, 6, 4, 6, 5, 5];
  const validationString = ["Abu Dhabi must be 15 characters long", "Sharjah License number should be 6 digits long", "Umm Al Quwain License number should be 4 digits long", "Dubai License number should be 6 digits long", "Ajman License number should be 5 digits long", "Ras Al Khaimah License number should be 5 digits long"];
  const errors = [];


  for (var i = 0; i < id.length; i++) {
    if (id[i] !== validationVariables[i]) {

      errors.push(validationString[i]);








    }
  }
  if (errors.length > 0) {
    res.json({//if errors are found
      errors: errors, success: false
    });
  }
  //  if (id[0].length !== 15) {
  //     res.send({ message: "Abu Dhabi must be 15 characters long", success: false });
  //   }
  //   if (id[1].length !== 6) {
  //     res.send("Sharjah License number should be 6 digits long");
  //   }
  //   if (id[2].length !== 4) { res.send("Umm Al Quwain License number should be 4 digits long"); }
  //   if (id[3].length !== 6) { res.send("Dubai License number should be 6 digits long"); }
  //   if (id[4].length !== 5) { res.send("Ajman License number should be 5 digits long"); }
  //   if (id[5].length !== 5) { res.send("Ras Al Khaimah License number should be 5 digits long"); }

  let index = 0;

  const result = [];
  const images = [];
  for (const file of files) {
    const { filename } = file;
    images.push(`./uploads/${filename}`);

  }
  const config = {
    lang: "eng",
    oem: 1,
    psm: 6,
  }
  const findText = (text, str) => {
    return str.indexOf(text) > -1;
  }
  const allText = [];

  await tesseract
    .recognize(images, config)
    .then((text) => {

      allText.push(text)
      for (var i = 0; i < id.length; i++) {
        result.push(findText(id[i], text));
      }

      console.log("Result:", text);
    })
    .catch((error) => {
      console.log(error.message)
    })

  res.json({ result, allText });

  //check kro




});


// listen for requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
