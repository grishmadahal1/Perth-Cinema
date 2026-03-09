require('dotenv').config();
const mongoose = require('mongoose');
const Cinema = require('../models/Cinema');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');

const SESSION_HOURS = [11, 14.5, 19];
const ROWS = ['A', 'B', 'C', 'D', 'E'];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Cinema.deleteMany({});
  await Showtime.deleteMany({});
  console.log('Cleared existing data');

  const cinemas = await Cinema.insertMany([
    { name: 'Event Cinemas Garden City', address: '125 Riseley St',   suburb: 'Booragoon', totalScreens: 8,  isActive: true },
    { name: 'Hoyts Karrinyup',           address: '200 Karrinyup Rd', suburb: 'Karrinyup', totalScreens: 10, isActive: true },
    { name: 'Palace Raine Square',        address: '300 Murray St',   suburb: 'Perth CBD',  totalScreens: 6,  isActive: true },
    { name: 'Reading Cinemas Belmont',    address: '227 Belmont Ave', suburb: 'Belmont',    totalScreens: 7,  isActive: true },
    { name: 'Ace Cinemas Morley',         address: '238 Walter Rd',   suburb: 'Morley',     totalScreens: 5,  isActive: true },
  ]);
  console.log(`Seeded ${cinemas.length} cinemas`);

  let movie = await Movie.findOne({ tmdbId: 550 });
  if (!movie) {
    movie = await Movie.create({
      tmdbId: 550,
      title: 'Fight Club',
      releaseDate: new Date('1999-10-15'),
      voteAverage: 8.8,
      runtime: 139,
    });
  }
  console.log(`Using movie: ${movie.title}`);

  const showtimes = [];

  for (const cinema of cinemas) {
    for (let day = 0; day < 7; day++) {
      for (const hour of SESSION_HOURS) {

        const startTime = new Date();
        startTime.setDate(startTime.getDate() + day);
        startTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 120);

        const seats = [];
        for (const row of ROWS) {
          for (let num = 1; num <= 10; num++) {
            seats.push({
              seatNumber: `${row}${num}`,
              row,
              seatType: row === 'A' ? 'premium' : 'standard',
              isBooked: Math.random() < 0.3,
            });
          }
        }

        showtimes.push({
          movie: movie._id,
          cinema: cinema._id,
          startTime,
          endTime,
          ticketPrice: 22,
          seats,
        });
      }
    }
  }

  await Showtime.insertMany(showtimes);
  console.log(`Seeded ${showtimes.length} showtimes`);

  await mongoose.disconnect();
  console.log('Done! Database seeded successfully.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});