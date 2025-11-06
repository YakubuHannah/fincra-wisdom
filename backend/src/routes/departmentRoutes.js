const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByCircle,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

router.route('/')
  .get(getAllDepartments)
  .post(createDepartment);

router.route('/:id')
  .get(getDepartmentById)
  .put(updateDepartment)
  .delete(deleteDepartment);

router.get('/circle/:circleId', getDepartmentsByCircle);
router.get('/slug/:slug', getDepartmentBySlug);

module.exports = router;
