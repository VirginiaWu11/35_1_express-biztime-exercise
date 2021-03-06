const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const { throwErrorIfEmpty } = require("../helpers");

module.exports = router;

router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (e) {
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [
            id,
        ]);
        throwErrorIfEmpty(results.rows.length, id);

        return res.json({ invoices: results.rows });
    } catch (e) {
        next(e);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1,$2) RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );
        return res.status(201).json({ invoices: results.rows[0] });
    } catch (e) {
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const results = await db.query(
            `UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, id]
        );
        throwErrorIfEmpty(results.rows.length, id);

        return res.status(201).json({ invoices: results.rows[0] });
    } catch (e) {
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(
            "DELETE FROM invoices WHERE id=$1 RETURNING id, comp_code, amt",
            [id]
        );
        console.log(results);
        throwErrorIfEmpty(results.rows.length, id);

        return res.send({ msg: "Deleted" });
    } catch (e) {
        next(e);
    }
});
