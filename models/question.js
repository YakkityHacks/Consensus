// app/models/question.js

var mongoose     = require('mongoose');

var QuestionSchema   = new mongoose.Schema({
    question: 'string',
    answer: 'number',
    min: 'number',
    max: 'number',
    steps: 'number'
});

module.exports = mongoose.model('Question', QuestionSchema);
