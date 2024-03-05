var express = require('express');
var router = express.Router();

require('../models/connection');
const Trip = require('../models/reviews');
const { checkBody } = require('../modules/checkBody');




module.exports = router;