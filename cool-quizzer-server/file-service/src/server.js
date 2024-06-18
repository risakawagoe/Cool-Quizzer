const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require("cors");
const Multer = require('multer');
const { uploadFile } = require('./file-controller');

const app = express();
const port = 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
});


// Endpoints
app.options("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.send(200);
});
app.get('/api/hello', (req, res) => {
    res.send('FILE_SERVICE: Hello!');
});
app.post('/api/file', upload.single('file'), uploadFile);
// app.post('/api/files', upload.any(), uploadFiles);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});