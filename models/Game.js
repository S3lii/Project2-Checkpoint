const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
  rawgId: {
    type: Number , 
    index: true
  } , 
  title: {
    type: String , 
    required: true , 
    trim: true
  } , 
  genre: {
    type: String , 
    trim: true
  } , 
  platform: {
    type: String , 
    trim: true
  } , 
  releaseYear: {
    type: Number
  } , 
  coverImage: {
    type: String , 
    default: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
  } , 
  description: {
    type: String , 
    trim: true
  } , 
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId , 
      ref: "Review"
    }
  ]
} , { timestamps: true })

const Game = mongoose.model("Game" , gameSchema)

module.exports = Game