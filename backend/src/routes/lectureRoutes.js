const express = require('express');
const { getLectures, addLecture } = require('../controllers/lectureController');
const { authenticateToken, isTeacher } = require('../middlewares/auth');

const router = express.Router();

router.get('/courses/:courseId/lectures', authenticateToken, getLectures);
router.post('/courses/:courseId/lectures', authenticateToken, isTeacher, addLecture);

module.exports = router;