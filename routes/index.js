var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/upload/:token', async (req, res) => {
  try {

    
    if (!req.files.photoFromFront) {
      return res.status(400).json({ result: false, message: "Aucun fichier n'a été téléchargé." });
    }
    const photoPath = `/tmp/${uniqid()}.jpg`;
    const reultMove = await req.files.photoFromFront.mv(photoPath); 

    if (!reultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath); 

      await User.updateOne({token: req.params.token},
        {
         picture: resultCloudinary.secure_url

        })

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
    const photoPath = `/tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromLibrairie.mv(photoPath); 

    if (!resultMove) {
      const resultCloudinary = await cloudinary.uploader.upload(photoPath);
      fs.unlinkSync(photoPath); 
      await User.updateOne({ token: req.body.token }, { $set: { picture: resultCloudinary.secure_url } });
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


router.delete('/deletePhoto/:token', async (req, res) => {
  try {
      // Logique pour trouver l'utilisateur par token et supprimer la photo
      const user = await User.findOne({ token: req.params.token });
      if (user && user.picture) {
          // Supprimez la photo de Cloudinary en utilisant l'ID de l'image ou un autre identifiant unique si nécessaire
          // cloudinary.uploader.destroy(imageId);

          // Supprimez ou mettez à jour l'URL de l'image dans la base de données de l'utilisateur
          await User.updateOne({ token: req.params.token }, { $set: { picture: null } });

          res.json({ result: true, message: "Photo supprimée avec succès." });
      } else {
          res.status(404).json({ result: false, message: "Utilisateur non trouvé ou aucune photo à supprimer." });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, message: "Erreur lors de la suppression de la photo." });
  }
});


// router.post('/upload', async (req, res) => {
//   try {

    
//     if (!req.files.photoFromFront) {
//       return res.status(400).json({ result: false, message: "Aucun fichier n'a été téléchargé." });
//     }
//     const photoPath = `/tmp/${uniqid()}.jpg`;
//     const reultMove = await req.files.photoFromFront.mv(photoPath); 

//     if (!reultMove) {
//     const resultCloudinary = await cloudinary.uploader.upload(photoPath);
//     fs.unlinkSync(photoPath); 
//     res.json({ result: true, url: resultCloudinary.secure_url });}
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ result: false, message: 'Erreur lors du traitement de la demande.', error: error.message });
//   }

// })

module.exports = router;
