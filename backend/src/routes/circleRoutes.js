const express = require('express');
const router = express.Router();
const {
  getAllCircles,
  getCircleById,
  getCircleBySlug,
  createCircle,
  updateCircle,
  deleteCircle
} = require('../controllers/circleController');

router.route('/')
  .get(getAllCircles)
  .post(createCircle);

router.route('/:id')
  .get(getCircleById)
  .put(updateCircle)
  .delete(deleteCircle);

router.get('/slug/:slug', getCircleBySlug);

module.exports = router;
