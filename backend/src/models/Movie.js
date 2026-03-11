const mongoose = require('mongoose');

// 1. Define the schema — this is the "blueprint" for every Movie document
const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,  // this field MUST be provided or Mongoose will throw an error
      unique: true,    // no two movies can have the same tmdbId
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,   // a short plot summary — not required
    },
    posterPath: {
      type: String,   // URL path to the movie poster image
    },
    releaseDate: {
      type: Date,
    },
    genres: {
      type: [String], // an array of strings e.g. ['Action', 'Drama']
    },
    runtime: {
      type: Number,   // length of the movie in minutes
    },
    voteAverage: {
      type: Number,   // TMDB rating score e.g. 8.4
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields to every document
  }
);

// 2. INSTANCE METHOD — called on a single movie document
// Usage: const movie = await Movie.findOne(...);  movie.getSummary();
movieSchema.methods.getSummary = function () {
  const year = this.releaseDate
    ? new Date(this.releaseDate).getFullYear()
    : 'Unknown Year';
  return `${this.title} (${year}) - ${this.voteAverage}/10`;
};

// 3. STATIC METHOD — called on the Movie model itself (not on a single document)
// Usage: const movie = await Movie.findByTmdbId(550);
movieSchema.statics.findByTmdbId = async function (tmdbId) {
  return this.findOne({ tmdbId });
};

// 4. Register the schema as a model and export it
// 'Movie' becomes the MongoDB collection name (stored as 'movies' in the DB)
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;