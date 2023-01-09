const express = require('express');
const router = express.Router();
const configPromise = require('../config');

/* GET home page. */
router.get('/', async function (req, res, next) {
    const config = await configPromise;
    res.render('index', { title: config.appSettings.title });
});

module.exports = router;
