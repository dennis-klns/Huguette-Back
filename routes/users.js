var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

router.post('/signUp', (req, res) => {
  if (!checkBody(req.body, ['lastname','firstname', 'phone', 'email', 'password', 'birthdate', 'gender'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ phone: req.body.phone }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        phone: req.body.phone,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        password: hash,
        token: uid2(32),
        type: 'passenger',
        isBanned: false,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});



router.post('/signIn', (req, res) => {
  
  if (!req.body.password || (!req.body.phone && !req.body.email)) {
    res.json({ result: false, error: 'Email/Phone and password are required' });
    return;
  }

  const searchCriteria = req.body.phone ? { phone: req.body.phone } : { email: req.body.email };

  User.findOne(searchCriteria).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, firstname: data.firstname });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
});

router.put('/moodPassenger', (req, res) => {
  if (!(req.body.token && (req.body.mood || req.body.music || req.body.isAccompanied))) {
    return res.json({ result: false, error: 'Missing or empty fields' });
  }

    User.updateOne(
      { token: req.body.token },
      { $set: {'isAccompanied': 'req.body.isAccompanied', 'mood': 'req.body.mood', 'music': 'req.body.music'}}
     ).then(() => {
      
        User.findOne({ token: req.body.token }).then(data => {
          return res.json({ result: true, passenger: data });
      }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
     
     });
 
});

router.put('/emergencyMessage', (req, res) => {
  if (!checkBody(req.body, ['emergencyMessage','token' ])) {
    return res.json({ result: false, error: 'Missing or empty fields' });
  }

  User.updateOne(
    { token: req.body.token },
    { $set: {'emergency.emergencyMessage': req.body.emergencyMessage}}
   ).then(() => {
    
      User.findOne({ token: req.body.token }).then(data => {
        return res.json({ result: true, emergency: data.emergency });
    }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
   
   });

  });

  router.put('/driverNote', (req, res) => {
    if (!checkBody(req.body, ['note','token' ])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
    User.updateOne(
      { token: req.body.token },
      { $push: {averageNote: req.body.note}}
     ).then(() => {
      
        User.findOne({ token: req.body.token }).then(data => {
          return res.json({ result: true, emergency: data.emergency });
      }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
     
     });
  
    });

  router.put('/emergencyContact', (req, res) => {
    if (!checkBody(req.body, ['emergencyLastname', 'emergencyFirstname','emergencyPhone','token' ])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
    User.updateOne(
      { token: req.body.token },
      { $set: {'emergency.lastname': req.body.emergencyLastname, 'emergency.firstname': req.body.emergencyFirstname, 'emergency.phone': req.body.emergencyPhone,}}
     ).then(() => {
      
        User.findOne({ token: req.body.token }).then(data => {
          return res.json({ result: true, emergency: data.emergency });
      }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
     
     });
  
  });

  router.get('/emergencyInfos/:token', function(req, res) {
    User.findOne({token: req.params.token}).then(data => {
        return res.json({ emergencyInfos: data.emergency});
       });
  });


  // const modificationCriteria2 = (data.averageNote.length = 100) ? { $pop: { averageNote: -1 } } : { $push: { averageNote: req.body.noteByPassenger } }

  // User.updateOne(
  //   { _id: req.body.driverId },
  //   modificationCriteria2
  //   ).then(() => {
  //     User.findOne({ _id: req.body.driverId }).then(data => {
  //     return res.json({ review: data});
  //   }).catch(error => res.json({ result: false, error: 'Note not updated', details: error }));
  // });

// User.aggregate([
  //   { $pop: { averageNote:  -1  }},
  //   { $push: { averageNote: req.body.noteByPassenger } }
  //  ])

  router.put('/driverAverageNote', (req, res) => {

    if (!checkBody(req.body, [ 'tokenDriver', 'noteByPassenger'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }

    User.findOne({ token: req.body.tokenDriver }).then((data) => {
        if(data.averageNote.length < 100) {
          User.updateOne(
            { token: req.body.tokenDriver },
            { $push: { averageNote: req.body.noteByPassenger } }
            ).then((data) => {
              return res.json({result: true, message: "Note ajoutée avec succès", report: data})
            }).catch(error => res.json({ result: false, error: 'Database error', details: error }))
        }  else {
          console.log(data)
          data.averageNote.shift()
          data.averageNote.push(req.body.noteByPassenger)
         // les deux actions précédentes changent le tableau averageNote reçu dans data (pas besoin de réassigner de valeur)
          User.updateOne(
            { token: req.body.tokenDriver },
            { averageNote: data.averageNote }
            ).then((data) => { 
              return res.json({result: true, message: 'Notes mises à jour', report: data})
              
            }).catch(error => res.json({ result: false, error: 'Database error', details: error }))
        }
    }).catch(error => res.json({ result: false, error: 'Database error', details: error }))
  });

module.exports = router;
