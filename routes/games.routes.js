const express = require("express")
const router = express.Router()
const Game = require("../models/Game.js")

router.get("/" , async (req , res) => {
  const games = await Game.find()
  res.render("all-games.ejs" , { games: games })
})


router.get("/:gameId" , async (req , res) => {
    const foundGame = await Game.findById(req.params.gameId)
    res.render("game-details.ejs" , { game: foundGame })
})

module.exports = router
