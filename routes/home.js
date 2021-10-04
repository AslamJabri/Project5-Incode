const { Router } = require("express");
const router = Router();
const db = require('../database');



router.get("/", async (req, res) => {
    const ratings = await db.query("select rating from ratings;");
    console.log(ratings);
    res.render("../views/pages/home", {ratings})
})

router.get("/:id", (req, res) => {
    const { id } = req.params;
    res.render("../views/pages/movie", {id})
})

module.exports = router 