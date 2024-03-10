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
  if (
    !checkBody(req.body, [
      "tokenPassenger",
      "longitudeD",
      "latitudeD",
      "longitudeA",
      "latitudeA",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.tokenPassenger })
    .then((data) => {
      const newTrip = new Trip({
        passenger: data._id,
        departure: {
          completeAddress: req.body.completeAddressD,
          longitude: req.body.longitudeD,
          latitude: req.body.latitudeD,
        },
        arrival: {
          completeAddress: req.body.completeAddressA,
          longitude: req.body.longitudeA,
          latitude: req.body.latitudeA,
        },
        date: new Date(),
        cancelledByPassenger: false,
      });

      newTrip
        .save()
        .then((newDoc) => {
          res.json({ result: true, trip: newDoc });
        })
        .catch((error) =>
          res.json({ result: false, error: "Database error", details: error })
        );
    })
    .catch((error) =>
      res.json({ result: false, error: "Database error", details: error })
    );
});

router.put("/costPosition", (req, res) => {
  if (!checkBody(req.body, [ "tripId", "longitudeD", "latitudeD", "longitudeA", "latitudeA" ])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

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
          { _id: req.body.tripId },
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
            { _id: req.body.tripId },
            {
               departure: {
                longitude: req.body.longitudeD,
                latitude: req.body.latitudeD,
                completeAddress: departureAddress,
              },
            }
          ).then(() => {
            Trip.findOne({ _id: req.body.tripId })
              .then((data) => {
                const fetchData = async () => {
                  try {
                    const responseT = await axios.get(
                      `https://maps.googleapis.com/maps/api/directions/json?origin=${data.departure.completeAddress}&destination=${data.arrival.completeAddress}&key=${googleApiKey}`
                    );
                    Trip.updateOne(
                      { _id: req.body.tripId },
                      {
                        distance: responseT.data.routes[0].legs[0].distance.text,
                        estimatedDuration: responseT.data.routes[0].legs[0].duration.text,
                      }
                    ).then(() => {
                      Trip.findOne({ _id: req.body.tripId })
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
                res.json({ result: false, error: "Database error", details: error })
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
          return res.json({ trip: data });
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
      return res.json({ trip: data });
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
          return res.json({ trip: data });
        })
        .catch((error) =>
          res.json({ result: false, error: "Database error", details: error })
        );
    }
  );
});

module.exports = router;
