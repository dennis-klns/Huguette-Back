var express = require('express');
var router = express.Router();

require('../models/connection');
const Review = require('../models/reviews');
const { checkBody } = require('../modules/checkBody');

router.post('/', (req, res) => {
    if (!checkBody(req.body, [ 'tripId'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }  
        const newReview = new Review({
            trip: req.body.tripId,
        });

        newReview.save().then(newDoc => {
            res.json({ result: true, review: newDoc });
          }).catch(error => res.json({ result: false, error: 'Database error', details: error }));

  });

router.put('/passenger', (req, res) => {
    if (!checkBody(req.body, [ 'tripId', 'noteByPassenger'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }  

    if (!req.body.commentByPassenger) {
        Review.updateOne(
        { trip: req.body.tripId },
        { noteByPassenger: req.body.noteByPassenger}
       ).then(() => {
        
          Review.findOne({ trip: req.body.tripId }).then(data => {
            return res.json({ review: data});
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
       
       });
    } else {
        
        Review.updateOne(
            { trip: req.body.tripId },
            { noteByPassenger: req.body.noteByPassenger, commentByPassenger: req.body.commentByPassenger}
           ).then(() => {
            
              Review.findOne({ trip: req.body.tripId }).then(data => {
                return res.json({ review:data});
            }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
           
           });
    }
      
  });

// router.put('/passenger', (req, res) => {
//     if (!checkBody(req.body, [ 'tripId', 'noteByPassenger'])) {
//       res.json({ result: false, error: 'Missing or empty fields' });
//       return;
//     }  

//     if (!req.body.commentByPassenger) {
//         Review.findOneAndUpdate(
//         { trip: req.body.tripId },
//         { noteByPassenger: req.body.noteByPassenger}, {returnNewDocument : true}
//        );
//     } else {
        
//         Review.findOneAndUpdate(
//             { trip: req.body.tripId },
//             { noteByPassenger: req.body.noteByPassenger, commentByPassenger: req.body.commentByPassenger}, {returnNewDocument : true})
//     }
      
//   });

  router.put('/complaintpassenger', (req, res) => {
    if (!checkBody(req.body, ['complaintType', 'details', 'tripId'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
      Review.updateOne(
        { trip: req.body.tripId },
        { complaintByPassenger: { complaintType: req.body.complaintType, details : req.body.details}}
       ).then(() => {
        
          Review.findOne({ trip: req.body.tripId }).then(data => {
            return res.json({ review: data});
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
       
       });
      
  });



module.exports = router;