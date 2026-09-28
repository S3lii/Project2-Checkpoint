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

router.post("/:gameId/reviews" , isSignedIn , async (req , res) => {
    const foundGame = await Game.findById(req.params.gameId)
    if (!foundGame) return res.redirect("/games")

    let isPlayed = false
    if (req.body.played === "on") isPlayed = true

    let isCompleted = false
    if (req.body.completed === "on") isCompleted = true

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

router.get("/:gameId/reviews/:reviewId/edit" , isSignedIn , async (req , res) => {
    const foundGame = await Game.findById(req.params.gameId)
    const foundReview = await Review.findById(req.params.reviewId)

    if (!foundReview || !foundReview.user.equals(req.session.user._id)) {
        return res.send("You are not authorized to edit this review.")
    }

    res.render("edit-review.ejs" , {
        game: foundGame , 
        review: foundReview
    })
})

router.put("/:gameId/reviews/:reviewId" , isSignedIn , async (req , res) => {
    const foundReview = await Review.findById(req.params.reviewId)

    if (!foundReview || !foundReview.user.equals(req.session.user._id)) {
        return res.send("You are not authorized to update this review.")
    }

    let isPlayed = false
    if (req.body.played === "on") isPlayed = true

    let isCompleted = false
    if (req.body.completed === "on") isCompleted = true

    foundReview.played = isPlayed
    foundReview.completed = isCompleted
    foundReview.rating = Number(req.body.rating)
    foundReview.difficulty = req.body.difficulty
    foundReview.comment = req.body.comment
    await foundReview.save()

    res.redirect("/games/my-games")
})

router.delete("/:gameId/reviews/:reviewId" , isSignedIn , async (req , res) => {
    const foundReview = await Review.findById(req.params.reviewId)

    if (!foundReview || !foundReview.user.equals(req.session.user._id)) {
        return res.send("You are not authorized to delete this review.")
    }

    await Game.findByIdAndUpdate(req.params.gameId , {
        $pull: { reviews: req.params.reviewId }
    })

    await Review.findByIdAndDelete(req.params.reviewId)

    res.redirect("/games/my-games")
})
module.exports = router