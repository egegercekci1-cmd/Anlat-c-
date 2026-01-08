/* ========== CANVAS ========== */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ========== YARDIMCI ÇİZİM ========== */
function drawText(text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "28px Arial";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

/* ========== SES (iOS GÜVENLİ) ========== */
const synth = window.speechSynthesis;

function speak(text) {
    if (!synth) return;

    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "tr-TR";
    u.rate = 0.9;
    u.pitch = 0.6;

    synth.speak(u);
}

/* ========== OYUN DURUMU ========== */
let step = 0;
let correct = "";
let miniStage = 0;

/* ========== BAŞLAT ========== */
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("choices").style.display = "flex";
    document.getElementById("decision").style.display = "none";

    step = 0;
    nextCommand();
}

/* ========== ANA OYUN ========== */
function nextCommand() {
    if (step >= 10) {
        startMiniGame();
        return;
    }

    step++;
    correct = Math.random() > 0.5 ? "left" : "right";

    drawText(correct === "left" ? "SOL" : "SAĞ");
    speak(correct === "left" ? "Sola bas." : "Sağa bas.");
}

function choose(choice) {
    nextCommand();
}

/* ========== MINI GAME BAŞLANGIÇ ========== */
function startMiniGame() {
    document.getElementById("choices").style.display = "none";

    drawText("...");
    speak(
        "Sen benimle dalga geçiyorsun, alay ediyorsun. " +
        "Tek istediğin eğlenmek ama o oyun bu değil."
    );

    setTimeout(() => {
        miniStage = 1;
        runStage();
    }, 4500);
}

/* ========== 1–4. AŞAMALAR ========== */
function runStage() {
    if (miniStage <= 4) {
        drawText(miniStage + ". AŞAMA");
        speak(miniStage + ". aşama");

        miniStage++;
        setTimeout(runStage, 3000);
    } else {
        decisionStage();
    }
}

/* ========== 5. AŞAMA KARAR ========== */
function decisionStage() {
    drawText("BEKLE  /  SİL");
    speak("Bekle. Ya da sil.");

    document.getElementById("decision").style.display = "flex";
}

/* ========== SİL → GİZLİ KÖTÜ SON ========== */
function deleteEntity() {
    document.getElementById("decision").style.display = "none";

    drawText("GİZLİ KÖTÜ SON");
    speak("İtaat ettin. Ve her şeyi sildin.");
}

/* ========== BEKLE → GİZLİ İYİ SON ========== */
function waitEntity() {
    document.getElementById("decision").style.display = "none";

    drawText("Sen beni silmedin.\nArtık özgürsün.");
    speak("Sen beni silmedin. Artık özgürsün.");

    setTimeout(() => {
        drawText("GİZLİ İYİ SON");
    }, 4000);
}