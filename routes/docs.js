const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {  extractDataFromTemplate } = require('../controller/docs');
const router = express.Router();

router.route('/extract-data-from-template').post(protect,extractDataFromTemplate);


module.exports = router;