let anger = 0;
let correctChoice = "right";
let audioEnabled = false;
let idleCount = 0;
let moveCount = 0;
let mixedPlay = true;
let gameOver = false;

const narrator = document.getElementById("narrator");
const angerText = document.getElementById("anger");

// SESİ BAŞLAT
function enableAudio() {
    const u = new SpeechSynthesisUtterance("Ses aktif.");
    u.lang = "tr-TR";
    u.rate = 0.9;
    u.pitch = 0.8;
    speechSynthesis.speak(u);
    audioEnabled = true;
    document.getElementById("startAudio").style.display = "none";
}

// KONUŞ
function speak(text) {
    if (!audioEnabled || gameOver) return;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "tr-TR";
    u.rate = 0.9;
    u.pitch = 0.8;
    speechSynthesis.speak(u);
}

// JUMPSCARE
function triggerJumpscare() {
    const js = document.getElementById("jumpscare");
    const scream = document.getElementById("scream");

    js.style.display = "flex";
    scream.volume = 1;
    scream.play();

    setTimeout(() => {
        js.style.display = "none";
    }, 1200);
}

// OYUN SONU
function endGame(title, text, scare = false) {
    gameOver = true;

    if (scare) triggerJumpscare();

    narrator.innerText = title + "\n\n" + text;
    speak(text);
    angerText.innerText = "OYUN BİTTİ";

    document.querySelectorAll(".buttons button").forEach(b => b.disabled = true);
}

// SON KONTROL
function checkEnding() {

    // GİZLİ SON
    if (moveCount >= 10 && mixedPlay && !gameOver) {
        endGame(
            "GİZLİ SON",
            "Dur.\n\nSen rastgele oynamıyorsun.\nBeni çözmeye çalışıyorsun.\n\nBu bir oyun değil.",
            true
        );
        return;
    }

    if (anger >= 15) {
        endGame("ANLATICI ÇILDIRDI", "Yeter! Oyun bitti.");
    } else if (idleCount >= 5) {
        endGame("SESSİZ SON", "...\n(Sessizlik)");
    } else if (anger <= 4 && moveCount >= 10) {
        endGame("SAYGI SONU", "Sanırım beni anlayabiliyorsun.");
    }
}

// OYUN
function choose(choice) {
    if (gameOver) return;

    moveCount++;

    let response = "";

    if (choice === "none") {
        idleCount++;
        anger += 2;
        mixedPlay = false;
        response = "Hiçbir şey yapmamayı seçtin.";
    } else if (choice === correctChoice) {
        anger += 1;
        response = "Evet. Söylediğimi yaptın.";
    } else {
        anger += 3;
        response = "Hayır. Açıkça yanlış yaptın.";
    }

    if (anger === 0 || anger > 10) mixedPlay = false;

    narrator.innerText = response;
    angerText.innerText = "Anlatıcı Siniri: " + anger;
    speak(response);

    checkEnding();
    if (gameOver) return;

    correctChoice = Math.random() > 0.5 ? "left" : "right";

    setTimeout(() => {
        const next = "Şimdi " + (correctChoice === "left" ? "SOLA" : "SAĞA") + " bas.";
        narrator.innerText = next;
        speak(next);
    }, 1600);
}