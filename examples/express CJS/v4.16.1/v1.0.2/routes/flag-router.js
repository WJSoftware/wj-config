const express = require('express');
const router = express.Router();
const FlagService = require('../services/flag-service');

const flagSvc = new FlagService();

router.get('/stats', (req, res) => {
    const stats = flagSvc.getStats();
    res.status(200).send(stats);
});

router.get('/:countryCode', async (req, res) => {
    const svcResult = await flagSvc.getByCode(req.params.countryCode);
    res.setHeader('content-type', svcResult.type);
    res.status(200).send(Buffer.from(svcResult.data));
});

module.exports = router;
