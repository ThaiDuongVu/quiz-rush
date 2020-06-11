const socket = io("http://localhost:3000/");

const questionText = document.querySelector(".question");
const buttons = document.querySelectorAll(".answer");
const scoreText = document.querySelector(".score");

const versusText = document.querySelector(".versus");
const stateText = document.querySelector(".state");

const questionSet = [
    {
        question: "What is JavaScript?",
        correctAnswer: "A programming language",

        incorrectAnswers: ["A subset of Java", "A dog", "A celebrity"]
    },
    {
        question: "Is Java the same as JavaScript?",
        correctAnswer: "No",

        incorrectAnswers: ["Yes", "Idk man", "Whatever"]
    },
    {
        question: "What is the best browser?",
        correctAnswer: "Internet Explorer",

        incorrectAnswers: ["Chrome", "Firefox", "Edge"]
    },
    {
        question: "Arrays start at?",
        correctAnswer: "0",

        incorrectAnswers: ["-1", "1", "it doesn't start"]
    },
    {
        question: "Is HTML a programming language",
        correctAnswer: "NOOOOO",

        incorrectAnswers: ["No", "Nope", "Hell no"]
    }
];

let questionIndex = 0;
let name = "";
let score = 0;

let quizEnded = false;

let correctStatements = ["Correct!", "Yes!", "Right!", "Nice!", "Perfect!", "Yeah!", "Amazing!", "Incredible!", "Fantastic!", "Great!"];
let incorrectStatements = ["Incorrect!", "No!", "Wrong!", "Nope!", "False!", "Disappointing!"];

random = (min, max) => {
    return (Math.floor(Math.random() * (max + 1)) + min);
}

getUserName = () => {
    name = prompt("What is your name");
    socket.emit("new-user", name);
}

waitForAnotherUser = () => {
    questionText.textContent = "Waiting to be matched...";

    buttons.forEach(button => {
        button.textContent = "";
    });
}

answerCorrectly = () => {
    socket.emit("question-answered");

    score++;
    updateScore();
    
    stateText.textContent = correctStatements[random(0, correctStatements.length - 1)];
}

answerIncorrectly = () => {
    stateText.textContent = incorrectStatements[random(0, incorrectStatements.length - 1)];
}

nextQuestion = () => {
    questionText.textContent = questionSet[questionIndex].question;

    let correctIndex = random(0, 3);
    let incorrectIndex = 0;

    for (let i = 0; i < buttons.length; i++) {
        if (i === correctIndex) {
            buttons[i].textContent = questionSet[questionIndex].correctAnswer;

            buttons[i].removeEventListener("click", answerCorrectly);
            buttons[i].removeEventListener("click", answerIncorrectly);

            buttons[i].addEventListener("click", answerCorrectly);
        } else {
            buttons[i].textContent = questionSet[questionIndex].incorrectAnswers[incorrectIndex];
            incorrectIndex++;

            buttons[i].removeEventListener("click", answerCorrectly);
            buttons[i].removeEventListener("click", answerIncorrectly);

            buttons[i].addEventListener("click", answerIncorrectly);
        }
    }
}

updateScore = () => {
    scoreText.textContent = "Your score is " + score;
}

endQuiz = () => {
    questionText.textContent = "End!";

    buttons.forEach(button => {
        button.remove();
    });

    let restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", () => {
        location.reload();
    });
    
    scoreText.append(restartButton);
    quizEnded = true;

    socket.emit("end-quiz", score);
}

getUserName();
updateScore();

socket.on("wait", waitForAnotherUser);

socket.on("start", (users) => {
    nextQuestion();

    versusText.innerHTML = `<strong>${users[0]}</strong> vs. <strong>${users[1]}</strong>`;
    stateText.textContent = "Start!";
});

socket.on("next-question", () => {
    if (questionIndex < questionSet.length - 1) {
        questionIndex++;
        nextQuestion();
    } else {
        endQuiz();
    }
});

socket.on("compare-score", (otherScore) => {
    if (score > otherScore) {
        stateText.textContent = "You won!";
    } else if (score < otherScore) {
        stateText.textContent = "You lost!";
    } else {
        stateText.textContent = "It's a tie!";
    }
});

socket.on("user-disconnect", (name) => {
    if (!quizEnded) {
        scoreText.textContent = `${name} disconnected`;
        endQuiz();
    }
});
