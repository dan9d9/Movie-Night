const router = require('express').Router();
const Movie = require('../models/Movie');

router.get('/', async (req, res) => {
	try{
		const movies = await Movie.find();
		res.json(movies);
	}catch(err) {
		res.json({message: err});
	}
});

router.get('/:movieId', async (req, res) => {
	const { movieId } = req.params;

	try {
		const oneMovie = await Movie.findById(movieId);
		res.json(oneMovie);
	}catch(err) {
		res.json({message: err});
	}
});

router.post('/new', async (req, res) => {
	const { title, summary, url } = req.body;
	if(!title) {return res.status(400).json({message: 'Missing title'})}

	const movie = new Movie({
		title,
		summary,
		url
	});

	try {
		const savedMovie = await movie.save();
		res.json(data);
	} catch(err) {
		res.json({message: err});
	}
});

router.delete('/:movieId', async (req, res) => {
    const { movieId } = req.params;

    try{
      const deleted = await Movie.deleteOne({_id});
      res.json(deleted);
    }
    catch(err){
      res.json({message: err})
    } 
});


module.exports = router;