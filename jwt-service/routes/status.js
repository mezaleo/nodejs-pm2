const express = require('express');
const router = express.Router();
const ENV = require('../config/' + (process.env.NODE_ENV || 'development').toString());
const timeout = require('connect-timeout')

const statusService = require('../services/StatusService');

router.get(ENV.API_VERSION + 'status', timeout(ENV.HTTP_CALL_TIMEOUT), statusService.status);

module.exports = router;