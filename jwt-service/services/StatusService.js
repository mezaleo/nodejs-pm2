const common = require('../utils/common');

const status = async (req, res, next) => {
    console.log(common.logFormat("[Status - inicio]"));

	// Transform input if necessary
	let getStatusResp = {};
    // Integration request with micro-service

	try {       

        getStatusResp.data = {
            statusCode: "200",
            statusMessage: "Activo"
        }        

        console.log(common.logFormat("[Status - fin]"));
        return res.status(200).send(getStatusResp.data);

	} catch (err) {
        error.logger = "[Status - fin]";
        return next(err);
    }	
};

module.exports = {
    status
};