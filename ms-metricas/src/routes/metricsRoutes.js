const express = require('express');
const router = express.Router();
const { getPSPSummary } = require('../controllers/metricsController'); 
const { register, login } = require('../controllers/authController');

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/psp-summary/:developerId', getPSPSummary); 

module.exports = router;