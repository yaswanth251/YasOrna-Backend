const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authorize } = require('../middleware/authMiddleware');
const Jewelry = require('../models/Jewelry');
const { extractFeatures } = require('../controllers/jewelryController');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  const { path: imagePath } = req.file;
  const features = await extractFeatures(imagePath);
  const jewelry = new Jewelry({ name: req.body.name, imagePath, features });
  await jewelry.save();
  res.json({ message: 'Image uploaded successfully' });
});

router.post('/search', async (req, res) => {
  const { features } = req.body;
  const results = await Jewelry.find().limit(10); // Placeholder query
  res.json(results);
});

module.exports = router;