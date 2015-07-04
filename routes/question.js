var express = require('express');
var Question = require('../models/question')
var router = express.Router();


router.route('/')

    // create a question (accessed at POST http://localhost:8080/api/question)
    .post(function(req, res) {
        console.log('post');

        var question = new Question();      // create a new instance of the Question model
        question.question = req.body.question;  // set the question name (comes from the request)
        question.answer = req.body.answer;
        question.min = req.body.min;
        question.max = req.body.max;

        // save the question and check for errors
        question.save(function(err) {
            if (err)
                res.send(err);
        });

        res.json({ message: 'Question created!' });

        // res.setHeader('Content-Type', 'application/json');
        // res.send(JSON.stringify(question));
    })

    // get all the bears (accessed at GET http://localhost:8080/api/question)
    .get(function(req, res) {

        // Question.find({}, function(err, questions) {
        //     if (err)
        //         res.send(err);

        //     res.json(questions);
        // });

        Question.find({}, function(err, docs) {
    if (!err){ 
        console.log(docs);
        process.exit();
    } else {throw err;}
});
    });

module.exports = router;
