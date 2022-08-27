import express from "express";
import createHttpError from "http-errors";
import FlagService from "../services/flag-service.js";

const router = express.Router();
const flagSvc = new FlagService();

router.get('/stats', async (req, res) => {
    const stats = await flagSvc.getStats();
    res.status(200).send(stats);
});

router.get('/:countryCode', async (req, res, next) => {
    let svcResult;
    try {
        svcResult = await flagSvc.getByCode(req.params.countryCode);
    }
    catch (err) {
        next(createHttpError[500](err.cause));
        return;
    }
    res.setHeader('content-type', svcResult.type);
    res.status(200).send(Buffer.from(svcResult.data));
});

export default router;
