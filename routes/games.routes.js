const express = require("express")
const router = express.Router()
const Game = require("../models/Game.js")
const Review = require("../models/Review.js")
const isSignedIn = require("../middleware/is-signed-in.js")

router.get("/" , async (req , res) => {
    const games = await Game.find()
    res.render("all-games.ejs" , { games: games })
})

router.get("/my-games" , isSignedIn , async (req , res) => {
    const userReviews = await Review.find({ user: req.session.user._id })
        .populate("game")
        .sort({ createdAt: -1 })

    res.render("my-games.ejs" , { userReviews: userReviews })
})

router.get("/:gameId" , async (req , res) => {
    const foundGame = await Game.findById(req.params.gameId)
    res.render("game-details.ejs" , { game: foundGame })
})

module.exports = router