const express = require('express');
const multer = require('multer');
const cors = require("cors")
const app = express();
app.use(cors())
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './downloaded');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
    console.log("Saved image")
    res.send('Image saved');
});

app.listen(3001, () => {
    console.log("running")
});