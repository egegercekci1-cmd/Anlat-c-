const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const synth = speechSynthesis;
function speak(t){
    synth.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang="tr-TR";
    u.rate=0.9;
    u.pitch=0.6;
    synth.speak(u);
}

function draw(text){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font="28px Arial";
    text.split("\n").forEach((t,i)=>{
        ctx.fillText(t, canvas.width/2, canvas.height/2+i*34);
    });
}

/* ==== OYUN DURUM ==== */
let phase = "main";
let stage = 0;
let playerPos = 1; // 0 sol,1 orta,2 sağ
let dangerPos = -1;
let waitTimer = null;

/* ==== BAŞLAT ==== */
function startGame(){
    document.getElementById("startScreen").style.display="none";
    canvas.style.display="block";
    document.getElementById("choices").style.display="flex";
    speak("Başladın.");
    nextMain();
}

/* ==== ANA OYUN ==== */
let mainStep = 0;
function nextMain(){
    if(mainStep>=5){
        startMiniGame();
        return;
    }
    mainStep++;
    const dir = Math.random()>0.5?"SOL":"SAĞ";
    draw(dir);
    speak(dir+"a bas.");
}

function choose(){
    nextMain();
}

/* ==== MINI GAME ==== */
function startMiniGame(){
    document.getElementById("choices").style.display="none";
    speak("Bu bir oyun değil. Bu bir sınav.");
    setTimeout(()=>{
        stage=1;
        phase="stage1";
        stageOne();
    },4000);
}

/* ==== 1. AŞAMA ==== */
function stageOne(){
    speak("Harflerden kaç.");
    nextLetter();
}

function nextLetter(){
    if(stage!==1) return;
    dangerPos = Math.floor(Math.random()*3);
    drawStage("HARF", dangerPos);

    if(playerPos===dangerPos){
        death("Bir harf yetti.");
        return;
    }
    setTimeout(nextLetter,700);
}

/* ==== 2. AŞAMA ==== */
function stageTwo(){
    phase="stage2";
    speak("Zemine dikkat et.");
    nextHole();
}

function nextHole(){
    if(stage!==2) return;
    dangerPos = Math.floor(Math.random()*3);
    drawStage("DELİK", dangerPos);

    if(playerPos===dangerPos){
        death("Düştün.");
        return;
    }
    setTimeout(nextHole,800);
}

/* ==== 3. AŞAMA ==== */
function stageThree(){
    phase="stage3";
    speak("Sağa geç.");
    setTimeout(()=>{
        if(playerPos===2){
            death("Bana güvendin.");
        }else{
            stage=4;
            stageFour();
        }
    },2000);
}

/* ==== 4. AŞAMA ==== */
function stageFour(){
    phase="stage4";
    speak("Bekle.");
    waitTimer=setTimeout(()=>{
        stage=5;
        stageFive();
    },5000);
}

/* ==== 5. AŞAMA ==== */
function stageFive(){
    draw("BEKLE / SİL");
    speak("Son karar.");
    document.getElementById("decision").style.display="flex";
}

/* ==== ÇİZİM ==== */
function drawStage(label,danger){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w=canvas.width/3;
    for(let i=0;i<3;i++){
        ctx.strokeRect(i*w,canvas.height/2, w,100);
        if(i===danger){
            ctx.fillText(label, i*w+w/2, canvas.height/2+60);
        }
        if(i===playerPos){
            ctx.fillText("SEN", i*w+w/2, canvas.height/2+130);
        }
    }
}

/* ==== DOKUNMA ==== */
canvas.addEventListener("touchstart",()=>{
    if(phase==="stage4"){
        clearTimeout(waitTimer);
        death("Sabredemedin.");
        return;
    }
    playerPos = (playerPos+1)%3;
});

/* ==== ÖLÜM ==== */
function death(text){
    phase="dead";
    draw(text+"\nSON");
    speak(text);
}

/* ==== SONLAR ==== */
function deleteEntity(){
    draw("GİZLİ KÖTÜ SON");
    speak("İtaat ettin.");
}

function waitEntity(){
    draw("GİZLİ İYİ SON");
    speak("Özgürsün.");
}