var express = require("express");
var router = express.Router();

require("../models/connection");
const Trip = require("../models/trips");
const User = require("../models/users");

const { checkBody } = require("../modules/checkBody");

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
        cancelled: false,
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
  if (!checkBody(req.body, [/*'cost',*/ "tripId"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  Trip.updateOne(
    { _id: req.body.tripId },
    {
      /*cost: req.body.cost,*/ departure: {
        longitude: req.body.longitudeD,
        latitude: req.body.latitudeD,
        completeAddress: req.body.completeAddressD,
      },
    }
  ).then(() => {
    Trip.findOne({ _id: req.body.tripId })
      .then((data) => {
        return res.json({
          /*cost: data.cost,*/ result: true,
          departure: data.departure,
        });
      })
      .catch((error) =>
        res.json({ result: false, error: "Database error", details: error })
      );
  });
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
