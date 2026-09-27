const express = require("express")
const router = express.Router({ mergeParams: true })
const Game = require("../models/Game.js")
const Review = require("../models/Review.js")
const isSignedIn = require("../middleware/is-signed-in.js")

router.post("/" , isSignedIn , async (req , res) => {
    const foundGame = await Game.findById(req.params.gameId)
    if (!foundGame) {
        return res.redirect("/games")
    }

    let isPlayed = false
    if (req.body.played === "on") {
        isPlayed = true
    }

    let isCompleted = false
    if (req.body.completed === "on") {
        isCompleted = true
    }

    let existingReview = await Review.findOne({
        game: foundGame._id , 
        user: req.session.user._id
    })

    if (existingReview) {
        existingReview.played = isPlayed
        existingReview.completed = isCompleted
        existingReview.rating = Number(req.body.rating)
        existingReview.difficulty = req.body.difficulty
        existingReview.comment = req.body.comment
        await existingReview.save()
    } else {
        const newReview = await Review.create({
            game: foundGame._id , 
            user: req.session.user._id , 
            username: req.session.user.username , 
            played: isPlayed , 
            completed: isCompleted , 
            rating: Number(req.body.rating) , 
            difficulty: req.body.difficulty , 
            comment: req.body.comment
        })

        foundGame.reviews.push(newReview._id)
        await foundGame.save()
    }

    res.redirect("/games/my-games")
})

module.exports = router