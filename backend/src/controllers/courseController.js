const Course = require('../models/Course');

const getCourses = async (req, res) => {
  try {
    let courses;
    if (req.user.role === 'admin') {
      courses = await Course.findAll();
    } else {
      courses = await Course.findByTeacherId(req.user.id);
    }
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const courseId = await Course.create(req.user.id, title, description);
    res.status(201).json({ id: courseId, message: 'Course created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const togglePublishStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    await Course.togglePublishStatus(courseId);
    res.json({ message: 'Course publish status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getCourses, createCourse, togglePublishStatus };