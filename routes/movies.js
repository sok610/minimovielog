const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// [GET] New Movie Form
router.get('/new', (req, res) => {
    res.render('new');
});

// [POST] New Movie Form
router.post('/', async (req, res) => {
    const { title, review, rating } = req.body;
    try {
        const movie = new Movie({ title, review, rating });
        await movie.save();
        res.redirect('/movies');
    } catch (err) {
        console.error(err);
        res.send("ERROR OCCURRED!");
    }
});

// [GET] a list of movies + search function
router.get('/', async (req, res) => {
    const { q, minRating } = req.query;

    let filter = {};

    if (q) {
        filter.title = { $regex: q, $options: 'i' };
    }

    if (minRating) {
        filter.rating = {$gte: parseInt(minRating) };
    }
    
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.render('index', { movies, query: q || '', minRating: minRating || '' });
});

// [GET] edit form
router.get('/:id/edit', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.render('edit', { movie });
});

// [POST] confirm changes from edit form
router.post('/:id/update', async (req, res) => {
    const { title, review, rating } = req.body;
    await Movie.findByIdAndUpdate(req.params.id, { title, review, rating });
    res.redirect('/movies');
});

// [POST] delete movie
router.post('/:id/delete', async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/movies');
});

module.exports = router;