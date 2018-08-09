const path = require('path');
const express = require('express');
const router = express.Router();
const staticController = require('../controllers/staticController');

router.get('/', staticController.index);

module.exports = router;
