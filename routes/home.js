const { Router } = require("express");
const db = require('../database');
const router = Router();
const jwt = require('jsonwebtoken'); 


router.get("/", (req, res) => {
    res.render("../views/pages/home")
})

router.get("/:id", (req, res) => {
    const { id } = req.params;
    res.render("../views/pages/movie", {id})
})

router.get("/ratings/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const ratings = await db.any('SELECT * FROM ratings WHERE movie_id = $1', [id]);
        let score = 0;
        if(ratings.length > 0) {    
            ratings.forEach(element => score = score + element.rating);
            score = score / ratings.length;
            score = Math.round(score * 10) / 10;
        }
        res.status(201).json({ score });        
    }
    catch(err) {
        console.log(err);
    }
})

router.post("/ratings/:id", (req, res) => {
    const { id } = req.params;
    const { ratings } = req.body;

    const token = req.cookies.jwt; 

    if(token) {

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) =>{
            if(err) {
                console.log(err.message);
            }
            else {
                const user_id = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [decodedToken.email]);
                await db.none('INSERT INTO ratings(movie_id, user_id, rating) VALUES($1, $2, $3)', [id, user_id.id, ratings]);
    
            }
        })
    }

    res.redirect(`/${id}`);
})

router.get("/rated/:movie_id", async (req, res) => {
    const { movie_id } = req.params;

    const token = req.cookies.jwt; 
    let isAuth = false;
    if(token) {

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) =>{
            if(err) {
                console.log(err.message);
            }
            else {
                const user_id = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [decodedToken.email]);
                const rating = await db.oneOrNone('SELECT * FROM ratings WHERE movie_id = $1 AND user_id = $2', [movie_id, user_id.id]);
                
                if(rating) {
                    res.status(201).json({ isAuth });
                }
                else {
                    isAuth = true;
                    res.status(201).json({ isAuth });
                }
            }
        })
    }
    else {
        res.status(201).json({ isAuth });
    }
})



module.exports = router