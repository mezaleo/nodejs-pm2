const ENV = require('../config/' + (process.env.NODE_ENV || 'development').toString());
const common = require('../utils/common');
var jwt = require('jsonwebtoken');

const ERROR_UNKNOW_CHANNEL = "100";


const validaRequestCanal = function(req){
    let canalRequest = req.headers.canal;
    let canalDef = ENV.CANALES[canalRequest];
    if(!canalDef){
        throw new Error(ERROR_UNKNOW_CHANNEL);
    }
}

const getJwt = async (req, res, next) => {
    console.log(common.logFormat("[getJWT - inicio]"));  

	try {

        let rutAfiliado = req.headers.rutafiliado;
        validaRequestCanal(req);
        let canalRequest = req.headers.canal;
        let canalDef = ENV.CANALES[canalRequest];
        var token = jwt.sign({ RutAfiliado: rutAfiliado }, canalDef.secret);

        return res.status(200).send({
            "token" : token
        });

	} catch (err) {
        if(err.message === ERROR_UNKNOW_CHANNEL){
            err.status = 400;
            err.message = 'Canal invalido';
        }
        err.logger = "[getJWT - fin - set null]"
        err.data = {
            error: err.message
        }
        return next(err);

    }	
};


const validateJwt = async (req, res, next) => {
    // console.log(common.logFormat("[validateJWT - inicio]"));

	try {
        
        let token =  req.headers.authorization;
        let RutAfiliadoHeader = req.headers.rutafiliado;
        validaRequestCanal(req);
        let canalRequest = req.headers.canal;
        let canalDef = ENV.CANALES[canalRequest];

        if(token !== undefined){
            let tokenSplit = token.split(" ");
            if(tokenSplit.length > 0){
                var decoded = jwt.verify(tokenSplit[1], canalDef.secret);
                
                if(RutAfiliadoHeader !== decoded.RutAfiliado){
                    throw new Error("Error de seguridad crítico, Rut del JWT no coincide con el Rut de la cabecera: " + decoded.RutAfiliado + ", " + RutAfiliadoHeader + " respectivamente.");
                }
                return res.status(200).send();
            }else{
                throw new Error("No viene Bearer");
            }
        }else{
            throw new Error("No viene Authentication");
        }

	} catch (err) {
        if(err.message === ERROR_UNKNOW_CHANNEL){
            err.status = 400;
        }
        err.logger = "[validateJWT - fin - set null]"
        err.data = {
            error: "Jwt invalido"
        }
        return next(err);

    }	
};

module.exports = {
    getJwt,
    validateJwt
};