document.addEventListener('DOMContentLoaded', () => {

    // ── Theme Forced (Constant Dark Mode) ──
    document.body.classList.add('dark-mode');
    localStorage.setItem('dninja-theme', 'dark');

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

    // ── Preloader with counter ──
    const counter = document.getElementById('pre-counter');
    const fill = document.getElementById('pre-fill');
    const preloader = document.getElementById('preloader');
    let count = 0;
    const tick = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 3;
        if (count >= 100) { count = 100; clearInterval(tick); }
        counter.textContent = count;
        fill.style.width = count + '%';
        if (count === 100) {
            if (preloader) setTimeout(() => preloader.classList.add('hidden'), 400);
            else clearInterval(tick);
        }
    }, 40);

    // ── Cursor ──
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function anim() {
        if (ring) {
            rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
            ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        }

        // Mouse Reactive Background Blobs
        const bx = (mx / window.innerWidth - 0.5) * 50;
        const by = (my / window.innerHeight - 0.5) * 50;
        document.body.style.setProperty('--bx', bx + 'px');
        document.body.style.setProperty('--by', by + 'px');

        requestAnimationFrame(anim);
    })();
    // ── Smart Cursor Transformations ──
    if (dot && ring) {
        document.querySelectorAll('a,button,.about-tags span,.proj-item,.masonry-card,.team-card,.student-card,.skill-row,.soc-btn,.pf-btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                ring.classList.add('hov');
                if (el.classList.contains('proj-item') || el.classList.contains('masonry-card')) {
                    ring.classList.add('view-mode');
                }
            });
            el.addEventListener('mouseleave', () => {
                ring.classList.remove('hov');
                ring.classList.remove('view-mode');
            });
        });
    }

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

    // ── Navbar ──
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const btt = document.getElementById('back-to-top');

    let lastScroll = 0;
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

        if (navbar) navbar.classList.toggle('scrolled', scrollY > 60);
        if (btt) btt.classList.toggle('visible', scrollY > 600);
        
        // Update Progress Bar (Top)
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const topBar = document.getElementById('top-progress');
        if (topBar) topBar.style.width = scrolled + "%";

        // Update BTT Progress Ring & Percent
        const circleFill = document.querySelector('.btt-circle-fill');
        const percentText = document.getElementById('btt-percent');
        if (circleFill) {
            const circumference = 150.8;
            circleFill.style.strokeDashoffset = circumference - (scrolled / 100) * circumference;
        }
        if (percentText) percentText.textContent = Math.floor(scrolled) + "%";

        let cur = '';
        document.querySelectorAll('section').forEach(s => { if (scrollY >= s.offsetTop - 140) cur = s.id; });
        document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === cur));
    });
    if (toggle && drawer) {
        toggle.addEventListener('click', () => { toggle.classList.toggle('active'); drawer.classList.toggle('open'); });
    }
    document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', () => { 
        if (toggle) toggle.classList.remove('active'); 
        if (drawer) drawer.classList.remove('open'); 
    }));
    if (btt) btt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Typed text ──
    const phrases = ['brand identities.', 'visual experiences.', 'logos that speak.', 'social campaigns.', 'print that pops.', 'bold typography.'];
    let pi = 0, ci = 0, del = false;
    const typed = document.getElementById('typed-text');
    function type() {
        if (!typed) return;
        typed.textContent = phrases[pi].substring(0, ci);
        if (!del) { ci++; if (ci > phrases[pi].length) { del = true; setTimeout(type, 2000); return; } }
        else { ci--; if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
        setTimeout(type, del ? 30 : 70);
    }
    setTimeout(type, 2800);

    // ── Magnetic Navigation ──
    const magneticLinks = document.querySelectorAll('.nav-link, .nav-logo, .nav-hire');
    magneticLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });

    // ── Section Reveal ──
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                e.target.style.transitionDelay = (i * 0.1) + 's';
                e.target.classList.add('revealed');
                // trigger skill bars
                e.target.querySelectorAll('.skill-bar-fill').forEach(b => b.style.width = b.dataset.w + '%');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

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

    // ── Magnetic nav-hire button ──
    const hireBtn = document.querySelector('.nav-hire');
    if (hireBtn) {
        hireBtn.addEventListener('mousemove', e => {
            const r = hireBtn.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) * 0.35;
            const dy = (e.clientY - r.top - r.height / 2) * 0.35;
            hireBtn.style.transform = `translate(${dx}px,${dy}px)`;
        });
        hireBtn.addEventListener('mouseleave', () => hireBtn.style.transform = '');
    }

    // ── Hero name scramble on scroll circle hover ──
    const scrollBtn = document.getElementById('hero-scroll-btn');
    if (scrollBtn) scrollBtn.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });

    // ── 3D Card Tilt ──
    const tiltCards = document.querySelectorAll('.proj-item, .service-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const xc = r.width / 2;
            const yc = r.height / 2;
            const dx = (x - xc) / 15;
            const dy = (y - yc) / 15;
            card.style.transform = `perspective(1000px) rotateY(${dx}deg) rotateX(${-dy}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

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

    // ── Global Magnetic Elements ──
    document.querySelectorAll('.nav-link, .pf-btn, .search-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) * 0.3;
            const dy = (e.clientY - r.top - r.height / 2) * 0.3;
            btn.style.transform = `translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = '');
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

    // ── Global Search Logic ──
    const globalInput = document.getElementById('global-search-input');
    const globalBtn = document.getElementById('global-search-btn');
    
    const executeGlobalSearch = () => {
        const query = globalInput.value.trim();
        if(query) {
            window.location.href = `catalog-all.html?q=${encodeURIComponent(query)}`;
        } else {
            window.location.href = `catalog-all.html`;
        }
    };

    if(globalBtn && globalInput) {
        globalBtn.addEventListener('click', executeGlobalSearch);
        globalInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') executeGlobalSearch();
        });
    }

    // ── Pricing Modal Logic ──
    const pricingModal = document.getElementById('pricing-modal');
    const btnPricingNav = document.getElementById('pricing-btn');
    const btnPricingDrawer = document.getElementById('drawer-pricing-btn');
    const btnPricingClose = document.getElementById('pricing-close');
    const modalCtaBtn = document.getElementById('modal-cta-btn');
    
    const openPricing = (e) => {
        if (e) e.preventDefault();
        if (pricingModal) {
            pricingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
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

    if(btnPricingNav) btnPricingNav.addEventListener('click', openPricing);
    if(btnPricingDrawer) btnPricingDrawer.addEventListener('click', openPricing);
    if(btnPricingClose) btnPricingClose.addEventListener('click', closePricing);
    
    window.addEventListener('click', (e) => {
        if (e.target === pricingModal) closePricing();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pricingModal && pricingModal.classList.contains('active')) closePricing();
    });
    if(modalCtaBtn) modalCtaBtn.addEventListener('click', closePricing);
});