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
            cancelled:false,
        });
  
        newTrip.save().then(newDoc => {
          res.json({ result: true, trip: newDoc });
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
      
  });

  router.put('/costPosition', (req, res) => {
    if (!checkBody(req.body, ['cost', 'tripId'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
      Trip.updateOne(
        { _id: req.body.tripId },
        { cost: req.body.cost, departure: { longitude: req.body.longitudeD, latitude : req.body.latitudeD}}
       ).then(() => {
        
          Trip.findOne({ _id: req.body.tripId }).then(data => {
            return res.json({ cost: data.cost, departure: data.departure});
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
       
       });
      
  });


  router.put('/driverValidation', (req, res) => {
    if (!checkBody(req.body, ['driverId', 'tripId'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
      Trip.updateOne(
        { _id: req.body.tripId },
        { driver: req.body.driverId}
       ).then(() => {
        
          Trip.findOne({ _id: req.body.tripId }).populate('driver').then(data => {
            return res.json({ trip: data});
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
       
       });
      
  });

  router.get('/:tripId', function(req, res) {
    Trip.findById(req.params.tripId).populate('driver passenger').then(data => {
        return res.json({ trip: data});
       });
  });


  router.put('/cancelationPassenger', (req, res) => {
    if (!checkBody(req.body, ['tripId'])) {
      return res.json({ result: false, error: 'Missing or empty fields' });
    }
  
      Trip.updateOne(
        { _id: req.body.tripId },
        { cancelledByPassenger: true}
       ).then(() => {
        
          Trip.findOne({ _id: req.body.tripId }).populate('passenger').then(data => {
            return res.json({ trip: data});
        }).catch(error => res.json({ result: false, error: 'Database error', details: error }));
       
       });
      
  });

module.exports = router;