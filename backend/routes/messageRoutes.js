const express = require('express');
const Message = require('../models/messageModel');
const router = express.Router();

router.post('/messages', async (req, res) => {
    try {
        const message = new Message({ text: req.body.text });
        await message.save();
        res.status(201).send(message);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find({});
        console.log(messages);
        res.send(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
