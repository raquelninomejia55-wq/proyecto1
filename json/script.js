let questions = {};
let currentQuestion = 0;
let score = 0;
let playerName = "";
let timer;
let timeLeft = 15;
let selectedCategory = "";
let level = 1;

fetch("questions.json")
.then(response => response.json())
.then(data => {
    questions = data;
});

function startGame() {

    playerName = document.getElementById("player-name").value;
    selectedCategory = document.getElementById("category").value;

    if (!playerName) {
        alert("Por favor ingresa tu nombre");
        return;
    }

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    score = 0;
    currentQuestion = 0;
    level = 1;

    showQuestion();
}

function showQuestion(){

    let categoryQuestions = questions[selectedCategory];

    if (currentQuestion >= categoryQuestions.length){
        endGame();
        return;
    }

    let q = categoryQuestions[currentQuestion];

    document.getElementById("question").innerText = q.pregunta;
    document.getElementById("level").innerText = `Nivel: ${level}`;

    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.opciones.forEach(opcion => {

        let btn = document.createElement("button");
        btn.innerText = opcion;

        btn.onclick = () => checkAnswer(opcion);

        optionsDiv.appendChild(btn);
    });

    timeLeft = 15;
    document.getElementById("timer").innerText = `Tiempo: ${timeLeft}s`;

    clearInterval(timer);

    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("timer").innerText = `Tiempo: ${timeLeft}s`;

        if(timeLeft < 0){

            clearInterval(timer);
            currentQuestion++;
            level++;

            showQuestion();
        }

    },1000);
}

function checkAnswer(opcion){

    let q = questions[selectedCategory][currentQuestion];

    if (opcion === q.respuesta){

        score++;
        document.getElementById("correcto-sound").play();

    } else {

        document.getElementById("wrong-sound").play();
    }

    currentQuestion++;
    level++;

    showQuestion();
}

function endGame(){

    clearInterval(timer);

    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");

    document.getElementById("score").innerText =
    `${playerName}, tu puntaje es: ${score}`;

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.push({nombre: playerName, puntos: score});

    ranking.sort((a,b)=> b.puntos - a.puntos);

    localStorage.setItem("ranking", JSON.stringify(ranking));

    let rankingList = document.getElementById("ranking");

    rankingList.innerHTML = "";

    ranking.slice(0,5).forEach(r => {

        let li = document.createElement("li");

        li.innerText = `${r.nombre}: ${r.puntos} puntos`;

        rankingList.appendChild(li);
    });
}

function restartGame(){

    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    currentQuestion = 0;
    score = 0;
    level = 1;

    showQuestion();
}

function toggleTheme(){
    document.body.classList.toggle("dark-mode");
}