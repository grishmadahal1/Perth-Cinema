const mongoose = require('mongoose');


const cinemaSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true
    },
    address:{
      type: String,
      required: true
    },
    suburb:{
      type: String,
      required: true
    },
    totalScreens:{
      type: Number
    },
    isActive:{
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields to every document
  }
);


cinemaSchema.statics.findActiveCinemas = async function () {
  return this.find({ isActive: true });
};

cinemaSchema.methods.getFullAddress = function () {
  return `${this.name}, ${this.address}, ${this.suburb}`;
};          


// 4. Register the schema as a model and export it
// 'Cinema' becomes the MongoDB collection name (stored as 'cinemas' in the DB)
const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;