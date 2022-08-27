const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const configPromise = require('./config');
const indexRouter = require('./routes/index');
const personRouter = require('./routes/person-router');
const flagRouter = require('./routes/flag-router');

module.exports = (async () => {
    const app = express();
    const config = await configPromise;
    app.set('env', config.environment.isProduction() ? 'production' : config.environment.value);

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('common'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(lessMiddleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/persons', personRouter);
    app.use('/flags', flagRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = !config.environment.isProduction() ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
    return app;
})();
