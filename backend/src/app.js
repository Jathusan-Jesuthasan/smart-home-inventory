const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const apiRoutes = require('./routes');
const swaggerSpec = require('./config/swagger.config');
const NotFoundError = require('./shared/errors/not-found.error');
const errorHandler = require('./middlewares/error-handler.middleware');

const app = express();

app.use(
	helmet({
		contentSecurityPolicy: false
	})
);
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'tiny' : 'dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', apiRoutes);

app.use((_req, _res, next) => {
	next(new NotFoundError('Route not found'));
});

app.use(errorHandler);

module.exports = app;
