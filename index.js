const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const basicAuth = require('express-basic-auth');

// Basic Authentication Middleware
app.use(basicAuth({
    users: { 'admin': 'e7e5$*b.2Q5j' },
    challenge: true,
    realm: 'File Upload Site'
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const filePath = req.file.path;
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(filePath)}`;
    res.send(`File uploaded successfully. You can access it <a href="${fileUrl}">here</a>.`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
