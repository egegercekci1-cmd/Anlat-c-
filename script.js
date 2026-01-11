console.log("game.js çalışıyor");

// HTML ELEMANLARI
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");

if (!textEl || !choicesEl) {
  alert("HTML eksik: text veya choices yok");
}

// OYUNCU
const player = {
  empati: 0,
  korkak: 0,
  bencil: 0,
  yalanci: 0
};

// NPC
const npc = {
  trust: 50,
  memory: []
};

// SAHNELER
const scenes = {
  start: {
    text: "Yağmur altında Murat senden yardım istiyor.",
    choices: [
      {
        text: "Yardım et",
        action: () => {
          player.empati++;
          npc.trust += 10;
          npc.memory.push("yardım ettin");
          showScene("son");
        }
      },
      {
        text: "Kaç",
        action: () => {
          player.korkak++;
          npc.trust -= 10;
          npc.memory.push("kaçtın");
          showScene("son");
        }
      }
    ]
  },

  son: {
    text: () => `
Oyun seni izledi.

Empati: ${player.empati}
Korkaklık: ${player.korkak}

Murat hatırlıyor:
${npc.memory.join(", ")}
`,
    choices: []
  }
};

// MOTOR
function showScene(name) {
  const scene = scenes[name];
  textEl.innerHTML =
    typeof scene.text === "function" ? scene.text() : scene.text;

  choicesEl.innerHTML = "";

  scene.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.text;
    btn.onclick = c.action;
    choicesEl.appendChild(btn);
  });
}

// BAŞLAT
showScene("start");