let buttons = document.querySelectorAll(".quiz-button");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        window.location.href = "quiz.html";
    });
});
