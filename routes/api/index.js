const express = require('express');
const router = express.Router();
const accounts = require('./accounts');

router.use('/accounts', accounts);

module.exports = router;