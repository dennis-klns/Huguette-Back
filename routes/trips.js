var express = require("express");
var router = express.Router();

require("../models/connection");
const Trip = require("../models/trips");
const User = require("../models/users");
const fetch = require('node-fetch');

const { checkBody } = require("../modules/checkBody");
const googleApiKey = process.env.GOOGLE_API_KEY;
const axios = require("axios");


router.post("/", (req, res) => {
  if (!checkBody(req.body, [ "tokenPassenger", "longitudeD", "latitudeD", "longitudeA", "latitudeA" ])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  User.findOne({ token: req.body.tokenPassenger })
    .then((data) => {
      const newTrip = new Trip({
        passenger: data._id,
        date: new Date(),
        cancelledByPassenger: false,
      });

      newTrip
      .save()
        .then((newDoc) => {
          console.log(newDoc);
          const fetchAddressFromCoordinates = async () => {

            try {
              const responseA = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.latitudeA},${req.body.longitudeA}&key=${googleApiKey}`
              );
              const dataA = await responseA.json();
              // console.log("dataA", dataA);
              if (dataA.status === "OK" && dataA.results.length > 0) {
                const arrivalAddress = dataA.results[0].formatted_address;
                console.log(arrivalAddress);
                Trip.updateOne(
                  { _id: newDoc._id },
                  {
                     arrival: {
                      longitude: req.body.longitudeA,
                      latitude: req.body.latitudeA,
                      completeAddress: arrivalAddress,
                    },
                  }
                ).then(() => {});
              }
        
                const responseD = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.latitudeD},${req.body.longitudeD}&key=${googleApiKey}`
                );
                const dataD = await responseD.json();
                // console.log("dataD", dataD);
                if (dataD.status === "OK" && dataD.results.length > 0) {
                  const departureAddress = dataD.results[0].formatted_address;
                  console.log(departureAddress);
                  Trip.updateOne(
                    { _id: newDoc._id },
                    {
                       departure: {
                        longitude: req.body.longitudeD,
                        latitude: req.body.latitudeD,
                        completeAddress: departureAddress,
                      },
                    }
                  ).then(() => {
                    Trip.findOne({ _id: newDoc._id })
                      .then((data) => {
                        const fetchData = async () => {
                          try {
                            const responseT = await axios.get(
                              `https://maps.googleapis.com/maps/api/directions/json?origin=${data.departure.completeAddress}&destination=${data.arrival.completeAddress}&key=${googleApiKey}`
                            );
                            Trip.updateOne(
                              { _id: newDoc._id },
                              {
                                distance: responseT.data.routes[0].legs[0].distance.text,
                                estimatedDuration: responseT.data.routes[0].legs[0].duration.text,
                              }
                            ).then(() => {
                              Trip.findOne({ _id: newDoc._id })
                              .then((data) => {
                              return res.json({
                              /*cost: data.cost,*/ result: true,
                              trip: data,
                              });
                      })
                            })
                            console.log("API Duration:", responseT.data.routes[0].legs[0].duration.text);
                            console.log("API Distance:", responseT.data.routes[0].legs[0].distance.text);
                          } catch (error) {
                            console.error("Error fetching directions:", error);
                          }
                        };
                    
                        fetchData();
                        
                      })
                      .catch((error) =>
                        res.json({ result: false, error: "Database error1", details: error })
                      );
                  });
                }
                  
              // } else {
          //       setAddress("Adresse non disponible");
          //     }
          //   } catch (error) {
          //     console.error("Erreur lors de la récupération de l'adresse:", error);
          //     setAddress("Erreur lors de la récupération de l'adresse");
          //   }
          // };
        
           
              } catch (error) {
                    console.error("Erreur lors de la récupération de l'adresse:", error);
                  }
            }
            
            fetchAddressFromCoordinates();
        })
        .catch((error) =>
          res.json({ result: false, error: "Database error2", details: error })
        );
    })
    .catch((error) =>
      res.json({ result: false, error: "Database error3", details: error })
    );

 
});

router.put("/driverValidation", (req, res) => {
  if (!checkBody(req.body, ["driverId", "tripId"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  Trip.updateOne({ _id: req.body.tripId }, { driver: req.body.driverId }).then(
    () => {
      Trip.findOne({ _id: req.body.tripId })
        .populate("driver")
        .then((data) => {
          return res.json({ result: true, trip: data });
        })
        .catch((error) =>
          res.json({ result: false, error: "Database error", details: error })
        );
    }
  );
});

router.get("/:tripId", function (req, res) {
  Trip.findById(req.params.tripId)
    .populate("driver passenger")
    .then((data) => {
      return res.json({ result: true, trip: data });
    });
});

router.put("/cancelationPassenger", (req, res) => {
  if (!checkBody(req.body, ["tripId"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  Trip.updateOne({ _id: req.body.tripId }, { cancelledByPassenger: true }).then(
    () => {
      Trip.findOne({ _id: req.body.tripId })
        .populate("passenger")
        .then((data) => {
          return res.json({ result:true, trip: data });
        })
        .catch((error) =>
          res.json({ result: false, error: "Database error", details: error })
        );
    }
  );
});

module.exports = router;
