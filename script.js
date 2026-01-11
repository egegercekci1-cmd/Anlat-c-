// ================== YÜKLENDİ TESTİ ==================
console.log("game.js yüklendi");
alert("game.js yüklendi");

// ================== KAYIT SİSTEMİ ==================
const SAVE_KEY = "hatirlayanDunyaSave";

function saveGame(sceneName) {
  const data = {
    player,
    npc,
    scene: sceneName
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadGame() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    localStorage.removeItem(SAVE_KEY);
    return null;
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  showScene("start");
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
    text: "Murat rahatlıyor. 'Bunu unutmayacağım.'",
    choices: [
      { text: "Devam et", next: "ilerle" }
    ]
  },

  kacis: {
    text: "Kalbin hızlı atıyor. Murat arkanda kaldı.",
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
    text: () => {
      return npc.trust >= 50
        ? "Murat sana yakın duruyor."
        : "Murat mesafeli. Gözlerini kaçırıyor.";
    },
    choices: [
      { text: "Yüzleş", next: "final" }
    ]
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

// ================== SON HESAPLAMA ==================
function generateEnding() {
  const t = player.traits;
  let ending = "";

  if (t.empati >= 2 && npc.trust >= 60) {
    ending = "🟢 AFFEDİLEN SON\nEmpati seni kurtardı.";
  } else if (t.bencil >= 1 && t.empati === 0) {
    ending = "🔴 YALNIZLIK SONU\nHerkesi sen ittin.";
  } else if (t.yalanci >= 1 && npc.trust < 40) {
    ending = "⚫ YÜZLEŞME SONU\nYalanlar unutulmaz.";
  } else if (t.korkak >= 1) {
    ending = "🟡 KAÇIŞ SONU\nOradaydın ama değildin.";
  } else {
    ending = "🔵 BELİRSİZ SON\nBu en tehlikelisi.";
  }

  return `
${ending}

----------------
OYUN SENİ YARGILADI

Empati: ${t.empati}
Korkaklık: ${t.korkak}
Bencillik: ${t.bencil}
Yalancılık: ${t.yalanci}

Murat'ın hafızası:
${npc.memory.join(", ") || "Hiçbir şey"}
`;
}

// ================== MOTOR ==================
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");

function showScene(name) {
  const scene = scenes[name];
  if (!scene) {
    console.error("Sahne bulunamadı:", name);
    return;
  }

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

// ================== OYUNU ZORLA BAŞLAT ==================
localStorage.removeItem(SAVE_KEY); // BOZUK KAYITLAR İÇİN
showScene("start");