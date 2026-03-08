const mongoose = require('mongoose');


const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    seats: [
      {
        seatNumber: String, // e.g. "A1", "B5"
        isBooked: { type: Boolean, default: false },
      },
    ],
    ticketPrice: {
      type: Number,
      required: true,
    },  
    
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields to every document
  }
);
      
showtimeSchema.methods.getAvailableSeats = function () {
  return this.seats.filter(seat => !seat.isBooked);
};

showtimeSchema.statics.findAvailable = async function (movieId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    movie: movieId,
    startTime: { $gte: startOfDay, $lte: endOfDay },
    'seats.isBooked': false
  }).populate('cinema').populate('movie');
};  

// 4. Register the schema as a model and export it
// 'Cinema' becomes the MongoDB collection name (stored as 'cinemas' in the DB)
const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
