const express = require("express")
const router = express.Router()
const Game = require("../models/Game.js")

router.get("/" , async (req , res) => {
  const games = await Game.find()
  res.render("all-games.ejs" , { games: games })
})

module.exports = router