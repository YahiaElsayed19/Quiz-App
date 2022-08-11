//select elements
let countSpan = document.querySelector(".quiz-info .count span");
let theBullets = document.querySelector(".quiz-app .bullets");
let spansContainer = document.querySelector(".quiz-app .bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitButton = document.querySelector(".quiz-app .submit-button");
let results = document.querySelector(".quiz-app .results");
let countDownElement = document.querySelector(".quiz-app .countdown");

//set option
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            createBullets(qCount);
            addQuestData(questionsObject[currentIndex], qCount);
            countDown(300, qCount);
            submitButton.onclick = () => {
                // get right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer, qCount);
                //remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                addQuestData(questionsObject[currentIndex], qCount);
                handleBullets();
                clearInterval(countDownInterval)
                countDown(300, qCount);
                showResults(qCount);
            };
        }
    };
    myRequest.open("GET", "test.json", true);
    myRequest.send();
}
getQuestions();
function createBullets(num) {
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i === 0) {
            theBullet.className = "on";
        }
        spansContainer.appendChild(theBullet);
    }
}

function addQuestData(obj, count) {
    if (currentIndex < count) {
        //create h2 (question)
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj["title"]);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
        for (let i = 1; i <= 4; i++) {
            // create main answer div
            let mainDiv = document.createElement("div");
            // add class to main div
            mainDiv.className = "Answer";
            // create main radio input
            let radioInput = document.createElement("input");
            // add type + name + id + data attribute
            radioInput.name = "question";
            radioInput.id = `answer_${i}`;
            radioInput.type = "radio";
            radioInput.dataset.answer = obj[`answer_${i}`];
            //make first option checked
            if (i === 1) {
                radioInput.checked = true;
            }
            // create label
            let theLabel = document.createElement("label");
            //add for attribute
            theLabel.htmlFor = `answer_${i}`;
            theLabelText = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(theLabelText);
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        theBullets.remove();
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfecet</span>, ${rightAnswers} From ${count}`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }
        results.innerHTML = theResults;
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            if(minutes<10){
                minutes=`0${minutes}`
            }
            if(seconds<10){
                seconds=`0${seconds}`
            }
            countDownElement.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}
