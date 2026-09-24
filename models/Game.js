const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId , 
    ref: "Game" , 
    required: true
  } , 
  user: {
    type: mongoose.Schema.Types.ObjectId , 
    ref: "User" , 
    required: true
  } , 
  username: {
    type: String , 
    required: true
  } , 
  played: {
    type: Boolean , 
    default: false
  } , 
  completed: {
    type: Boolean , 
    default: false
  } , 
  rating: {
    type: Number , 
    required: true , 
    min: 1 , 
    max: 5
  } , 
  difficulty: {
    type: String , 
    enum: ["Easy" , "Medium" , "Hard" , "Nightmare"] , 
    default: "Medium"
  } , 
  comment: {
    type: String , 
    trim: true , 
    maxLength: 500
  }
} , { timestamps: true })

const Review = mongoose.model("Review" , reviewSchema)

module.exports = Review
