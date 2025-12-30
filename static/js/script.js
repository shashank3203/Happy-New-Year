document.addEventListener("DOMContentLoaded", () => {

    const music = new Audio("/static/music/perfect.mp3");
    music.loop = true;

    const introScreen = document.getElementById("intro-screen");
    const introCard = document.getElementById("intro-card");
    const mainScreen = document.getElementById("main-screen");
    const finalScreen = document.getElementById("end-screen");

    const enterBtn = document.getElementById("enter-btn");
    const finalBtn = document.getElementById("final-btn");
    const newYearBtn = document.getElementById("newyear-btn");

    /* INITIAL STATE */
    introScreen.style.display = "flex";
    mainScreen.style.display = "none";
    finalScreen.style.display = "none";

    enterBtn.addEventListener("click", () => {
        music.play();
        introCard.classList.add("exit");

        setTimeout(() => {
            introScreen.style.display = "none";
            mainScreen.style.display = "flex";
            initCards();
            initStars();
        }, 700);
    });

    finalBtn.addEventListener("click", () => {
        mainScreen.style.display = "none";
        finalScreen.style.display = "flex";
    });

    newYearBtn.addEventListener("click", () => {
        window.location.href = "/newyear";
    });


    /* CARD IMAGE HOVER */
    function initCards() {
        document.querySelectorAll(".memory-card").forEach(card => {
            card.querySelector(".card-inner").style.backgroundImage =
                `url(${card.dataset.img})`;
            card.addEventListener("mouseenter", () => {
                card.classList.add("hovered");
            });
        });
    }

    /* 🌌 NIGHT SKY + TWINKLING STARS + SHOOTING STARS */
    function initStars() {
        const canvas = document.getElementById("stars");
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const shootingStars = [];

        for (let i = 0; i < 400; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.3,
                a: Math.random(),
                da: Math.random() * 0.02
            });
        }

        /* Create shooting stars occasionally */
        setInterval(() => {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.4,
                vx: 10 + Math.random() * 6,
                vy: 6 + Math.random() * 4,
                life: 0
            });
        }, 5000 + Math.random() * 4000);

        function draw() {
            /* Background */
            const bg = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width
            );
            bg.addColorStop(0, "#0b1026");
            bg.addColorStop(0.5, "#050816");
            bg.addColorStop(1, "#000000");

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            /* Stars */
            stars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.a})`;
                ctx.fill();
                s.a += s.da;
                if (s.a <= 0 || s.a >= 1) s.da *= -1;
            });

            /* Shooting stars */
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const sh = shootingStars[i];
                ctx.beginPath();
                ctx.moveTo(sh.x, sh.y);
                ctx.lineTo(sh.x - sh.vx * 2, sh.y - sh.vy * 2);
                ctx.strokeStyle = `rgba(255,255,255,${1 - sh.life / 30})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                sh.x += sh.vx;
                sh.y += sh.vy;
                sh.life++;

                if (sh.life > 30) shootingStars.splice(i, 1);
            }

            requestAnimationFrame(draw);
        }

        draw();
    }

});
