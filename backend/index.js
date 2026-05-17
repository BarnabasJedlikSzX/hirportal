const express = require('express');
const multer = require('multer');
const cors = require("cors");
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
let returnName = ""
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './downloaded');
    },
    filename: (req, file, cb) => {
        const uploadDir = './downloaded';
        const ext = path.extname(file.originalname);

        const existingFiles = fs.readdirSync(uploadDir);

        const numbers = existingFiles
            .map(f => parseInt(f.match(/^(\d+)/)?.[1]))
            .filter(Boolean);

        const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

        returnName = `${nextNumber}${ext}`
        cb(null, `${nextNumber}${ext}`);
    }
});

const upload = multer({ storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
    console.log("saved: " + returnName);
    res.send({ body: returnName });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});