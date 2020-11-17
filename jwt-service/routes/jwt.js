const express = require('express');
const router = express.Router();
const ENV = require('../config/' + (process.env.NODE_ENV || 'development').toString());
const timeout = require('connect-timeout');
const validate = require('express-jsonschema').validate;
const getHeaderSchema = require('../schema/get-header-schema.json');
const postHeaderSchema = require('../schema/post-header-schema.json');

const jwtService = require('../services/JwtService');

router.post('/', timeout(ENV.HTTP_CALL_TIMEOUT), validate({headers: postHeaderSchema}), jwtService.getJwt);
router.get('/', timeout(ENV.HTTP_CALL_TIMEOUT), validate({headers: getHeaderSchema}), jwtService.validateJwt);

module.exports = router;