const express = require('express');
const Contact = require('../models/Contact');
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

    try {
      await sendUserConfirmation(contact);
    } catch (emailError) {
      console.error('Failed to send user confirmation email:', emailError);
    }

    try {
      await sendAdminNotification(contact);
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    res.status(201).json({ message: 'Message sent successfully! We will contact you soon.', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

module.exports = router;
