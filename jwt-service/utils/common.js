const ENV = require('../config/' + (process.env.NODE_ENV || 'development').toString());
const moment = require("moment-timezone");
const axios = require('axios');

const handle = promise => {
	return promise.then(data => [data, undefined]).catch(error => Promise.resolve([undefined, error]));
}

const makeRequest = async (envEndpointConfig, path, data) => {
	let endpointConfig = JSON.parse(JSON.stringify(envEndpointConfig));
	if (data !== null) {
		endpointConfig.data = data;
	}
	endpointConfig.url += path;

	const requestInfo = [
	endpointConfig.method.toUpperCase(),
	endpointConfig.url
	].join(' ');

	console.log(logFormat('Making request to: ' + requestInfo));
	let [result, err] = await handle(axios(endpointConfig));
	if (err) {
		console.error(logFormat('makeRequest: ' + err));
		if(err.response){
			if(err.response.status){
				err.status = err.response.status;
				console.error(logFormat('makeRequest: err.status: ' + err.status));
			}
			if(err.response.headers){
				err.headers = err.response.headers;
				console.error(logFormat('makeRequest: err.headers: ' + JSON.stringify(err.headers)));
			}
			if(err.response.data){
				err.data = err.response.data;
				console.error(logFormat('makeRequest: err.data: ' + JSON.stringify(err.data)));
			}
		}
		console.error(logFormat('makeRequest: err requestInfo:'));
		console.error(logFormat(requestInfo));
		throw err;
	}
	return result;
}

const validaRut = (rutAndDv, tienePuntos) => {

	centena = "[1-9][0-9][0-9]|[1-9][0-9]|[1-9]";
	milesima = "[1-9][0-9][0-9]\\.[0-9][0-9][0-9]|[1-9][0-9]\\.[0-9][0-9][0-9]|[1-9]\\.[0-9][0-9][0-9]" + "|" + centena;
	millonesima = "[1-9][0-9][0-9]\\.[0-9][0-9][0-9]\\.[0-9][0-9][0-9]|[1-9][0-9]\\.[0-9][0-9][0-9]\\.[0-9][0-9][0-9]|[1-9]\\.[0-9][0-9][0-9]\\.[0-9][0-9][0-9]" + "|" + milesima;
	patternConPunto = RegExp.compile("^("+millonesima+")[-][0-9Kk]{1}$");//Con Puntos y con Guion
	
	patternSinPunto = RegExp.compile("^([1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9]|[1-9])[-][0-9Kk]{1}$");
		
	matcher = null;
	
	if(tienePuntos) {
		matcher = patternConPunto.match(rutAndDv);
	}else {
		matcher = patternSinPunto.match(rutAndDv);
	}
		
	if ( matcher.matches() == false ) {
		return false;
	} else {
		dv = rutAndDv.split("-")[1].charAt(0);
		rut = Integer.parseInt(rutAndDv.split("-")[0].replace(".",""));
		return validarRut(rut, dv);
	}

}

const validarRut = (rut,dv) => {
	m = 0, s = 1;
	for (; rut != 0; rut /= 10) {
		s = (s + rut % 10 * (9 - m++ % 6)) % 11;
	}
	return dv == (char) (s != 0 ? s + 47 : 75); 
}

/**
 * Format timestamp to date in the desired timezone, with desired format
 */
 const formatDateTime = (timestamp) => {
 	return moment(timestamp).tz(ENV.TIMEZONE).format(ENV.TIME_FORMAT);
 };

 const logFormat = (msg) => {
 	return '[' + formatDateTime(new Date().getTime()) + ']: ' + msg;
 };

 module.exports.logFormat = logFormat;
 module.exports.makeRequest = makeRequest;