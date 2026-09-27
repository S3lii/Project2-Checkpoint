const mongoose = require("mongoose")
const Game = require("./models/Game.js")
const gamesSeed = require("./seeds/games.seed.js")

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    const gameCount = await Game.countDocuments()
    if (gameCount === 0) {
      await Game.insertMany(gamesSeed)
    }
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = connectToDB