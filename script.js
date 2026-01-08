let anger = 0;
let correctChoice = "right";

const narratorText = document.getElementById("narrator");
const angerText = document.getElementById("anger");

// ---- SES FONKSİYONU ----
function speak(text) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";

    // sinire göre ses ayarı
    if (anger < 5) {
        utterance.rate = 1;
        utterance.pitch = 1;
    } else if (anger < 10) {
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
    } else {
        utterance.rate = 1.2;
        utterance.pitch = 0.7;
    }

    speechSynthesis.speak(utterance);
}

// ---- TEPKİLER ----
function goodResponse() {
    return random([
        "Tabii ki dediğimi yaptın. Ne kadar şaşırtıcı.",
        "Evet evet, aferin. Şimdi mutlu musun?",
        "Beni dinlediğin için teşekkür etmemi mi bekliyorsun?"
    ]);
}

function badResponse() {
    return random([
        "Cidden mi? Söylediğimin tersini yaptın.",
        "Beni özellikle sinirlendirmek için mi uğraşıyorsun?",
        "Hayır. HAYIR. Bu hiç doğru değil."
    ]);
}

function waitResponse() {
    return random([
        "Hiçbir şey yapmamak mı? Cesur bir tercih.",
        "Beni görmezden geliyorsun, farkındayım.",
        "Tamam… bekleyelim bakalım."
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

    // yeni talimat
    correctChoice = Math.random() > 0.5 ? "left" : "right";

    setTimeout(() => {
        let next = "Şimdi " + (correctChoice === "left" ? "SOLA" : "SAĞA") + " bas.";
        narratorText.textContent = next;
        speak(next);
    }, 1200);
}

// ilk ses
speak(narratorText.textContent);
