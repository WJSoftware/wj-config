import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import indexRouter from "./routes/index.js";
import flagsRouter from "./routes/flag-router.js";
import personsRouter from "./routes/person-router.js";
import logFactory from './services/log-factory.js';

const log = logFactory('app');
const app = express();
// view engine setup
log.debug('Meta URL: {MetaUrl}', import.meta.url);
app.set('views', path.join('./', 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('./', 'public')));

app.use('/', indexRouter);
app.use('/people', personsRouter);
app.use('/flags', flagsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
