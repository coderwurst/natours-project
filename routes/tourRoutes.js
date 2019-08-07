const express = require('express');

const tourControler = require('../controllers/tourController');

const router = express.Router();

router.param('id', tourControler.checkId);

router
  .route('/')
  .get(tourControler.getAllTours)
  .post(tourControler.createTour);

router
  .route('/:id')
  .get(tourControler.getTour)
  .patch(tourControler.updateTour)
  .delete(tourControler.deleteTour);

module.exports = router;
