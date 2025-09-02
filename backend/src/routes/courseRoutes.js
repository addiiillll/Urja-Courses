const express = require('express');
const { getCourses, createCourse, togglePublishStatus } = require('../controllers/courseController');
const { authenticateToken, isAdmin, isTeacher } = require('../middlewares/auth');

const router = express.Router();

router.get('/courses', authenticateToken, getCourses);
router.post('/courses', authenticateToken, isTeacher, createCourse);
router.put('/courses/:courseId/publish', authenticateToken, isAdmin, togglePublishStatus);

module.exports = router;