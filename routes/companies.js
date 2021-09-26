const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

module.exports = router;

router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: result.rows });
    } catch (e) {
        next(e);
    }
});
