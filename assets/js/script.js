document.addEventListener('DOMContentLoaded', () => {

    // ── Lenis Smooth Scroll (Failsafe) ──
    let lenis;
    if (typeof Lenis !== 'undefined') {
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            })

            function raf(time) {
                lenis?.raf(time)
                requestAnimationFrame(raf)
            }
            requestAnimationFrame(raf)
        } catch (e) { console.error('Lenis failed to initialize:', e); }
    }

    // ── Day/Night Architectural Cycle ──
    const initArchitecturalCycle = () => {
        const hour = new Date().getHours();
        const root = document.documentElement;
        if (hour >= 18 || hour < 6) {
            // Night Mode (Deep Violets / Golds)
            root.style.setProperty('--accent', '#D4AF37');
            root.style.setProperty('--accent2', '#5F0FFF');
            document.querySelector('.mesh-1')?.style.setProperty('background', 'radial-gradient(circle, rgba(95, 15, 255, 0.3) 0%, transparent 70%)');
        } else {
            // Day Mode (Crisp Blues / Silvers)
            root.style.setProperty('--accent', '#D4AF37');
            root.style.setProperty('--accent2', '#00D1FF');
            document.querySelector('.mesh-1')?.style.setProperty('background', 'radial-gradient(circle, rgba(0, 209, 255, 0.2) 0%, transparent 70%)');
        }
    };
    initArchitecturalCycle();

    // ── Visionary Preloader Logic (Prioritized) ──
    const preloader = document.getElementById('preloader');
    const prePercent = document.getElementById('pre-percent');
    let preCount = 0;

    const exitPreloader = () => {
        if (!preloader || preloader.classList.contains('hidden')) return;
        preloader.classList.add('loaded');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            preloader.classList.add('hidden');
            preloader.style.display = 'none'; // Absolute failsafe
            document.querySelector('.hero-section')?.classList.add('reveal', 'vision-active');
        }, 800);
    };

    // 5-second failsafe to always dismiss preloader
    setTimeout(exitPreloader, 5000);

    if (preloader && prePercent) {
        const preTick = setInterval(() => {
            preCount += Math.random() * 5 + 2;
            if (preCount >= 100) {
                preCount = 100;
                clearInterval(preTick);
                exitPreloader();
            }
            prePercent.textContent = Math.floor(preCount);
            document.documentElement.style.setProperty('--pre-width', `${preCount}%`);
        }, 30);
    }


    // ── Film Grain Toggle ──
    const noiseOverlay = document.querySelector('.noise-overlay');
    const grainToggles = document.querySelectorAll('#grain-toggle-drawer, #menu-grain-toggle');
    const grainStatus = document.querySelectorAll('.grain-status');

    let grainOn = localStorage.getItem('dninja-grain') !== 'false';
    const updateGrain = () => {
        noiseOverlay?.classList.toggle('off', !grainOn);
        grainStatus.forEach(el => el.textContent = grainOn ? 'ON' : 'OFF');
        localStorage.setItem('dninja-grain', grainOn);
    };
    updateGrain();

    grainToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            grainOn = !grainOn;
            updateGrain();
            playSound(440, 'sine', 0.1);
        });
    });

    // ── Showreel Portal ──
    const showreel = document.getElementById('hero-showreel');
    const playBtn = document.getElementById('play-showreel');
    const closeShowreel = document.getElementById('close-showreel');

    playBtn?.addEventListener('click', () => {
        showreel?.classList.add('portal-active');
        lenis?.stop(); // Pause scrolling
        playSound(880, 'sine', 0.2);
    });

    closeShowreel?.addEventListener('click', () => {
        showreel?.classList.remove('portal-active');
        lenis?.start(); // Resume scrolling
    });

    // ── Royal Greeting ──
    const updateRoyalGreeting = () => {
        const greetingEl = document.getElementById('royal-greeting');
        if (!greetingEl) return;
        const hour = new Date().getHours();
        let msg = "Welcome, Visionary";
        if (hour < 12) msg = "Good Morning, Visionary";
        else if (hour < 17) msg = "Good Afternoon, Creative";
        else if (hour < 21) msg = "Good Evening, Architect";
        else msg = "Good Night, Dreamer";
        greetingEl.querySelector('span').textContent = msg;
    };
    updateRoyalGreeting();



    // ── Theme Preference ──
    const savedTheme = localStorage.getItem('dninja-theme') || 'dark';
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    document.body.classList.toggle('dark-mode', savedTheme !== 'light');

    // ── Festive Theme Engine ──
    const initFestive = () => {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();
        const params = new URLSearchParams(window.location.search);
        const forcedTheme = params.get('theme');

        let theme = '';
        // Diwali Range (Approx Oct 15 - Nov 15) or Forced
        if (forcedTheme === 'diwali' || (month === 9 && day >= 15) || (month === 10 && day <= 15)) {
            theme = 'diwali';
        }
        // Christmas Range (Dec 15 - Dec 31) or Forced
        else if (forcedTheme === 'christmas' || (month === 11 && day >= 15)) {
            theme = 'christmas';
        }

        if (theme) {
            document.body.classList.add(`festive-${theme}`);
            startFestiveEffects(theme);
        }
    };

    const startFestiveEffects = (theme) => {
        const container = document.getElementById('festive-container');
        if (!container) return;

        if (theme === 'christmas') {
            for (let i = 0; i < 50; i++) {
                const snow = document.createElement('div');
                snow.className = 'snowflake fas fa-snowflake';
                snow.style.left = Math.random() * 100 + 'vw';
                snow.style.animationDuration = (Math.random() * 3 + 2) + 's';
                snow.style.animationDelay = (Math.random() * 5) + 's';
                snow.style.opacity = Math.random();
                snow.style.fontSize = (Math.random() * 10 + 10) + 'px';
                container.appendChild(snow);
            }
        } else if (theme === 'diwali') {
            for (let i = 0; i < 15; i++) {
                const diya = document.createElement('div');
                diya.className = 'diya';
                diya.style.left = Math.random() * 100 + 'vw';
                diya.style.top = Math.random() * 100 + 'vh';
                diya.style.animationDelay = (Math.random() * 2) + 's';
                container.appendChild(diya);
            }
        }
    };

    initFestive();

    // ── Automatic Contrast Engine ──
    const updateContrast = () => {
        const sections = document.querySelectorAll('section, footer, .hero-section');
        sections.forEach(sec => {
            const bg = window.getComputedStyle(sec).backgroundColor;
            const rgb = bg.match(/\d+/g);
            if (rgb) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                if (brightness > 128) {
                    sec.classList.add('light-bg-mode');
                    sec.classList.remove('dark-bg-mode');
                } else {
                    sec.classList.add('dark-bg-mode');
                    sec.classList.remove('light-bg-mode');
                }
            }
        });
    };

    window.addEventListener('load', updateContrast);
    window.addEventListener('resize', updateContrast);
    updateContrast();


    // ── Cursor 6.0: The Architectural Focus ──
    const cursorDot = document.getElementById('cursor-dot');
    const cursorLabel = document.getElementById('cursor-label');

    let mouse = { x: 0, y: 0 };
    let dotPos = { x: 0, y: 0 };

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Parallax effect on background blobs
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        document.querySelectorAll('.mesh-blob').forEach((blob, i) => {
            const factor = (i + 1) * 0.5;
            blob.style.transform = `translate3d(${moveX * factor}px, ${moveY * factor}px, 0)`;
        });
    });

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const updateCursor = () => {
        dotPos.x = lerp(dotPos.x, mouse.x, 0.4);
        dotPos.y = lerp(dotPos.y, mouse.y, 0.4);

        if (cursorDot) {
            cursorDot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
        }

        requestAnimationFrame(updateCursor);
    };
    updateCursor();

    // ── Hover Interaction System ──
    const hoverElements = 'a, button, .proj-card-new, .service-card-new, .pf-btn, .nav-link, .nav-logo, .nav-hire, .proj-item';

    const handleMouseEnter = (e) => {
        cursorDot?.classList.add('active');
    };

    const handleMouseLeave = () => {
        cursorDot?.classList.remove('active');
    };

    document.querySelectorAll(hoverElements).forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
    });

    // ── Visionary Scroll Reveals ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.add('vision-active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-stagger, section, .service-card-new, .proj-card-new').forEach(el => {
        revealObserver.observe(el);
    });

    // ── Live IST Clock ──
    const updateClock = () => {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const istTime = now.toLocaleTimeString('en-GB', options);
        const clockEl = document.getElementById('live-clock');
        if (clockEl) clockEl.textContent = `IST ${istTime}`;
    };
    setInterval(updateClock, 1000);
    updateClock();

    // ── UI Sounds (Oscillators) ──
    let audioCtx;
    let sfxEnabled = localStorage.getItem('dninja-sfx') !== 'false';
    const sfxToggle = document.getElementById('sfx-toggle');

    function playSound(freq, type, duration) {
        if (!sfxEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { /* Silently fail for audio context blocks */ }
    }

    const updateSfxIcon = () => {
        if (sfxToggle) {
            const icon = sfxToggle.querySelector('i');
            if (icon) icon.className = sfxEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            sfxToggle.style.opacity = sfxEnabled ? '1' : '0.5';
        }
    };
    updateSfxIcon();

    sfxToggle?.addEventListener('click', () => {
        sfxEnabled = !sfxEnabled;
        localStorage.setItem('dninja-sfx', sfxEnabled);
        updateSfxIcon();
        if (sfxEnabled) playSound(440, 'sine', 0.1);
    });

    document.querySelectorAll('a, button, .pf-btn, .proj-item').forEach(el => {
        el.addEventListener('mouseenter', () => playSound(880, 'sine', 0.05));
        el.addEventListener('click', () => playSound(440, 'square', 0.1));
    });

    // ── Ninja Easter Egg ──
    let ninjaKeys = '';
    window.addEventListener('keydown', (e) => {
        ninjaKeys += e.key.toLowerCase();
        if (ninjaKeys.endsWith('ninja')) {
            ninjaKeys = '';
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#7c3aed', '#ff2d55', '#ffffff']
            });
            showToast("🥷 NINJA MODE ACTIVATED!");
            document.body.classList.add('ninja-mode');
            setTimeout(() => document.body.classList.remove('ninja-mode'), 5000);
        }
        if (ninjaKeys.length > 10) ninjaKeys = ninjaKeys.slice(-10);
    });

    // ── Text Scramble Effect ──
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="d-scramble">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // ── Split Text Typography ──
    const initSplitText = () => {
        document.querySelectorAll('.split-reveal').forEach(el => {
            const text = el.innerText;
            el.innerHTML = text.split('').map(char =>
                `<span style="display:inline-block; transform:translateY(100%); opacity:0; transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        });
    };
    initSplitText();

    const scrambleObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const fx = new TextScramble(e.target);
                fx.setText(e.target.dataset.text || e.target.innerText);
                scrambleObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.scramble-text').forEach(el => {
        el.dataset.text = el.innerText;
        scrambleObs.observe(el);
    });

    // ── Navbar & Scroll Optimization ──
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const btt = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const topBar = document.getElementById('top-progress');
    const circleFill = document.querySelector('.btt-circle-fill');
    const percentText = document.getElementById('btt-percent');

    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Auto-Hide Navbar
        if (navbar && currentScroll > 150) {
            if (currentScroll > lastScroll && drawer && !drawer.classList.contains('open')) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
        } else if (navbar) {
            navbar.classList.remove('hidden');
        }
        lastScroll = currentScroll;

        if (navbar) navbar.classList.toggle('scrolled', currentScroll > 60);
        if (btt) btt.classList.toggle('visible', currentScroll > 600);

        // Update Progress
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (currentScroll / height) * 100;
        if (topBar) topBar.style.width = scrolled + "%";

        if (circleFill) {
            const circumference = 150.8;
            circleFill.style.strokeDashoffset = circumference - (scrolled / 100) * circumference;
        }
        if (percentText) percentText.textContent = Math.floor(scrolled) + "%";

        // Active Link Highlighting (Throttled)
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                let cur = '';
                sections.forEach(s => { if (currentScroll >= s.offsetTop - 140) cur = s.id; });
                navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === cur));
                scrollTimeout = null;
            }, 100);
        }
    }, { passive: true });
    if (toggle && drawer) {
        toggle.addEventListener('click', () => { toggle.classList.toggle('active'); drawer.classList.toggle('open'); });
    }
    document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', () => {
        if (toggle) toggle.classList.remove('active');
        if (drawer) drawer.classList.remove('open');
    }));
    if (btt) btt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Contact Form Submission (Backend Integrated) ──
    const contactForm = document.getElementById('dninja-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    showToast("Mission brief received! I'll contact you soon. 🥷");
                    contactForm.reset();
                } else {
                    throw new Error(result.error);
                }
            } catch (err) {
                console.warn("Backend unavailable, falling back to legacy toast.");
                showToast("Connection failed, but your brief is noted. 🥷");
            } finally {
                btn.innerHTML = originalBtnHTML;
                btn.disabled = false;
            }
        });
    }

    // ── Project Category Filter ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.proj-card-new');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.color = 'var(--dim)';
            });
            btn.classList.add('active');
            btn.style.color = 'var(--text)';

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 400);
                }
            });
        });
    });

    // ── Architectural Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Advanced Section Reveals ──
    const staggerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Handle Split Text Stagger
                if (entry.target.classList.contains('split-reveal')) {
                    entry.target.querySelectorAll('span').forEach((span, i) => {
                        setTimeout(() => {
                            span.style.transform = 'translateY(0)';
                            span.style.opacity = '1';
                        }, i * 30);
                    });
                }

                if (entry.target.classList.contains('skill-row')) {
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(b => b.style.width = b.dataset.w + '%');
                }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-up, .reveal-stagger, .skill-row, .split-reveal').forEach(el => staggerObserver.observe(el));

    // ── Floating stat counters ──
    const statObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.fs-num').forEach(n => {
                    const t = +n.dataset.target; let c = 0;
                    const timer = setInterval(() => {
                        c += t / 40; if (c >= t) { c = t; clearInterval(timer); }
                        n.textContent = Math.floor(c);
                    }, 40);
                });
                statObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.hero-float-stat').forEach(s => statObs.observe(s));

    // ── Project filter removed as we now use distinct category cards ──

    // ── Skill rows hover highlight ──
    document.querySelectorAll('.skill-row').forEach(row => {
        row.addEventListener('mouseenter', () => {
            document.querySelectorAll('.skill-row').forEach(r => r.style.opacity = '.4');
            row.style.opacity = '1';
        });
        row.addEventListener('mouseleave', () => {
            document.querySelectorAll('.skill-row').forEach(r => r.style.opacity = '1');
        });
    });



    // ── Hero name scramble on scroll circle hover ──
    const scrollBtn = document.getElementById('hero-scroll-btn');
    if (scrollBtn) scrollBtn.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });

    // ── Global 3D Card Tilt ──
    const initTilt = () => {
        const cards = document.querySelectorAll('.service-card, .team-card, .student-card, .proj-item, .bento-item');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const xc = r.width / 2;
                const yc = r.height / 2;
                const dx = (x - xc) / (r.width / 20); // Dynamic sensitivity
                const dy = (y - yc) / (r.height / 20);
                card.style.transform = `perspective(1000px) rotateY(${dx}deg) rotateX(${-dy}deg) scale(1.02)`;
                card.style.transition = 'transform 0.1s linear';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease';
            });
        });
    };
    initTilt();

    // ── FAQ Accordion ──
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
            // Close others
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
        });
    });



    // ── Parallax on hero headline ──
    document.addEventListener('mousemove', e => {
        const x = (e.clientX / innerWidth - 0.5) * 10;
        const y = (e.clientY / innerHeight - 0.5) * 10;
        document.querySelectorAll('.hero-line').forEach((l, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            l.style.transform = `translateX(${x * dir * 0.5}px)`;
        });
    });



    // ── Pricing Modal Logic ──
    const pricingModal = document.getElementById('pricing-modal');
    const btnPricingNav = document.getElementById('pricing-btn');
    const btnPricingDrawer = document.getElementById('drawer-pricing-btn');
    const btnPricingClose = document.getElementById('pricing-close');
    const modalCtaBtn = document.getElementById('modal-cta-btn');

    const openPricing = (e) => {
        if (e) e.preventDefault();
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            const offset = 100;
            const targetPos = pricingSection.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        }
        // Close drawer if open
        const drawer = document.getElementById('nav-drawer');
        const toggle = document.getElementById('nav-toggle');
        if (drawer) drawer.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
    };

    const closePricing = () => {
        if (pricingModal) {
            pricingModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (btnPricingNav) btnPricingNav.addEventListener('click', openPricing);
    if (btnPricingDrawer) btnPricingDrawer.addEventListener('click', openPricing);
    if (btnPricingClose) btnPricingClose.addEventListener('click', closePricing);

    window.addEventListener('click', (e) => {
        if (e.target === pricingModal) closePricing();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pricingModal && pricingModal.classList.contains('active')) closePricing();
    });
    if (modalCtaBtn) modalCtaBtn.addEventListener('click', closePricing);

    // ── Project Hub Enhancements ──
    const projectList = document.getElementById('proj-list');
    const projectSearch = document.getElementById('project-search');
    const projectSort = document.getElementById('project-sort');
    const favoritesOnlyBtn = document.getElementById('favorites-only-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const tagFilterWrap = document.getElementById('project-tag-filters');
    const resultCountEl = document.getElementById('project-result-count');
    const emptyState = document.getElementById('project-empty-state');
    const compareCountEl = document.getElementById('compare-count');
    const openCompareBtn = document.getElementById('open-compare-btn');
    const compareModal = document.getElementById('compare-modal');
    const compareGrid = document.getElementById('compare-grid');
    const compareCloseBtn = document.getElementById('compare-close');
    const quickView = document.getElementById('project-quick-view');
    const quickViewClose = document.getElementById('quick-view-close');
    const quickViewTitle = document.getElementById('quick-view-title');
    const quickViewDescription = document.getElementById('quick-view-description');
    const quickViewImage = document.getElementById('quick-view-image');
    const quickViewTags = document.getElementById('quick-view-tags');
    const quickViewOpen = document.getElementById('quick-view-open');
    const quickViewFavorite = document.getElementById('quick-view-favorite');
    const quickViewCompare = document.getElementById('quick-view-compare');
    const quickViewShare = document.getElementById('quick-view-share');
    const recentlyViewedWrap = document.getElementById('recently-viewed-wrap');
    const recentlyViewedList = document.getElementById('recently-viewed-list');
    const toast = document.getElementById('site-toast');

    const state = {
        search: '',
        tag: 'all',
        sort: 'default',
        favoritesOnly: false,
        favorites: JSON.parse(localStorage.getItem('dninja-favorites') || '[]'),
        compare: JSON.parse(localStorage.getItem('dninja-compare') || '[]').slice(0, 3),
        recent: JSON.parse(localStorage.getItem('dninja-recent') || '[]').slice(0, 6),
        quickIndex: -1
    };

    const safeCopy = async (text) => {
        try { await navigator.clipboard.writeText(text); return true; }
        catch (_) { return false; }
    };

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(window._dninjaToastTimer);
        window._dninjaToastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
    };

    const saveState = () => {
        localStorage.setItem('dninja-favorites', JSON.stringify(state.favorites));
        localStorage.setItem('dninja-compare', JSON.stringify(state.compare));
        localStorage.setItem('dninja-recent', JSON.stringify(state.recent));
    };

    const getProjectCards = () => projectList ? Array.from(projectList.querySelectorAll('.proj-item')) : [];
    const cardId = (card) => card.querySelector('.proj-title')?.textContent.trim().toLowerCase().replace(/\s+/g, '-');

    const updateActionStates = () => {
        getProjectCards().forEach(card => {
            const id = cardId(card);
            card.classList.toggle('is-favorite', state.favorites.includes(id));
            card.classList.toggle('is-compare', state.compare.includes(id));
            card.querySelector('.favorite-btn')?.classList.toggle('active', state.favorites.includes(id));
            card.querySelector('.compare-btn')?.classList.toggle('active', state.compare.includes(id));
        });
        if (compareCountEl) compareCountEl.textContent = String(state.compare.length);
    };

    const updateResultCount = (count) => {
        if (resultCountEl) resultCountEl.textContent = `${count} project${count === 1 ? '' : 's'} found`;
        if (emptyState) emptyState.hidden = count !== 0;
    };

    const matchesFilters = (card) => {
        const title = card.querySelector('.proj-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.proj-desc')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.proj-tags span')).map(t => t.textContent.toLowerCase());
        const id = cardId(card);
        const searchOK = !state.search || `${title} ${desc} ${tags.join(' ')}`.includes(state.search);
        const tagOK = state.tag === 'all' || tags.includes(state.tag);
        const favoriteOK = !state.favoritesOnly || state.favorites.includes(id);
        return searchOK && tagOK && favoriteOK;
    };

    const applyProjectFilters = () => {
        const cards = getProjectCards();
        cards.forEach(card => {
            card.classList.toggle('hidden', !matchesFilters(card));
        });
        const visibleCards = cards.filter(card => !card.classList.contains('hidden'));
        if (state.sort !== 'default' && projectList) {
            const sorted = [...cards].sort((a, b) => {
                const at = a.querySelector('.proj-title')?.textContent || '';
                const bt = b.querySelector('.proj-title')?.textContent || '';
                return state.sort === 'az' ? at.localeCompare(bt) : bt.localeCompare(at);
            });
            sorted.forEach(card => projectList.appendChild(card));
        }
        updateResultCount(visibleCards.length);
        updateActionStates();
    };

    const toggleFavorite = (card) => {
        const id = cardId(card);
        if (!id) return;
        if (state.favorites.includes(id)) {
            state.favorites = state.favorites.filter(v => v !== id);
            showToast('Removed from favorites');
        } else {
            state.favorites.push(id);
            showToast('Added to favorites');
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#7c3aed', '#ff2d55']
                });
            }
        }
        saveState();
        applyProjectFilters();
    };

    const toggleCompare = (card) => {
        const id = cardId(card);
        if (!id) return;
        if (state.compare.includes(id)) {
            state.compare = state.compare.filter(v => v !== id);
            showToast('Removed from compare');
        } else if (state.compare.length >= 3) {
            showToast('Compare supports up to 3 items');
            return;
        } else {
            state.compare.push(id);
            showToast('Added to compare');
        }
        saveState();
        updateActionStates();
    };

    const openQuickView = (card) => {
        const title = card.querySelector('.proj-title')?.textContent.trim() || '';
        const desc = card.querySelector('.proj-desc')?.textContent.trim() || '';
        const link = card.getAttribute('href') || '#';
        const image = card.querySelector('.proj-img')?.getAttribute('src') || '';
        const tags = Array.from(card.querySelectorAll('.proj-tags span')).map(t => t.textContent.trim());
        const id = cardId(card);
        if (!quickView || !id) return;
        state.quickIndex = getProjectCards().indexOf(card);
        quickViewTitle.textContent = title;
        quickViewDescription.textContent = desc;
        quickViewImage.src = image;
        quickViewImage.alt = title;
        quickViewOpen.href = link;
        quickViewTags.innerHTML = tags.map(t => `<span>${t}</span>`).join('');
        quickViewFavorite.textContent = state.favorites.includes(id) ? 'Unfavorite' : 'Favorite';
        quickViewCompare.textContent = state.compare.includes(id) ? 'Remove Compare' : 'Compare';
        quickView.setAttribute('aria-hidden', 'false');
        quickView.classList.add('active');
        state.recent = [id, ...state.recent.filter(v => v !== id)].slice(0, 6);
        saveState();
        renderRecentlyViewed();
    };

    const closeQuickView = () => {
        if (!quickView) return;
        quickView.classList.remove('active');
        quickView.setAttribute('aria-hidden', 'true');
    };

    const renderCompare = () => {
        if (!compareGrid) return;
        const cards = getProjectCards();
        const selected = cards.filter(card => state.compare.includes(cardId(card)));
        compareGrid.innerHTML = selected.length ? selected.map(card => `
            <article class="compare-card">
                <img src="${card.querySelector('.proj-img')?.getAttribute('src') || ''}" alt="${card.querySelector('.proj-title')?.textContent || ''}">
                <div class="meta">
                    <h4>${card.querySelector('.proj-title')?.textContent || ''}</h4>
                    <p>${card.querySelector('.proj-desc')?.textContent || ''}</p>
                </div>
            </article>
        `).join('') : '<p class="project-result-count">No items selected for compare.</p>';
    };

    const renderRecentlyViewed = () => {
        if (!recentlyViewedWrap || !recentlyViewedList) return;
        const cards = getProjectCards();
        const titleToCard = new Map(cards.map(card => [cardId(card), card]));
        const recentCards = state.recent.map(id => titleToCard.get(id)).filter(Boolean);
        recentlyViewedWrap.hidden = recentCards.length === 0;
        recentlyViewedList.innerHTML = recentCards.map(card => `<button class="recent-chip" type="button">${card.querySelector('.proj-title')?.textContent || ''}</button>`).join('');
        Array.from(recentlyViewedList.querySelectorAll('.recent-chip')).forEach((chip, i) => {
            chip.addEventListener('click', () => openQuickView(recentCards[i]));
        });
    };

    const buildTagFilters = () => {
        if (!tagFilterWrap) return;
        const tags = new Set();
        getProjectCards().forEach(card => {
            card.querySelectorAll('.proj-tags span').forEach(tag => tags.add(tag.textContent.trim()));
        });
        tagFilterWrap.innerHTML = `<button class="pf-btn active" data-tag="all" type="button">All</button>${Array.from(tags).map(tag => `<button class="pf-btn" data-tag="${tag.toLowerCase()}" type="button">${tag}</button>`).join('')}`;
        tagFilterWrap.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                state.tag = btn.dataset.tag || 'all';
                tagFilterWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyProjectFilters();
            });
        });
    };

    const enhanceProjectCards = () => {
        getProjectCards().forEach(card => {
            const actionWrap = document.createElement('div');
            actionWrap.className = 'project-actions';
            actionWrap.innerHTML = `
                <button class="favorite-btn" type="button" aria-label="Toggle favorite"><i class="fas fa-heart"></i></button>
                <button class="compare-btn" type="button" aria-label="Add to compare"><i class="fas fa-code-compare"></i></button>
                <button class="quick-btn" type="button" aria-label="Open quick view"><i class="fas fa-eye"></i></button>
            `;
            card.querySelector('.proj-img-wrap')?.appendChild(actionWrap);

            actionWrap.querySelector('.favorite-btn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(card); });
            actionWrap.querySelector('.compare-btn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(card); });
            actionWrap.querySelector('.quick-btn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openQuickView(card); });
            card.addEventListener('click', () => {
                const id = cardId(card);
                if (!id) return;
                state.recent = [id, ...state.recent.filter(v => v !== id)].slice(0, 6);
                saveState();
                renderRecentlyViewed();
            });
        });
    };

    if (projectList) {
        enhanceProjectCards();
        buildTagFilters();
        renderRecentlyViewed();
        applyProjectFilters();

        projectSearch?.addEventListener('input', () => {
            state.search = projectSearch.value.trim().toLowerCase();
            applyProjectFilters();
        });
        projectSort?.addEventListener('change', () => {
            state.sort = projectSort.value;
            applyProjectFilters();
        });
        favoritesOnlyBtn?.addEventListener('click', () => {
            state.favoritesOnly = !state.favoritesOnly;
            favoritesOnlyBtn.classList.toggle('active', state.favoritesOnly);
            favoritesOnlyBtn.setAttribute('aria-pressed', String(state.favoritesOnly));
            applyProjectFilters();
        });
        clearFiltersBtn?.addEventListener('click', () => {
            state.search = '';
            state.tag = 'all';
            state.sort = 'default';
            state.favoritesOnly = false;
            if (projectSearch) projectSearch.value = '';
            if (projectSort) projectSort.value = 'default';
            favoritesOnlyBtn?.classList.remove('active');
            tagFilterWrap?.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.tag === 'all'));
            applyProjectFilters();
            showToast('Filters cleared');
        });

        quickViewClose?.addEventListener('click', closeQuickView);
        quickView?.querySelector('[data-close-quick-view]')?.addEventListener('click', closeQuickView);
        quickViewFavorite?.addEventListener('click', () => {
            const card = getProjectCards()[state.quickIndex];
            if (card) { toggleFavorite(card); openQuickView(card); }
        });
        quickViewCompare?.addEventListener('click', () => {
            const card = getProjectCards()[state.quickIndex];
            if (card) { toggleCompare(card); openQuickView(card); }
        });
        quickViewShare?.addEventListener('click', async () => {
            const link = `${location.origin}${location.pathname}#projects`;
            const ok = await safeCopy(link);
            showToast(ok ? 'Project section link copied' : 'Copy failed');
        });

        openCompareBtn?.addEventListener('click', () => {
            renderCompare();
            compareModal?.classList.add('active');
            compareModal?.setAttribute('aria-hidden', 'false');
        });
        compareCloseBtn?.addEventListener('click', () => {
            compareModal?.classList.remove('active');
            compareModal?.setAttribute('aria-hidden', 'true');
        });
        compareModal?.querySelector('[data-close-compare]')?.addEventListener('click', () => {
            compareModal.classList.remove('active');
            compareModal.setAttribute('aria-hidden', 'true');
        });
    }

    // ── Motion Preference (Keep) ──
    const reduceMotion = localStorage.getItem('dninja-reduce-motion') === 'true' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.toggle('reduce-motion', reduceMotion);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
            closePricing();
            if (compareModal) {
                compareModal.classList.remove('active');
                compareModal.setAttribute('aria-hidden', 'true');
            }
        }
    });

    // ── Professional Social Sidebar (No JS needed for hover, but ready for logic) ──
    const socialItems = document.querySelectorAll('.sidebar-item');
    socialItems.forEach(item => {
        item.addEventListener('mouseenter', () => playSound(440, 'sine', 0.05));
    });



    // ── Feature 3: Live Pulse Notifications ──
    const pulseMessages = [
        "Logo delivered to a client in Kolkata!",
        "Someone just added a poster to their cart.",
        "New project: Brand identity for TechRise.",
        "Sumit is currently working on a social media campaign.",
        "5 people are viewing the Student Corner right now."
    ];

    const showPulseToast = () => {
        const msg = pulseMessages[Math.floor(Math.random() * pulseMessages.length)];
        const pulseToast = document.createElement('div');
        pulseToast.className = 'site-toast active';
        pulseToast.style.bottom = '120px';
        pulseToast.style.right = '40px';
        pulseToast.style.zIndex = '999';
        pulseToast.innerHTML = `<span class="pulse-indicator"></span> ${msg}`;
        document.body.appendChild(pulseToast);

        setTimeout(() => {
            pulseToast.classList.remove('active');
            setTimeout(() => pulseToast.remove(), 500);
        }, 4000);
    };

    // Show first pulse after 10s, then every 30s
    setTimeout(() => {
        showPulseToast();
        setInterval(showPulseToast, 30000);
    }, 10000);

    // ── Testimonials modernized to Grid ──

    // ── NEW PREMIUM FEATURES ──

    // 1. Reading Progress Bar
    const progress = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progress) progress.style.width = scrolled + "%";
    }, { passive: true });

    // 2. Custom Context Menu
    const ctxMenu = document.getElementById('custom-menu');
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!ctxMenu) return;
        ctxMenu.style.left = e.clientX + 'px';
        ctxMenu.style.top = e.clientY + 'px';
        ctxMenu.classList.add('active');
    });

    window.addEventListener('click', () => {
        ctxMenu?.classList.remove('active');
    });

    document.getElementById('menu-theme-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('theme-toggle')?.click();
    });

    document.getElementById('menu-confetti')?.addEventListener('click', (e) => {
        e.stopPropagation();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    });

    // 3. Page Transitions
    const curtain = document.getElementById('page-transition');
    document.querySelectorAll('a[href^="catalog-"], a[href="cart.html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target.startsWith('#')) return;
            e.preventDefault();
            curtain?.classList.add('active');
            setTimeout(() => window.location.href = target, 800);
        });
    });

    // 4. Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const key = e.key.toLowerCase();
        if (key === 'h') window.scrollTo({ top: 0, behavior: 'smooth' });
        if (key === 'c') document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        if (key === 'p') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        if (key === 't') document.getElementById('theme-toggle')?.click();
        if (key === 's') document.getElementById('sfx-toggle')?.click();
    });

    // 5. Project Image Magnifier
    const mag = document.getElementById('magnifier');
    document.querySelectorAll('.proj-img').forEach(img => {
        img.addEventListener('mousemove', (e) => {
            if (!mag) return;
            mag.style.display = 'block';
            mag.style.left = (e.clientX - 75) + 'px';
            mag.style.top = (e.clientY - 75) + 'px';

            const r = img.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;

            mag.style.backgroundImage = `url(${img.src})`;
            mag.style.backgroundPosition = `${x}% ${y}%`;
            mag.style.backgroundSize = (r.width * 2) + 'px ' + (r.height * 2) + 'px';
        });
        img.addEventListener('mouseleave', () => mag && (mag.style.display = 'none'));
    });

    // 7. Price Estimator Logic
    const estModal = document.getElementById('estimator-modal');
    const estTotal = document.getElementById('est-total');
    const checks = document.querySelectorAll('.est-check');

    const updateEstimate = () => {
        let total = 0;
        checks.forEach(c => { if (c.checked) total += parseInt(c.dataset.price); });
        if (estTotal) estTotal.textContent = total;
    };

    document.getElementById('open-estimator')?.addEventListener('click', () => estModal?.classList.add('active'));
    document.getElementById('estimator-close')?.addEventListener('click', () => estModal?.classList.remove('active'));
    checks.forEach(c => c.addEventListener('change', updateEstimate));

    // 8. Enhanced Magnetic Socials
    document.querySelectorAll('.soc-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.6;
            const y = (e.clientY - r.top - r.height / 2) * 0.6;
            btn.style.transform = `translate(${x}px, ${y}px)`;
            btn.style.boxShadow = `${-x / 2}px ${-y / 2}px 20px rgba(95,15,255,0.3)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        });
    });

    // 9. Clickbait: Scratch Card
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '24px Outfit';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2 + 10);

        let isScratching = false;
        const scratch = (e) => {
            const r = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - r.left;
            const y = (e.clientY || e.touches[0].clientY) - r.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.fill();
        };

        canvas.addEventListener('mousedown', () => isScratching = true);
        window.addEventListener('mouseup', () => isScratching = false);
        canvas.addEventListener('mousemove', (e) => isScratching && scratch(e));
        canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
        canvas.addEventListener('touchend', () => isScratching = false);
        canvas.addEventListener('touchmove', (e) => isScratching && scratch(e));
    }

    // 10. Clickbait: Unread Toast
    const uToast = document.getElementById('unread-toast');
    setTimeout(() => uToast?.classList.add('active'), 25000);
    document.getElementById('open-unread')?.addEventListener('click', () => {
        uToast?.classList.remove('active');
        showToast('Checking secure connection...');
        setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            showToast('Ready to start your project!');
        }, 1500);
    });


    // ── Transformation Slider Logic ──
    const initTransformationSlider = () => {
        const slider = document.getElementById('brand-evolution');
        if (!slider) return;
        const afterItem = slider.querySelector('.compare-item.after');
        const handle = slider.querySelector('.slider-handle');

        const move = (e) => {
            const rect = slider.getBoundingClientRect();
            const pageX = e.pageX || (e.touches && e.touches[0].pageX);
            if (!pageX) return;
            const x = pageX - rect.left - window.scrollX;
            let pos = (x / rect.width) * 100;
            if (pos < 0) pos = 0;
            if (pos > 100) pos = 100;
            afterItem.style.width = `${pos}%`;
            handle.style.left = `${pos}%`;
        };

        slider.addEventListener('mousemove', move);
        slider.addEventListener('touchmove', move);
    };
    initTransformationSlider();

    // ── Shuffle Filter Animation ──
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(20px)';
                setTimeout(() => {
                    const matches = filter === 'all' || card.dataset.category === filter;
                    card.style.display = matches ? 'block' : 'none';
                    if (matches) {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    }
                }, 300);
            });
        });
    });

});
    // -- Value Bar Animation --
    const valueBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.value-bar-fill');
                if (fill) {
                    fill.style.width = fill.dataset.width;
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.value-bar-item').forEach(item => valueBarObserver.observe(item));

