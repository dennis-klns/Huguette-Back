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
                longitudeD:req.body.longitudeD,
                latitudeD:req.body.latitudeD,
            },
            arrival: {
                longitudeA:req.body.longitudeA,
                latitudeA:req.body.latitudeA,
            },
            date: new Date,
        });
  
        newTrip.save().then(newDoc => {
          res.json({ result: true, trip: newDoc });
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
      
  });

  router.put('/costposition', (req, res) => {
    if (!checkBody(req.body, ['cost', 'tripId'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
      Trip.updateOne(
        { _id: req.body.tripId },
        { cost: req.body.cost, departure: { longitudeD: req.body.longitudeD, latitudeD : req.body.latitudeD}}
       ).then(() => {
        
          Trip.findOne({ _id: req.body.tripId }).then(data => {
            return res.json({ cost: data.cost, departure: data.departure});
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
       
       });
      
  });


  router.put('/drivervalidation', (req, res) => {
    if (!checkBody(req.body, ['driverId', 'tripId'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
      Trip.updateOne(
        { _id: req.body.tripId },
        { driver: req.body.driverId}
       ).then(() => {
        
          Trip.findOne({ _id: req.body.tripId }).populate('driver').then(data => {
            return res.json({ trip: data.driver});
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
       
       });
      
  });

  router.get('/:tripId', function(req, res) {
    Trip.findById(req.params.tripId).populate('driver passenger').then(data => {
        return res.json({ trip: data});
       });
  });

module.exports = router;