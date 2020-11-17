const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const common = require('./utils/common');
const ENV = require('./config/' + (process.env.NODE_ENV || 'development').toString());

const indexRouter = require('./routes/index');
const statusRouter = require('./routes/status');
const jwtRouter = require('./routes/jwt');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
	  title: 'Api Documentation',
	  version: '1.0.0',
	  description: "[http://"+ENV.HOST+":"+ENV.PORT+"/api-docs/](http://"+ENV.HOST+":"+ENV.PORT+"/api-docs/). \n\n Api Documentation",
	  termsOfService: "http://swagger.io/terms/"
	},
	servers: [
		{
		  url: `http://${ENV.HOST}:${ENV.PORT}/retiro-cic-jwt/v1`
		}
	  ]
  };
const options = {
	swaggerDefinition,
	// Path to the API docs
	apis: ['./routes/login.js']
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
app.use(cors());

logger.token('formatedDate', function dateFormater () {
	return common.logFormat('');
})
app.use(logger(':formatedDate :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Swagger
if(process.env.NODE_ENV === "production"){
	app.use('/api-docs', (req, res, next) => {
	  res.status(404).send("Not Found");
	});
}

else{
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Routes
app.use(ENV.CONTEXT_PATH, indexRouter);
app.use(ENV.CONTEXT_PATH, statusRouter);

app.use(ENV.CONTEXT_PATH, jwtRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.status(404).end();
});

// Error Handler
app.use(function(err, req, res, next) {

	if (err.name === 'JsonSchemaValidation') {

		console.error(common.logFormat('ERROR: '+err.message));
    
        res.status(400);
 
        responseData = {
           statusText: 'Bad Request',
           jsonSchemaValidation: true,
           validations: err.validations
        };
 
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            res.json(responseData);
        } else {
            res.render('badrequestTemplate', responseData);
        }
    } else {

		console.error(common.logFormat('ERROR HANDLER: Error:'));
		console.error(common.logFormat('err.status: ' + err.status));
		console.error(common.logFormat('err.message: ' + err.message));
		console.error(common.logFormat('err.stack: ' + err.stack));
		// Send "Internal Server Error"
		res.set(err.headers || {});
		res.status(err.status || 500);
		if(err.logger != null){
			console.error(common.logFormat(err.logger));
		}
		(err.data) ? res.send(err.data) : res.end();
	}
});

module.exports = app;
