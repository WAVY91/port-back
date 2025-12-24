const express = require('express');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, image, liveLink, githubLink, technologies, featured } = req.body;

    if (!title || !description || !image || !liveLink || !githubLink) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const project = new Project({
      title,
      description,
      image,
      liveLink,
      githubLink,
      technologies: technologies || [],
      featured: featured || false,
    });

    await project.save();
    res.status(201).json({ message: 'Project added successfully!', project });
  } catch (error) {
    res.status(500).json({ message: 'Error adding project', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router;
