const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'pending',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },  
    
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields to every document
  }
);

// Static Method

// Booking.findByUser(userId)

// Returns all bookings for a user

// Instance Method

// booking.cancel()

// Sets status → cancelled

// Saves booking

bookingSchema.statics.findByUser = async function (userId) {
  return this.find({ user: userId }).populate('showtime').populate('user');
};

bookingSchema.methods.cancel = async function () {
  this.status = 'cancelled';
  await this.save();
};

// 4. Register the schema as a model and export it
// 'Booking' becomes the MongoDB collection name (stored as 'bookings' in the DB)   
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
