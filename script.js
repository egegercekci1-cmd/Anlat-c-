// ================== KAYIT / YÜKLEME ==================
function saveGame(sceneName) {
  const data = {
    player,
    npc,
    scene: sceneName
  };
  localStorage.setItem("hatirlayanDunyaSave", JSON.stringify(data));
}

function loadGame() {
  const data = localStorage.getItem("hatirlayanDunyaSave");
  return data ? JSON.parse(data) : null;
}

function resetGame() {
  localStorage.removeItem("hatirlayanDunyaSave");
  location.reload();
}

// ================== OYUNCU ==================
let player = {
  traits: {
    empati: 0,
    korkak: 0,
    bencil: 0,
    yalanci: 0
  }
};

// ================== NPC ==================
let npc = {
  name: "Murat",
  trust: 50,
  memory: []
};

// ================== SAHNELER ==================
const scenes = {
  start: {
    text: "Yağmur altında Murat sana sesleniyor. Yardım istiyor.",
    choices: [
      {
        text: "Yardım et",
        effect: () => {
          player.traits.empati++;
          npc.trust += 15;
          npc.memory.push("yardım ettin");
        },
        next: "yardim"
      },
      {
        text: "Yalan söyle ve kaç",
        effect: () => {
          player.traits.yalanci++;
          player.traits.korkak++;
          npc.trust -= 20;
          npc.memory.push("yalan söyledin");
        },
        next: "kacis"
      }
    ]
  },

  yardim: {
    text: "Murat derin bir nefes alıyor. 'Bunu unutmayacağım.'",
    choices: [{ text: "Devam et", next: "ilerle" }]
  },

  kacis: {
    text: "Kalbin hızlı atıyor. Arkana bakıyorsun.",
    choices: [
      {
        text: "Geri dön",
        effect: () => {
          player.traits.empati++;
          npc.trust += 5;
          npc.memory.push("geri döndün");
        },
        next: "ilerle"
      },
      {
        text: "Umursama",
        effect: () => {
          player.traits.bencil++;
        },
        next: "ilerle"
      }
    ]
  },

  ilerle: {
    text: () =>
      npc.trust >= 50
        ? "Murat sana yakın duruyor."
        : "Murat mesafeli. Gözlerini kaçırıyor.",
    choices: [{ text: "Yüzleşmeye devam et", next: "final" }]
  },

  final: {
    text: () => generateEnding(),
    choices: [
      {
        text: "🔁 Yeniden Oyna",
        effect: resetGame,
        next: "start"
      }
    ]
  }
};

// ================== SON MOTORU ==================
function generateEnding() {
  const t = player.traits;

  let ending = "";

  if (t.empati >= 2 && npc.trust >= 60) {
    ending = "🟢 AFFEDİLEN SON\nEmpati seni kurtardı.";
  } else if (t.bencil >= 1 && t.empati === 0) {
    ending = "🔴 YALNIZLIK SONU\nHerkesi sen ittin.";
  } else if (t.yalanci >= 1 && npc.trust < 40) {
    ending = "⚫ YÜZLEŞME SONU\nYalanlar hatırlanır.";
  } else if (t.korkak >= 1) {
    ending = "🟡 KAÇIŞ SONU\nHayatta kaldın ama eksik.";
  } else {
    ending = "🔵 BELİRSİZ SON\nEn tehlikelisi buydu.";
  }

  return `
${ending}

---  
OYUN SENİ YARGILADI

Empati: ${t.empati}
Korkaklık: ${t.korkak}
Bencillik: ${t.bencil}
Yalancılık: ${t.yalanci}

Murat’ın hafızası:
${npc.memory.join(", ") || "Hiçbir şey"}
`;
}

// ================== MOTOR ==================
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");

function showScene(name) {
  const scene = scenes[name];
  saveGame(name);

  textEl.innerHTML =
    typeof scene.text === "function" ? scene.text() : scene.text;

  choicesEl.innerHTML = "";

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => {
      if (choice.effect) choice.effect();
      showScene(choice.next);
    };
    choicesEl.appendChild(btn);
  });
}

// ================== OYUN BAŞLAT ==================
const saved = loadGame();
if (saved) {
  player = saved.player;
  npc = saved.npc;
  showScene(saved.scene);
} else {
  showScene("start");
}