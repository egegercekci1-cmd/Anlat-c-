const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const synth = window.speechSynthesis;
let anger = 0;
let steps = 0;
let gameStarted = false;
let miniGameStage = 0;
let alive = true;

function speak(text) {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "tr-TR";
    u.rate = 0.85;
    u.pitch = 0.6;
    const voices = synth.getVoices();
    const male = voices.find(v => v.lang.includes("tr"));
    if (male) u.voice = male;
    synth.speak(u);
}

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("choices").style.display = "block";
    gameStarted = true;
    nextStep();
}

function nextStep() {
    if (steps >= 10) {
        startMiniGame();
        return;
    }
    steps++;
    const dir = Math.random() > 0.5 ? "left" : "right";
    speak(dir === "left" ? "Sola bas." : "Sağa bas.");
}

function choose(choice) {
    if (!gameStarted) return;

    const correct = synth.speaking ? null : null;
    if (choice === "none") {
        anger++;
    } else {
        anger += Math.random() > 0.5 ? -1 : 1;
    }
    nextStep();
}

function startMiniGame() {
    document.getElementById("choices").style.display = "none";
    speak("Sen benimle dalga geçiyorsun, alay ediyorsun. Tek istediğin eğlenmek ama o oyun bu değil.");
    setTimeout(() => {
        miniGameStage = 1;
        runStage();
    }, 4000);
}

function runStage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (miniGameStage === 5) {
        decisionStage();
        return;
    }
    speak(miniGameStage + ". aşama.");
    setTimeout(() => {
        miniGameStage++;
        runStage();
    }, 3000);
}

function decisionStage() {
    speak("Bekle... ya da sil.");
    document.getElementById("decision").style.display = "block";
}

function deleteEntity() {
    document.getElementById("decision").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GİZLİ KÖTÜ SON", canvas.width / 2, canvas.height / 2);
    speak("İtaat ettin. Ve her şeyi sildin.");
}

function waitEntity() {
    document.getElementById("decision").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    speak("Sen beni silmedin. Artık özgürsün.");

    setTimeout(() => {
        ctx.font = "26px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GİZLİ İYİ SON", canvas.width / 2, canvas.height / 2);
    }, 4000);
}