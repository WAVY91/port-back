const express = require('express');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');
const { sendAdminNotification, sendUserConfirmation } = require('../config/email');

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();

    sendUserConfirmation(contact).catch(err => console.error('Failed to send user confirmation:', err));
    sendAdminNotification(contact).catch(err => console.error('Failed to send admin notification:', err));

    res.status(201).json({ message: 'Message sent successfully! We will contact you soon.', contact });
  } catch (error) {
    console.error('Error in contact form:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'attended'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending or attended' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact status updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact status', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

module.exports = router;
