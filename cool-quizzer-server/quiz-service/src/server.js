const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require("cors");
const { createQuiz, getQuiz, getAllQuizzes, updateQuiz, updateQuizStats, deleteQuiz, markShortAnswerQuestion } = require('./quiz-controller');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Endpoints
// app.options("/api/*", function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Content-Type, Authorization, Content-Length, X-Requested-With"
//     );
//     res.send(200);
// });
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