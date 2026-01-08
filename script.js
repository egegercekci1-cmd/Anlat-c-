let anger = 0;
let correctChoice = "right";
let audioEnabled = false;
let idleCount = 0;
let moveCount = 0;
let mixedPlay = true;
let gameOver = false;

const narrator = document.getElementById("narrator");
const angerText = document.getElementById("anger");

// DİYALOG HAVUZLARI
const dialog = {
    correct: [
        "Evet. Nihayet dinliyorsun.",
        "Bak… böyle yapman gerekiyordu.",
        "Şaşırtıcı şekilde doğru.",
        "Düşünerek bastın. Hissediyorum."
    ],
    wrong: [
        "Hayır. Bu söylediğim değildi.",
        "Cidden mi? Bu kadar mı zor?",
        "Yanlış. Açıkça yanlış.",
        "Beni test etmeye mi çalışıyorsun?"
    ],
    idle: [
        "Hiçbir şey… ilginç bir seçim.",
        "Sessizlik mi? Ciddi olamazsın.",
        "Beni görmezden geliyorsun.",
        "Bu da bir cevap sayılır… sanırım."
    ],
    next: [
        "Şimdi dikkat et.",
        "Tekrar deniyoruz.",
        "Bu sefer kaçırma.",
        "Hazır mısın?"
    ]
};

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// SESİ BAŞLAT
function enableAudio() {
    const u = new SpeechSynthesisUtterance("Ses aktif.");
    u.lang = "tr-TR";
    u.rate = 0.85;
    u.pitch = 0.8;
    speechSynthesis.speak(u);
    audioEnabled = true;
    document.getElementById("startAudio").style.display = "none";
}

// KONUŞ
function speak(text) {
    if (!audioEnabled || gameOver) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "tr-TR";
    u.rate = 0.85;
    u.pitch = 0.8;
    speechSynthesis.speak(u);
}

// JUMPSCARE
function triggerJumpscare() {
    document.getElementById("jumpscare").style.display = "flex";
    const scream = document.getElementById("scream");
    scream.volume = 1;
    scream.play();
}

// OYUN SONU
function endGame(title, text, scare = false) {
    gameOver = true;
    if (scare) triggerJumpscare();
    narrator.innerText = title + "\n\n" + text;
    speak(text);
    angerText.innerText = "OYUN BİTTİ";
}

// SON KONTROL
function checkEnding() {
    if (moveCount >= 10 && mixedPlay) {
        endGame(
            "GİZLİ SON",
            "Dur.\n\nBeni çözmeye çalışıyorsun.\nBu bir oyun değil.",
            true
        );
        return;
    }

    if (anger >= 15) {
        endGame("ANLATICI ÇILDIRDI", "Yeter! Artık bitti.");
    } else if (idleCount >= 5) {
        endGame("SESSİZ SON", "...\n(Sessizlik)");
    } else if (anger <= 3 && moveCount >= 10) {
        endGame("SAYGI SONU", "Beni dinlemeyi öğrendin.");
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
        response = rand(dialog.idle);
    } else if (choice === correctChoice) {
        anger = Math.max(0, anger - 1);
        response = rand(dialog.correct);
    } else {
        anger += 3;
        response = rand(dialog.wrong);
    }

    narrator.innerText = response;
    angerText.innerText = "Anlatıcı Siniri: " + anger;
    speak(response);

    checkEnding();
    if (gameOver) return;

    correctChoice = Math.random() > 0.5 ? "left" : "right";

    setTimeout(() => {
        const nextText = rand(dialog.next) +
            " Şimdi " + (correctChoice === "left" ? "SOLA" : "SAĞA") + " bas.";
        narrator.innerText = nextText;
        speak(nextText);
    }, 1700);
}