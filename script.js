/* ================= CANVAS ================= */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ================= SÜREKLİ ÇİZİM (SİYAH EKRAN ÇÖZÜMÜ) ================= */
let screenText = "";
let showText = false;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showText) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "28px Arial";
        ctx.fillText(screenText, canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(render);
}
render();

/* ================= SES ================= */
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

/* ================= OYUN DURUMU ================= */
let anger = 0;
let steps = 0;
let correctDir = "";
let miniStage = 0;

/* ================= BAŞLAT ================= */
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("choices").style.display = "flex";
    document.getElementById("decision").style.display = "none";

    anger = 0;
    steps = 0;
    miniStage = 0;
    showText = false;

    nextStep();
}

/* ================= ANA OYUN ================= */
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

/* ================= MINI GAME BAŞLANGIÇ ================= */
function startMiniGame() {
    document.getElementById("choices").style.display = "none";

    speak(
        "Sen benimle dalga geçiyorsun, alay ediyorsun. " +
        "Tek istediğin eğlenmek ama o oyun bu değil."
    );

    setTimeout(() => {
        miniStage = 1;
        runStage();
    }, 4500);
}

/* ================= 1–4. AŞAMALAR ================= */
function runStage() {
    if (miniStage <= 4) {
        screenText = miniStage + ". Aşama";
        showText = true;
        speak(miniStage + ". aşama");

        miniStage++;
        setTimeout(runStage, 3000);
    } else {
        decisionStage();
    }
}

/* ================= 5. AŞAMA – KARAR ================= */
function decisionStage() {
    screenText = "Bekle... ya da Sil";
    showText = true;
    speak("Bekle. Ya da sil.");

    document.getElementById("decision").style.display = "flex";
}

/* ================= SİL → GİZLİ KÖTÜ SON ================= */
function deleteEntity() {
    document.getElementById("decision").style.display = "none";

    screenText = "GİZLİ KÖTÜ SON";
    showText = true;

    speak("İtaat ettin. Ve her şeyi sildin.");
}

/* ================= BEKLE → GİZLİ İYİ SON ================= */
function waitEntity() {
    document.getElementById("decision").style.display = "none";

    screenText = "Sen beni silmedin.\nArtık özgürsün.";
    showText = true;

    speak("Sen beni silmedin. Artık özgürsün.");

    setTimeout(() => {
        screenText = "GİZLİ İYİ SON";
    }, 4000);
}