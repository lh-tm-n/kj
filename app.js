(function () {
    'use strict';

    function refreshIcons() {
        if (window.lucide) lucide.createIcons();
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    /* ==================== DATA ==================== */
    const cards = [
        {
            title: 'Linux Command',
            host: 'linux-command.kaderjenengan.xyz',
            url: 'https://linux-command.kaderjenengan.xyz',
            tag: 'Linux',
            desc: 'Saat dimana penampilan fisik bukan yang utama.',
            icon: 'terminal',
            accent: '129, 140, 248'
        },
        {
            title: 'Latihan Mengetik',
            host: 'ngetik.kaderjenengan.xyz',
            url: 'https://ngetik.kaderjenengan.xyz',
            tag: 'Typing',
            desc: 'Bagaimana kamu mesra dengan komputer kalau posisi jarimu salah?',
            icon: 'keyboard',
            accent: '52, 211, 153'
        },
        {
            title: 'Live JS',
            host: 'livejs.kaderjenengan.xyz',
            url: 'https://livejs.kaderjenengan.xyz',
            tag: 'JavaScript',
            desc: 'Playground JavaScript, tempat mencoba kode tanpa takut merusak apapun.',
            icon: 'code-xml',
            accent: '34, 211, 238'
        },
        {
            title: 'Ditunggu saja',
            host: 'wait.kaderjenengan.xyz',
            url: 'https://wait.kaderjenengan.xyz',
            tag: 'Progress',
            desc: 'Kreativitas membutuhkan lebih banyak caffein.',
            icon: 'hourglass',
            accent: '251, 191, 36'
        },
        {
            title: 'Tabungan',
            host: 'tabungan.kaderjenengan.xyz',
            url: 'https://tabungan.kaderjenengan.xyz',
            tag: 'Finance',
            desc: 'Catat masuk dan keluar, karena dompet tidak bisa bicara.',
            icon: 'piggy-bank',
            accent: '244, 114, 182'
        },
        {
            title: 'HTML & CSS',
            host: 'htmlcss.kaderjenengan.xyz',
            url: 'https://htmlcss.kaderjenengan.xyz',
            tag: 'Frontend',
            desc: 'Fondasi sebelum kamu sok tahu soal framework.',
            icon: 'braces',
            accent: '251, 146, 60'
        }
    ];

    /* ==================== QUOTES ==================== */
    const quotes = [
        { text: 'Aku berpikir, maka aku ada.', author: 'RenÃ© Descartes' },
        { text: 'Aku hanya tahu bahwa aku tidak tahu apa-apa.', author: 'Socrates' },
        { text: 'Hidup yang tidak diuji tidak layak untuk dijalani.', author: 'Socrates' },
        { text: 'Kebijaksanaan dimulai dari keheranan.', author: 'Socrates' },
        { text: 'Imajinasi lebih penting daripada pengetahuan.', author: 'Albert Einstein' },
        { text: 'Orang yang tidak pernah membuat kesalahan tidak pernah mencoba hal baru.', author: 'Albert Einstein' },
        { text: 'Jika aku dapat melihat lebih jauh, itu karena aku berdiri di atas bahu para raksasa.', author: 'Isaac Newton' },
        { text: 'Apa yang tidak dapat aku ciptakan, tidak dapat aku pahami.', author: 'Richard Feynman' },
        { text: 'Pengetahuan adalah kekuatan.', author: 'Francis Bacon' },
        { text: 'Kebenaran adalah anak waktu, bukan anak otoritas.', author: 'Francis Bacon' },
        { text: 'Nasib menuntun mereka yang mau, dan menyeret mereka yang tidak.', author: 'Seneca' },
        { text: 'Tidak ada yang permanen kecuali perubahan.', author: 'Herakleitos' },
        { text: 'Alam tidak melompat.', author: 'Gottfried Leibniz' },
        { text: 'Aku tidak gagal; aku hanya menemukan sepuluh ribu cara yang tidak berhasil.', author: 'Thomas Edison' },
        { text: 'Kesederhanaan adalah tanda tertinggi dari kecanggihan.', author: 'Leonardo da Vinci' },
        { text: 'Mengenal diri sendiri adalah awal dari segala kebijaksanaan.', author: 'Aristoteles' },
        { text: 'Perjalanan seribu mil dimulai dengan satu langkah.', author: 'Lao Tzu' },
        { text: 'Engkau punya kendali atas pikiranmu, bukan atas peristiwa di luar dirimu.', author: 'Marcus Aurelius' }
    ];

    /* ==================== DOM ==================== */
    const gate = document.getElementById('gate');
    const gateInner = document.getElementById('gateInner');
    const gateForm = document.getElementById('gateForm');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const gateError = document.getElementById('gateError');
    const gateSubmit = document.getElementById('gateSubmit');
    const togglePassword = document.getElementById('togglePassword');

    const vault = document.getElementById('vault');
    const cardEl = document.getElementById('projectCard');
    const shatterLayer = document.getElementById('shatterLayer');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const shuffleStatus = document.getElementById('shuffleStatus');
    const shuffleStatusText = document.getElementById('shuffleStatusText');

    const fxCanvas = document.getElementById('fxCanvas');
    const ctx = fxCanvas.getContext('2d');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==================== STATE ==================== */
    const USERNAME_RE = /^[^\s-]+-[^\s-]+$/;
    const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    let gatePassed = false;
    let currentIndex = -1;
    let isLocked = false;
    let isPointerDown = false;
    let startX = 0;
    let moved = false;
    let vaultVisible = false;
    let shatterCleanupTimer = null;

    /* ==================== GATE ==================== */
    function shake(el) {
        el.classList.remove('shake');
        void el.offsetWidth;
        el.classList.add('shake');
    }

    function showQuote() {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        gateError.textContent = '\u201C' + quote.text + '\u201D \u2014 ' + quote.author;
        gateError.classList.remove('hidden', 'quote-in');
        void gateError.offsetWidth;
        gateError.classList.add('quote-in');
        shake(gateInner);
    }

    togglePassword.addEventListener('click', function () {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        togglePassword.innerHTML = '<i data-lucide="' + (isHidden ? 'eye-off' : 'eye') + '" class="h-4 w-4"></i>';
        refreshIcons();
        passwordInput.focus();
    });

    gateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (gatePassed) return;

        const identity = usernameInput.value.trim();
        const secret = passwordInput.value.trim();

        if (!USERNAME_RE.test(identity) || !PASSWORD_RE.test(secret)) {
            showQuote();
            return;
        }

        gateError.classList.add('hidden');
        gatePassed = true;
        gateSubmit.disabled = true;
        gateSubmit.textContent = 'Membuka gerbang...';
        gateSubmit.classList.add('cursor-wait');

        setTimeout(revealVault, 850);
    });

    /* ==================== CARD RENDERING ==================== */
    function cardTemplate(card) {
        return `
            <div class="card-surface p-6 sm:p-8">
                <div class="card-aura"></div>
                <div class="card-tilt">
                    <div class="mb-6 flex items-center justify-between">
                        <div class="icon-box flex h-11 w-11 items-center justify-center rounded-2xl border">
                            <i data-lucide="${card.icon}" class="h-5 w-5"></i>
                        </div>
                        <span class="tag rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">${card.tag}</span>
                    </div>

                    <h2 class="text-2xl font-bold tracking-tight text-white sm:text-[28px]">${card.title}</h2>
                    <p class="mt-2.5 min-h-[2.5rem] text-sm leading-relaxed text-slate-400">${card.desc}</p>

                    <div class="card-line my-5 h-px opacity-70"></div>

                    <div class="flex items-center justify-between gap-3">
                        <span class="truncate font-mono text-[11px] text-slate-500">${card.host}</span>
                        <a href="${card.url}" target="_blank" rel="noopener noreferrer"
                            class="open-btn inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all"
                            onpointerdown="event.stopPropagation()">
                            Bezoek
                            <i data-lucide="arrow-up-right" class="h-3.5 w-3.5"></i>
                        </a>
                    </div>
                </div>
            </div>`;
    }

    function pickIndex(exclude) {
        if (cards.length <= 1) return 0;
        let next;
        do {
            next = Math.floor(Math.random() * cards.length);
        } while (next === exclude);
        return next;
    }

    function paintCard(index) {
        const card = cards[index];
        cardEl.style.setProperty('--accent-rgb', card.accent);
        cardEl.innerHTML = cardTemplate(card);
        shatterLayer.style.setProperty('--accent-rgb', card.accent);
        refreshIcons();
    }

    function renderCard(index) {
        paintCard(index);
        cardEl.style.visibility = 'visible';
        cardEl.style.transition = 'none';
        cardEl.style.transform = 'none';
        cardEl.style.opacity = '1';
    }

    function openCurrent() {
        const card = cards[currentIndex];
        if (card) window.open(card.url, '_blank', 'noopener');
    }

    function revealVault() {
        currentIndex = pickIndex(-1);
        renderCard(currentIndex);

        gate.classList.add('gate-exit');

        setTimeout(function () {
            gate.style.display = 'none';
            vault.classList.add('is-open');
            void vault.offsetWidth;
            vault.classList.add('is-visible');
            vaultVisible = true;
            startFx();
        }, 600);
    }

    /* ==================== 3D HOVER TILT ==================== */
    function updateTilt(e) {
        const tilt = cardEl.querySelector('.card-tilt');
        if (!tilt) return;
        const rect = cardEl.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        tilt.style.transform = 'rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 9).toFixed(2) + 'deg)';
    }

    function resetTilt() {
        const tilt = cardEl.querySelector('.card-tilt');
        if (tilt) tilt.style.transform = '';
    }

    /* ==================== SLIDE SHUFFLE (drag / arrow keys) ==================== */
    function slideShuffle(direction) {
        if (isLocked || !cards.length) return;
        isLocked = true;

        const outX = direction > 0 ? -70 : 70;
        const inX = -outX;

        cardEl.style.transition = 'transform 0.24s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease';
        cardEl.style.transform = 'translateX(' + outX + 'vw) rotate(' + (outX * -0.12) + 'deg)';
        cardEl.style.opacity = '0';

        setTimeout(function () {
            currentIndex = pickIndex(currentIndex);
            renderCard(currentIndex);

            cardEl.style.transition = 'none';
            cardEl.style.transform = 'translateX(' + inX + 'vw) rotate(' + (inX * 0.12) + 'deg)';
            cardEl.style.opacity = '0';
            void cardEl.offsetWidth;

            requestAnimationFrame(function () {
                cardEl.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
                cardEl.style.transform = 'translateX(0) rotate(0deg)';
                cardEl.style.opacity = '1';

                setTimeout(function () {
                    isLocked = false;
                }, 430);
            });
        }, 230);
    }

    /* ==================== CINEMATIC SHUFFLE (button) ==================== */
    function setStatus(text) {
        if (!shuffleStatus || !shuffleStatusText) return;
        shuffleStatusText.textContent = text;
        shuffleStatus.classList.add('active');
    }

    function clearStatus() {
        if (shuffleStatus) shuffleStatus.classList.remove('active');
    }

    function shatterCard(accent) {
        const surface = cardEl.querySelector('.card-surface');
        if (!shatterLayer || !surface) return;

        shatterLayer.innerHTML = '';
        shatterLayer.style.setProperty('--accent-rgb', accent);

        const rect = cardEl.getBoundingClientRect();
        const mobile = rect.width < 420;
        const cols = mobile ? 5 : 8;
        const rows = mobile ? 7 : 6;
        const tileW = 100 / cols;
        const tileH = 100 / rows;
        const frags = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = document.createElement('div');
                tile.className = 'shatter-tile';
                tile.style.clipPath = 'inset(' +
                    (r * tileH) + '% ' +
                    (100 - (c + 1) * tileW) + '% ' +
                    (100 - (r + 1) * tileH) + '% ' +
                    (c * tileW) + '%)';

                const clone = surface.cloneNode(true);
                clone.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
                tile.appendChild(clone);
                shatterLayer.appendChild(tile);

                const nx = (c + 0.5) / cols - 0.5;
                const ny = (r + 0.5) / rows - 0.5;
                const len = Math.max(0.001, Math.hypot(nx, ny));
                const power = rand(0.55, 1.3);

                frags.push({
                    tile: tile,
                    vx: (nx / len) * rect.width * power + rand(-70, 70),
                    vy: (ny / len) * rect.height * power + rand(-70, 70),
                    vz: rand(-160, 340),
                    rx: rand(-1, 1),
                    ry: rand(-1, 1),
                    rot: rand(-190, 190),
                    delay: rand(0, 90)
                });
            }
        }

        frags.forEach(function (f) {
            f.tile.animate([
                {
                    transform: 'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg) scale(1)',
                    opacity: 1,
                    filter: 'blur(0px)',
                    offset: 0
                },
                {
                    transform: 'translate3d(' + (-f.vx * 0.05) + 'px,' + (-f.vy * 0.05) + 'px, 0) scale(0.985)',
                    opacity: 1,
                    filter: 'blur(0px)',
                    offset: 0.18
                },
                {
                    transform: 'translate3d(' + f.vx + 'px,' + f.vy + 'px,' + f.vz + 'px) rotate3d(' +
                        f.rx + ',' + f.ry + ',1,' + f.rot + 'deg) scale(0.32)',
                    opacity: 0,
                    filter: 'blur(5px)',
                    offset: 1
                }
            ], {
                duration: 900,
                delay: f.delay,
                easing: 'cubic-bezier(0.45, 0, 0.75, 0.2)',
                fill: 'forwards'
            });
        });

        clearTimeout(shatterCleanupTimer);
        shatterCleanupTimer = setTimeout(function () {
            shatterLayer.innerHTML = '';
        }, 1000);
    }

    function assembleCard(accent, done) {
        const surface = cardEl.querySelector('.card-surface');
        if (!shatterLayer || !surface) {
            if (done) done();
            return;
        }

        clearTimeout(shatterCleanupTimer);
        shatterLayer.innerHTML = '';
        shatterLayer.style.setProperty('--accent-rgb', accent);

        const rect = cardEl.getBoundingClientRect();
        const mobile = rect.width < 420;
        const cols = mobile ? 5 : 8;
        const rows = mobile ? 7 : 6;
        const tileW = 100 / cols;
        const tileH = 100 / rows;
        const frags = [];

        cardEl.style.visibility = 'hidden';

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = document.createElement('div');
                tile.className = 'shatter-tile';
                tile.style.clipPath = 'inset(' +
                    (r * tileH) + '% ' +
                    (100 - (c + 1) * tileW) + '% ' +
                    (100 - (r + 1) * tileH) + '% ' +
                    (c * tileW) + '%)';

                const clone = surface.cloneNode(true);
                clone.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
                tile.appendChild(clone);
                shatterLayer.appendChild(tile);

                frags.push({
                    tile: tile,
                    x: rand(-1.2, 1.2) * rect.width,
                    y: rand(-1.2, 1.2) * rect.height,
                    z: rand(-480, 380),
                    rx: rand(-100, 100),
                    ry: rand(-100, 100),
                    rot: rand(-140, 140),
                    scale: rand(0.25, 0.65),
                    delay: rand(0, 150) + (cols - c) * 6 + r * 4
                });
            }
        }

        frags.forEach(function (f) {
            f.tile.animate([
                {
                    transform: 'translate3d(' + f.x + 'px,' + f.y + 'px,' + f.z + 'px) rotate3d(' +
                        f.rx + ',' + f.ry + ',1,' + f.rot + 'deg) scale(' + f.scale + ')',
                    opacity: 0,
                    filter: 'blur(7px)'
                },
                {
                    transform: 'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg) scale(1)',
                    opacity: 1,
                    filter: 'blur(0px)'
                }
            ], {
                duration: 820,
                delay: f.delay,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'forwards'
            });
        });

        setTimeout(function () {
            cardEl.style.visibility = 'visible';
            shatterLayer.innerHTML = '';
            if (done) done();
        }, 1010);
    }

    function cinematicShuffle() {
        if (isLocked || !cards.length) return;
        isLocked = true;
        shuffleBtn.disabled = true;
        shuffleBtn.classList.add('busy');

        const rect = cardEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const oldAccent = cards[currentIndex].accent;

        setStatus('MEMINDAI REALITAS');
        cardEl.classList.remove('flash', 'charging');
        cardEl.style.transition = 'none';
        cardEl.style.transform = 'none';
        cardEl.style.opacity = '1';
        resetTilt();
        void cardEl.offsetWidth;
        cardEl.classList.add('charging');

        screenDark = 1;
        flashX = cx;
        flashY = cy;
        flashRGB = oldAccent;
        burst(cx, cy, oldAccent, 30);
        if (navigator.vibrate) navigator.vibrate(10);

        setTimeout(function () {
            cardEl.classList.remove('charging');
            shatterCard(oldAccent);
            cardEl.style.visibility = 'hidden';
            burst(cx, cy, oldAccent, 120);
            shockwave(cx, cy, oldAccent);
            screenFlash = 0.6;
            if (navigator.vibrate) navigator.vibrate([8, 40, 14]);
        }, 190);

        setTimeout(function () {
            setStatus('MENYUSUN ULANG');
        }, 700);

        setTimeout(function () {
            currentIndex = pickIndex(currentIndex);
            paintCard(currentIndex);

            const accent = cards[currentIndex].accent;
            const newRect = cardEl.getBoundingClientRect();
            const ncx = newRect.left + newRect.width / 2;
            const ncy = newRect.top + newRect.height / 2;
            flashX = ncx;
            flashY = ncy;
            flashRGB = accent;
            screenFlash = 0.5;

            burst(ncx, ncy, accent, 70);
            shockwave(ncx, ncy, accent);
            if (navigator.vibrate) navigator.vibrate(14);

            assembleCard(accent, function () {
                cardEl.classList.add('flash');
                screenFlash = 0.95;
                burst(ncx, ncy, accent, 55);
                shockwave(ncx, ncy, accent);
                if (navigator.vibrate) navigator.vibrate([6, 30, 10]);

                setTimeout(function () {
                    cardEl.classList.remove('flash');
                    clearStatus();
                    shuffleBtn.disabled = false;
                    shuffleBtn.classList.remove('busy');
                    isLocked = false;
                }, 380);
            });
        }, 1200);
    }

    /* ==================== DRAG / SWIPE ==================== */
    function setDrag(dx) {
        const rotation = Math.max(-10, Math.min(10, dx * 0.05));
        cardEl.style.transition = 'none';
        cardEl.style.transform = 'translateX(' + dx + 'px) rotate(' + rotation + 'deg)';
        cardEl.style.opacity = String(Math.max(0.55, 1 - Math.abs(dx) / 500));
    }

    function springBack() {
        cardEl.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
        cardEl.style.transform = 'translateX(0) rotate(0deg)';
        cardEl.style.opacity = '1';
    }

    cardEl.addEventListener('pointerdown', function (e) {
        if (isLocked) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        isPointerDown = true;
        moved = false;
        startX = e.clientX;
        resetTilt();
        cardEl.classList.add('dragging');
        if (cardEl.setPointerCapture) cardEl.setPointerCapture(e.pointerId);
    });

    cardEl.addEventListener('pointermove', function (e) {
        if (!isPointerDown) {
            if (e.pointerType === 'mouse') updateTilt(e);
            return;
        }
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 6) moved = true;
        setDrag(dx);
    });

    cardEl.addEventListener('pointerleave', function () {
        if (!isPointerDown) resetTilt();
    });

    cardEl.addEventListener('pointerup', function (e) {
        if (!isPointerDown) return;
        isPointerDown = false;
        cardEl.classList.remove('dragging');

        const dx = e.clientX - startX;

        if (Math.abs(dx) >= 70) {
            slideShuffle(dx < 0 ? 1 : -1);
        } else if (!moved) {
            springBack();
            openCurrent();
        } else {
            springBack();
        }
    });

    cardEl.addEventListener('pointercancel', function () {
        if (!isPointerDown) return;
        isPointerDown = false;
        cardEl.classList.remove('dragging');
        springBack();
    });

    shuffleBtn.addEventListener('click', cinematicShuffle);

    window.addEventListener('keydown', function (e) {
        if (!vaultVisible) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            slideShuffle(1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            slideShuffle(-1);
        }
    });

    /* ==================== PARTICLE / FX ENGINE ==================== */
    let W = 0;
    let H = 0;
    let DPR = 1;
    let particles = [];
    let rings = [];
    let ambient = [];
    let screenFlash = 0;
    let screenDark = 0;
    let flashX = 0;
    let flashY = 0;
    let flashRGB = '165, 180, 252';
    let fxStarted = false;
    let lastFrame = 0;

    function resizeCanvas() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        fxCanvas.width = Math.floor(W * DPR);
        fxCanvas.height = Math.floor(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        if (ambient.length) initAmbient();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function initAmbient() {
        ambient = [];
        if (reducedMotion) return;
        const count = Math.min(48, Math.floor(W / 26));
        for (let i = 0; i < count; i++) {
            ambient.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: rand(0.5, 1.9),
                vx: rand(-6, 6),
                vy: rand(-16, -3),
                a: rand(0.05, 0.22),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function burst(x, y, rgb, count) {
        const total = count || 90;
        for (let i = 0; i < total; i++) {
            const angle = rand(0, Math.PI * 2);
            const speed = Math.pow(Math.random(), 0.6) * 620 + 40;
            const life = rand(0.45, 1.15);
            const white = Math.random() < 0.25;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - rand(0, 70),
                gravity: rand(20, 90),
                drag: rand(1.6, 2.6),
                life: life,
                maxLife: life,
                size: rand(0.8, 3.1),
                color: white ? '255, 255, 255' : rgb,
                streak: Math.random() < 0.4
            });
        }
        if (particles.length > 460) {
            particles.splice(0, particles.length - 460);
        }
    }

    function shockwave(x, y, rgb) {
        rings.push({
            x: x, y: y, r: 6,
            speed: rand(320, 480),
            life: 0.9, maxLife: 0.9,
            color: rgb, width: 2.2
        });
        rings.push({
            x: x, y: y, r: 2,
            speed: rand(200, 300),
            life: 0.7, maxLife: 0.7,
            color: '255, 255, 255', width: 1.5
        });
        if (rings.length > 24) {
            rings.splice(0, rings.length - 24);
        }
    }

    function updateFx(dt) {
        for (let i = ambient.length - 1; i >= 0; i--) {
            const p = ambient[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.phase += dt * 1.4;
            if (p.y < -12) {
                p.y = H + 12;
                p.x = Math.random() * W;
            }
            if (p.x < -12) p.x = W + 12;
            if (p.x > W + 12) p.x = -12;
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= dt;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            const damp = Math.max(0, 1 - p.drag * dt);
            p.vx *= damp;
            p.vy = p.vy * damp + p.gravity * dt;
        }

        for (let i = rings.length - 1; i >= 0; i--) {
            const r = rings[i];
            r.life -= dt;
            if (r.life <= 0) {
                rings.splice(i, 1);
                continue;
            }
            r.r += r.speed * dt;
        }

        screenFlash = Math.max(0, screenFlash - dt * 2.6);
        screenDark = Math.max(0, screenDark - dt * 1.7);
    }

    function drawFx() {
        ctx.clearRect(0, 0, W, H);

        if (screenDark > 0.001) {
            ctx.fillStyle = 'rgba(3, 3, 4, ' + Math.min(0.5, screenDark * 0.5).toFixed(3) + ')';
            ctx.fillRect(0, 0, W, H);
        }

        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < ambient.length; i++) {
            const p = ambient[i];
            const alpha = p.a * (0.55 + 0.45 * Math.sin(p.phase));
            ctx.fillStyle = 'rgba(165, 180, 252, ' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 0; i < rings.length; i++) {
            const r = rings[i];
            const a = Math.max(0, r.life / r.maxLife);
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(' + r.color + ', ' + (a * 0.5).toFixed(3) + ')';
            ctx.lineWidth = r.width * a + 0.4;
            ctx.stroke();
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const a = Math.max(0, p.life / p.maxLife);
            if (p.streak) {
                ctx.strokeStyle = 'rgba(' + p.color + ', ' + (a * 0.8).toFixed(3) + ')';
                ctx.lineWidth = p.size;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
                ctx.stroke();
            } else {
                ctx.fillStyle = 'rgba(' + p.color + ', ' + (a * 0.85).toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (screenFlash > 0.001) {
            const radius = Math.max(W, H) * 0.65;
            const g = ctx.createRadialGradient(flashX, flashY, 0, flashX, flashY, radius);
            g.addColorStop(0, 'rgba(' + flashRGB + ', ' + (screenFlash * 0.32).toFixed(3) + ')');
            g.addColorStop(0.5, 'rgba(' + flashRGB + ', ' + (screenFlash * 0.07).toFixed(3) + ')');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    function fxLoop(now) {
        if (!lastFrame) lastFrame = now;
        const dt = Math.min((now - lastFrame) / 1000, 0.033);
        lastFrame = now;
        updateFx(dt);
        drawFx();
        requestAnimationFrame(fxLoop);
    }

    function startFx() {
        if (fxStarted) return;
        fxStarted = true;
        initAmbient();
        lastFrame = 0;
        requestAnimationFrame(fxLoop);
    }

    /* ==================== BOOT ==================== */
    refreshIcons();
    document.getElementById('year').textContent = new Date().getFullYear();
})();
