let buttons = document.querySelectorAll(".quiz");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        window.location.href = "quiz.html";
    });
});
