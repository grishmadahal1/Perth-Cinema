const mongoose = require('mongoose');


const watchlistSchema = new mongoose.Schema(
  {
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
      }
    ]           
    
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields to every document
  }
);
      

watchlistSchema.methods.addMovie = async function (movieId) {
  if (!this.movies.includes(movieId)) {
    this.movies.push(movieId);
    await this.save();
  }
}
watchlistSchema.statics.findByUser = async function (userId) {
  return this.findOne({ user: userId }).populate('movies');
};
// 4. Register the schema as a model and export it
// 'Cinema' becomes the MongoDB collection name (stored as 'cinemas' in the DB)
const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
