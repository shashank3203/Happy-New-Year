const $ = id=>document.getElementById(id);
const five=$("five"), sixWrapper=$("six-wrapper"), six=$("six");
const countdown=$("countdown"), waitingText=$("waiting-text");
const happyText=$("happy-text"), wishes=$("wishes");
const music=$("music"), balloonsBox=document.querySelector(".balloons");

const newYearDate=new Date("January 1, 2026 00:00:00").getTime();
let started=false;

/* COUNTDOWN */
setInterval(()=>{
    const now=Date.now();
    const diff=newYearDate-now;
    if(diff<=0 && !started){started=true; startCelebration(); return;}
    $("days").textContent=String(Math.floor(diff/86400000)).padStart(2,"0");
    $("hours").textContent=String(Math.floor(diff/3600000)%24).padStart(2,"0");
    $("minutes").textContent=String(Math.floor(diff/60000)%60).padStart(2,"0");
    $("seconds").textContent=String(Math.floor(diff/1000)%60).padStart(2,"0");
},1000);

/* CELEBRATION */
function startCelebration(){
    countdown.style.display="none";
    waitingText.style.display="none";

    document.body.style.background = "#000";

    sixWrapper.classList.add("show-six");

    setTimeout(()=>{
        const balloonClone=document.querySelector(".six-balloon").cloneNode(true);
        balloonClone.style.position="absolute"; balloonClone.style.top="-120px"; balloonClone.style.left="50%";
        balloonClone.style.transform="translateX(-50%)";
        five.appendChild(balloonClone);

        five.classList.add("push-five");

        setTimeout(()=>{
            five.style.display="none";
            balloonClone.remove();
            sixWrapper.style.transform="translateY(0)";
            six.style.opacity=1;
        },1200);
    },2000);

    setTimeout(()=>{
        happyText.classList.add("show-happy");
        wishes.style.display = "flex";
        typeWishes(); // Typing animation for wishes
        music.play();
        createBalloons();
        startFireworks();
    },3500);
}

/* BALLOONS */
function createBalloons(){
    const colors=["#ff4d4d","#4dd2ff","#ffd24d","#a64dff","#4dff88"];
    for(let i=0;i<25;i++){
        const b=document.createElement("span");
        b.style.left=Math.random()*100+"%";
        b.style.background=colors[Math.floor(Math.random()*colors.length)];
        b.style.animationDuration=10+Math.random()*10+"s";
        balloonsBox.appendChild(b);
    }
}

/* ENHANCED FIREWORKS */
const fireworks = $("fireworks");
const fctx = fireworks.getContext("2d");
fireworks.width = innerWidth;
fireworks.height = innerHeight;

let fireworksArray = [];

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const particleCount = 80 + Math.floor(Math.random() * 50);
        const hue = Math.random() * 360;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx,
                vy,
                alpha: 1,
                size: 2 + Math.random() * 3,
                color: `hsl(${hue + Math.random() * 60}, 100%, 50%)`,
                trail: []
            });
        }
    }

    update() {
        this.particles.forEach((p, i) => {
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 6) p.trail.shift();

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.06;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.alpha -= 0.015;
            if (p.alpha <= 0) this.particles.splice(i, 1);
        });
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            for (let t of p.trail) ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.alpha * 0.6;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    isDead() {
        return this.particles.length === 0;
    }
}

function startFireworks() {
    fireworks.style.display = "block";

    setInterval(() => {
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            const x = Math.random() * fireworks.width * 0.9 + fireworks.width * 0.05;
            const y = Math.random() * fireworks.height / 2;
            fireworksArray.push(new Firework(x, y));
        }
    }, 600);

    animateFireworks();
}

function animateFireworks() {
    fctx.fillStyle = "rgba(0,0,0,0.2)";
    fctx.fillRect(0, 0, fireworks.width, fireworks.height);

    fireworksArray.forEach((f, i) => {
        f.update();
        f.draw(fctx);
        if (f.isDead()) fireworksArray.splice(i, 1);
    });

    requestAnimationFrame(animateFireworks);
}

/* TYPING WISHES & SHOW BUTTON */
function typeWishes() {
    const wishSpans = Array.from(wishes.querySelectorAll("span"));
    const nextBtn = document.getElementById("nextBtn");
    let currentIndex = 0;

    function typeLetter(span, text, index = 0, callback) {
        if (index < text.length) {
            span.textContent += text[index];
            span.style.opacity = 1;
            setTimeout(() => typeLetter(span, text, index + 1, callback), 50);
        } else if (callback) {
            setTimeout(callback, 500);
        }
    }

    function showNextWish() {
        if (currentIndex < wishSpans.length) {
            const span = wishSpans[currentIndex];
            span.textContent = "";
            typeLetter(span, span.getAttribute("data-text") || span.textContent, 0, showNextWish);
            currentIndex++;
        } else {
            // After all wishes, show button
            nextBtn.style.display = "block";
            typeButtonText(nextBtn, "🎁 This is not the end… click to see something even more special! 🚀");
        }
    }

    wishSpans.forEach(span => {
        span.setAttribute("data-text", span.textContent);
        span.textContent = "";
    });

    showNextWish();
}

function typeButtonText(button, text, index = 0) {
    if (index < text.length) {
        button.textContent += text[index];
        setTimeout(() => typeButtonText(button, text, index + 1), 40);
    }
}

// Redirect button to Flask route
const nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", () => {
    window.location.href = "/thank";  // Flask route
});

