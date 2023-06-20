// variables for page elements

// to display time and score
let timeElement = document.querySelector("p.time");
let timeLeft = 75;
let scoreElement = document.querySelector("#score");


//  introductory page
const introContainer = document.querySelector("#intro");


//question section
const questionsEl = document.querySelector("#questions");

//where question goes
let questionElement = document.querySelector("#question");

// how many questions answered
let questionCount = 0;
// div correct or wrong answer
const booleanElement = document.querySelector("#boolean");

// section final
const resultElement = document.querySelector("#quizend");

// user initials
let initialsInput = document.querySelector("#initials");

//  highscores elements
const highscoresEl = document.querySelector("#highscores");

// score list
let scoreListElement = document.querySelector("#score-list");

// array of scores list
let scoreListArray = [];


// start quiz button
const startQuizBtn = document.querySelector("#startQuiz");
// answer button class
const answerBtn = document.querySelectorAll("button.answerBtn")
const choice1Btn = document.querySelector("#answer1");
const choice2Btn = document.querySelector("#answer2");
const choice3Btn = document.querySelector("#answer3");
const choice4Btn = document.querySelector("#answer4");

// submit-score button
const submitScoreBtn = document.querySelector("#submit-score");

// go back button
const goBackBtn = document.querySelector("#goback");

// reset scores button
const resetScoreBtn = document.querySelector("#resetscores");

// view-scores button
const viewScoreBtn = document.querySelector("#view-scores");

// timer
function setTime() {
    let timerInterval = setInterval(function () {
        timeLeft--;
        timeElement.textContent = `Time:${timeLeft}s`;

        if (timeLeft === 0 || questionCount === Questions.length) {
            clearInterval(timerInterval);
            questionsEl.style.display = "none";
            resultElement.style.display = "block";
            scoreElement.textContent = timeLeft;
        }
    }, 1000);
}

// start quiz with timer and set up questions
function startQuiz() {
    introContainer.style.display = "none";
    questionsEl.style.display = "block";
    questionCount = 0;

    setTime();
    showQuestion(questionCount);
}

// function to set question; takes in a count and displays the next question/answers
function showQuestion(id) {
    if (id < Questions.length) {
        questionElement.textContent = Questions[id].question;
        choice1Btn.textContent = Questions[id].answers[0];
        choice2Btn.textContent = Questions[id].answers[1];
        choice3Btn.textContent = Questions[id].answers[2];
        choice4Btn.textContent = Questions[id].answers[3];
    }
}

// function to check answer and then move to next question
function checkAnswer(event) {
    event.preventDefault();

    // show section for Correct or wrong answer and append message
    booleanElement.style.display = "block";
    let p = document.createElement("p");
    booleanElement.appendChild(p);

    // timeout after 1 second
    setTimeout(function () {
        p.style.display = 'none';
    }, 1000);

    // checking answer
    if (Questions[questionCount].correctAnswer === event.target.value) {
        p.textContent = "Correct!";
    } else if (Questions[questionCount].correctAnswer !== event.target.value) {
        timeLeft = timeLeft - 10;
        p.textContent = "Wrong!";
    }

    // increment so the questions index is increased
    if (questionCount < Questions.length) {
        questionCount++;
    }
    // call showQuestion to bring in next question when any answer Btn is clicked
    showQuestion(questionCount);
}

function addScore(event) {
    event.preventDefault();

   resultElement.style.display = "none";
    highscoresEl.style.display = "block";

    let init = initialsInput.value.toUpperCase();
    scoreListArray.push({ initials: init, score: timeLeft });

    // sort scores
    scoreListArray = scoreListArray.sort((a, b) => {
        if (a.score < b.score) {
          return 1;
        } else {
          return -1;
        }
      });
    
    scoreListElement.innerHTML="";
    for (let i = 0; i < scoreListArray.length; i++) {
        let li = document.createElement("li");
        li.textContent = `${scoreListArray[i].initials}: ${scoreListArray[i].score}`;
        scoreListElement.append(li);
    }

    // Add to local storage
    saveScores();
    displayScores();
}

function saveScores() {
    localStorage.setItem("scoreList", JSON.stringify(scoreListArray));
}

function displayScores() {
    // Get saved scores from localStorage
    // Parse the JSON string to an object
    let savedScoreList = JSON.parse(localStorage.getItem("scoreList"));

    // If scores were retrieved from localStorage, update the scorelist array to it
    if (savedScoreList !== null) {
        scoreListArray = savedScoreList;
    }
}

// clear scores
function resetScores() {
    localStorage.clear();
    initialsInput.textContent="";
    scoreListElement.textContent="";
    highscoreEl.textContent="";
}

// adding EventListeners

// Start timer and display first question when click start quiz
startQuizBtn.addEventListener("click", startQuiz);

// Check answers loop
answerBtn.forEach(item => {
    item.addEventListener("click", checkAnswer);
});

// Add score to the score list along with initials
submitScoreBtn.addEventListener("click", addScore);

// Go Back Button
goBackBtn.addEventListener("click", function () {
   
    questionsEl.style.display="none";
    highscoresEl.style.display = "none";
    introContainer.style.display = "block";
   timeLeft = 75;
    timeElement.textContent = `Time:${timeLeft}s`;
});

// Reset the scores
resetScoreBtn.addEventListener("click", resetScores);

// View/Hide High Scores Button
viewScoreBtn.addEventListener("click", function () {
    if (highscoresEl.style.display === "none") {
        highscoresEl.style.display = "block";
    } else if (highscoresEl.style.display === "block") {
        highscoresEl.style.display = "none";
    } else {
        return alert("There are no scores to show, yet.");
    }
});
