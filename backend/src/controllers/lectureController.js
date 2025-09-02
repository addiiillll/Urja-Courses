const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

const getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.user.role === 'teacher' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const lectures = await Lecture.findByCourseId(courseId);
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, video_url } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only add lectures to your own courses' });
    }

    const lectureId = await Lecture.create(courseId, title, video_url);
    res.status(201).json({ id: lectureId, message: 'Lecture added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getLectures, addLecture };