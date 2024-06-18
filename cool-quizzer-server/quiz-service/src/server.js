const express = require('express');
const dotenv = require('dotenv');
const { createQuiz, getQuiz, getAllQuizzes, updateQuiz, updateQuizStats, deleteQuiz, markShortAnswerQuestion } = require('./quiz-controller');

dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(express.json());


// Endpoints
app.get('/api/hello', (req, res) => {
    res.send('QUIZ_SERVICE: Hello!');
});
app.post('/api/quiz', createQuiz);
app.get("/api/quiz/:id", getQuiz);
app.get('/api/quiz', getAllQuizzes);
app.get('/api/marking/shortanswer', markShortAnswerQuestion);
app.put('/api/quiz/:id', updateQuiz);
app.put('/api/stats/:id', updateQuizStats);
app.delete('/api/quiz/:id', deleteQuiz);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});