import express from "express";
import PersonService from "../services/person-service.js";

const router = express.Router();
const personSvc = new PersonService();

router.get('/', async (req, res) => {
    const countryFilter = req.query.country_code;
    let data = null;
    if (countryFilter) {
        data = await personSvc.search(req.query);
    }
    else {
        data = await personSvc.getAll();
    }
    res.status(data ? 200 : 204).send(data);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const data = await personSvc.getById(id);
    res.status(200).send(data);
});

export default router;
