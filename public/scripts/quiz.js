const socket = io("http://localhost:3000/");

const questionText = document.querySelector(".question");
const buttons = document.querySelectorAll(".answer");
const scoreText = document.querySelector(".score");

const questionSets = [
    {
        question: "What is JavaScript?",
        correctAnswer: "A programming language",

        incorrectAnswers: ["A car", "A dog", "A celebrity"]
    },
    {
        question: "Is Java the same as JavaScript?",
        correctAnswer: "No",

        incorrectAnswers: ["Yes", "Idk man", "Whatever"]
    }
];

let questionIndex = 0;
let name = "";
let score = 0;

random = (min, max) => {
    return (Math.floor(Math.random() * max) + min);
}

getUserName = () => {
    name = prompt("What is your name");
    socket.emit("new-user", name);
}

answerCorrectly = () => {
    console.log("correct!");

    if (questionIndex < questionSets.length - 1) {
        questionIndex++;
        nextQuestion();
    } else {
        endQuiz();
    }

    score++;
    updateScore();
}

answerIncorrectly = () => {
    if (questionIndex < questionSets.length - 1) {
        questionIndex++;
        nextQuestion();
    } else {
        endQuiz();
    }
}

nextQuestion = () => {
    questionText.textContent = questionSets[questionIndex].question;

    let correctIndex = random(0, 3);
    let incorrectIndex = 0;

    for (let i = 0; i < buttons.length; i++) {
        if (i === correctIndex) {
            buttons[i].textContent = questionSets[questionIndex].correctAnswer;

            buttons[i].addEventListener("click", answerCorrectly);
        } else {
            buttons[i].textContent = questionSets[questionIndex].incorrectAnswers[incorrectIndex];
            incorrectIndex++;

            buttons[i].addEventListener("click", answerIncorrectly);
        }
    }
}

updateScore = () => {
    scoreText.textContent = "Your current score is " + score;
}

endQuiz = () => {
    questionText.textContent = "End!";

    buttons.forEach(button => {
        button.remove();
    });
}

getUserName();
updateScore();

socket.on("start", (users) => {
    nextQuestion();
});

