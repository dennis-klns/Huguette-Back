var express = require('express');
var router = express.Router();

require('../models/connection');
const Trip = require('../models/trips');
const { checkBody } = require('../modules/checkBody');

router.post('/', (req, res) => {
    if (!checkBody(req.body, [ 'passenger', 'longitudeD', 'latitudeD', 'longitudeA', 'latitudeA' ])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }  
        const newTrip = new Trip({
            passenger: req.body.passenger,
            departure: {
                longitude:req.body.longitudeD,
                latitude:req.body.latitudeD,
            },
            arrival: {
                longitude:req.body.longitudeA,
                latitude:req.body.latitudeA,
            },
            date: new Date,
        });
  
        newTrip.save().then(newDoc => {
          res.json({ result: true, trip: newDoc });
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
      
  });

module.exports = router;