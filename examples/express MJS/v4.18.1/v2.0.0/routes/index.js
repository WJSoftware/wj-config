import express from 'express';
import config from '../config.js';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: config.appSettings.title });
});

export default router;
