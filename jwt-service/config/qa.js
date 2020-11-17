const ENV = {
	CONTEXT_PATH:'/v1/jwt',
	PORT: 7100,
	TIMEZONE: 'Chile/Continental',
	TIME_FORMAT: 'YYYY-MM-DD--HH:mm:ss.SSS',
	GRACEFUL_SHUTDOWN_TIMEOUT: 10000,
	HOST: 'dockerlab',
	HTTP_CALL_TIMEOUT: '10s',
	CANALES: {
		deepsource: {
			secret: 'ds.secret'
		},
		dockerlab: {
			secret: 'docker.secret'
		}
	}

};

module.exports = ENV;
