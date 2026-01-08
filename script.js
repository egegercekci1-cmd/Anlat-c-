const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ---------- SES ---------- */
const synth = window.speechSynthesis;

function speak(text) {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "tr-TR";
    u.rate = 0.85;
    u.pitch = 0.6;

    const voices = synth.getVoices();
    const trVoice = voices.find(v => v.lang.includes("tr"));
    if (trVoice) u.voice = trVoice;

    synth.speak(u);
}

/* ---------- OYUN DURUMU ---------- */
let anger = 0;
let steps = 0;
let correctDir = "";
let miniStage = 0;

/* ---------- BAŞLAT ---------- */
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("choices").style.display = "flex";
    document.getElementById("decision").style.display = "none";

    anger = 0;
    steps = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nextStep();
}

/* ---------- ANA OYUN ---------- */
function nextStep() {
    if (steps >= 10) {
        startMiniGame();
        return;
    }

    steps++;
    correctDir = Math.random() > 0.5 ? "left" : "right";

    speak(correctDir === "left" ? "Sola bas." : "Sağa bas.");
}

function choose(choice) {
    if (choice === "none") {
        anger++;
    } else if (choice === correctDir) {
        anger = Math.max(0, anger - 1);
    } else {
        anger++;
    }
    nextStep();
}

/* ---------- MINI GAME ---------- */
function startMiniGame() {
    document.getElementById("choices").style.display = "none";
    speak("Sen benimle dalga geçiyorsun, alay ediyorsun. Tek istediğin eğlenmek ama o oyun bu değil.");

    setTimeout(() => {
        miniStage = 1;
        runStage();
    }, 4500);
}

function runStage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "26px Arial";

    if (miniStage <= 4) {
        ctx.fillText(`${miniStage}. Aşama`, canvas.width / 2, canvas.height / 2);
        speak(`${miniStage}. aşama`);

        miniStage++;
        setTimeout(runStage, 3000);
    } else {
        decisionStage();
    }
}

/* ---------- 5. AŞAMA KARAR ---------- */
function decisionStage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    speak("Bekle. Ya da sil.");

    document.getElementById("decision").style.display = "flex";
}

function deleteEntity() {
    document.getElementById("decision").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    speak("İtaat ettin. Ve her şeyi sildin.");

    ctx.font = "28px Arial";
    ctx.fillText("GİZLİ KÖTÜ SON", canvas.width / 2, canvas.height / 2);
}

function waitEntity() {
    document.getElementById("decision").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    speak("Sen beni silmedin. Artık özgürsün.");

    setTimeout(() => {
        ctx.font = "30px Arial";
        ctx.fillText("GİZLİ İYİ SON", canvas.width / 2, canvas.height / 2);
    }, 4000);
}