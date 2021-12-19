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
app.use(express.static("public"));
app.use(cors());
//routes
app.post("/", upload.array("file"), async (req, res) => {
  console.log("running");
  const id = req.body.id;
  const files = req.files;


  let index = 0;

  const result = [];
  const images = [];
  for (const file of files) {
    const { filename } = file;
    images.push(`./uploads/${filename}`);

    // await Tesseract.recognize(
    //   `./uploads/${filename}`,
    //   'eng',
    //   { logger: m => console.log(m) }
    // ).then(({ data: { text } }) => {

    //   const findText = (text, str) => {
    //     return str.indexOf(text) > -1;
    //   }
    //   console.log({ id: id[index] })
    //   console.log(findText(id[index], text))
    //   result.push(findText(id[index], text))
    // })
    // console.log({ id: id[index] })
    // index++;
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
  console.log(id)
  res.json({ result, allText });

  //check kro











  // find id in string
  // const id = text.match(/\d+/g);
  // console.log(id)








  // const imgToText = await ocrSpace(`./uploads/${fileName}`, {
  //   apiKey: "3e89393eaf88957",
  //   isOverlayRequired: true,
  // });

  // const text = imgToText.ParsedResults[0].ParsedText;
  // const textArray = text.split("\n");
  // console.log(textArray);

  // //regex to remove \r

  // const regex = /\r/g;
  // const newTextArray = textArray.map((item) => item.replace(regex, ""));
  // console.log(newTextArray);

  //check if item in array
  // const idIndex = newTextArray.find((item) => item === id);

  // if (idIndex) {
  //   res.send("true");
  // } else {
  //   res.send("false");
  // }
});
app.post("/upload", upload.single("file"), (req, res) => {
  return res.send("File uploaded successfully");
});

// listen for requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
