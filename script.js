let anger = 0;
let correctChoice = "right";

const narratorText = document.getElementById("narrator");
const angerText = document.getElementById("anger");

let voicesLoaded = false;

// sesleri yükle
speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
};

// ---- SES FONKSİYONU ----
function speak(text) {
    if (!voicesLoaded) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";

    const voices = speechSynthesis.getVoices();

    // erkek ses seç
    const maleVoice = voices.find(v =>
        v.lang === "tr-TR" &&
        (v.name.toLowerCase().includes("google") ||
         v.name.toLowerCase().includes("erkek") ||
         v.name.toLowerCase().includes("male"))
    );

    if (maleVoice) utterance.voice = maleVoice;

    utterance.rate = 0.9;   // yavaş
    utterance.pitch = 0.8;  // erkek tonu

    speechSynthesis.speak(utterance);
}

// ---- TEPKİLER ----
function goodResponse() {
    return random([
        "Evet. Söylediğimi yaptın. Beklendiği gibi.",
        "Aferin. En azından bir kere doğru yaptın.",
        "Bak, böyle olunca her şey daha kolay."
    ]);
}

function badResponse() {
    return random([
        "Hayır. Açıkça söylediğimin tersini yaptın.",
        "Gerçekten mi? Bu kadar basitti.",
        "Beni bilerek mi sinirlendiriyorsun?"
    ]);
}

function waitResponse() {
    return random([
        "Hiçbir şey yapmamayı seçtin. İlginç.",
        "Sessizlik mi? Peki, bekleyelim.",
        "Sanırım beni test ediyorsun."
    ]);
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---- OYUN AKIŞI ----
function choose(choice) {
    let response = "";

    if (choice === correctChoice) {
        response = goodResponse();
        anger += 1;
    } else if (choice === "none") {
        response = waitResponse();
        anger += 2;
    } else {
        response = badResponse();
        anger += 3;
    }

    narratorText.textContent = response;
    angerText.textContent = "Anlatıcı Siniri: " + anger;
    speak(response);

    correctChoice = Math.random() > 0.5 ? "left" : "right";

    setTimeout(() => {
        const next = "Şimdi " + (correctChoice === "left" ? "SOLA" : "SAĞA") + " bas.";
        narratorText.textContent = next;
        speak(next);
    }, 1800);
}