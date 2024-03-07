var express = require('express');
var router = express.Router();

const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/upload', async (req, res) => {
  try {

    
    if (!req.files.photoFromFront) {
      return res.status(400).json({ result: false, message: "Aucun fichier n'a été téléchargé." });
    }
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const reultMove = await req.files.photoFromFront.mv(photoPath); 

    if (!reultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath); 
    res.json({ result: true, url: resultCloudinary.secure_url });}
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur lors du traitement de la demande.', error: error.message });
  }

})

router.post('/uploadLibrairie', async (req, res) => {
  try {
    if (!req.files.photoFromLibrairie) {
      return res.status(400).json({ result: false, message: "Aucun fichier n'a été téléchargé." });
    }
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromLibrairie.mv(photoPath); 

    if (!resultMove) {
      const resultCloudinary = await cloudinary.uploader.upload(photoPath);
      fs.unlinkSync(photoPath); 
      res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
      console.log(resultMove)
      res.json({ result: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur lors du traitement de la demande.', error: error.message });
  }
});

module.exports = router;
