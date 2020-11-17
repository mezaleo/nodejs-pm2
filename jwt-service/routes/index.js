const express = require('express');
const router = express.Router();
const ENV = require('../config/' + (process.env.NODE_ENV || 'development').toString());


const healthCheck = async (req, res, next) => {
	return res.status(200).send({
		health: 'OK'
	});	
};

router.get('/health', healthCheck);

module.exports = router;