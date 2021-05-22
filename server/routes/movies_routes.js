const router = require('express').Router();
const Movie = require('../models/Movie');

// GET ALL MOVIES
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.json(movies);
  } catch (err) {
    return res.json({ message: err });
  }
});

// GET ONE MOVIE
router.get('/:movieId', async (req, res) => {
  const { movieId } = req.params;
  try {
    const oneMovie = await Movie.findById(movieId);
    return res.json(oneMovie);
  } catch (err) {
    return res.json({ message: err });
  }
});

// ADD NEW MOVIE
router.post('/new', async (req, res) => {
  const { title, array, approved } = req.body;
  if (!title || !array || approved === undefined) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  const movie = new Movie({
    title,
    array,
    approved,
  });

  try {
    const savedMovie = await movie.save();
    return res.json(savedMovie);
  } catch (err) {
    return res.json({ message: err });
  }
});

// DELETE ONE MOVIE
router.delete('/delete/:movieId', async (req, res) => {
  const { movieId } = req.params;
  try {
    const deleted = await Movie.deleteOne({ _id: movieId });
    return res.json(deleted);
  } catch (err) {
    return res.json({ message: err });
  }
});

// APPROVE MOVIE
router.patch('/approve/:movieId', async (req, res) => {
  const { movieId } = req.params;
  try {
    const toUpdate = await Movie.findById({ _id: movieId });
    toUpdate.approved = !toUpdate.approved;
    const updated = await toUpdate.save();

    return res.json(updated);
  } catch (err) {
    console.log('server:', err);
    return res.json({ message: err });
  }
});

// UPDATE MOVIE
router.put('/update', async (req, res) => {
  const { _id, title, hasInfo, summary, posterPath, videoPaths } = req.body;

  try {
    const updated = await Movie.findOneAndUpdate(
      { _id },
      { title, hasInfo, summary, posterPath, videoPaths }
    );
    return res.status(200).json(updated);
  } catch (e) {
    return res.send({ e });
  }
});

module.exports = router;
