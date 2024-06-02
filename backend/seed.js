const mongoose = require('mongoose');
const Message = require('./models/messageModel');

mongoose.connect('mongodb://localhost:27017/myNewDatabase', {useUnifiedTopology: true });

const messages = [
    { text: 'Hello, World!' },
    { text: 'This is a message' },
];

Message.insertMany(messages)
    .then(() => {
        console.log('Inserted initial messages');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error inserting messages:', err);
        mongoose.connection.close();
});