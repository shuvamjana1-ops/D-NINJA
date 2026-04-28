document.addEventListener('DOMContentLoaded', () => {

    // ── Theme Toggle ──
    const initTheme = () => {
        const savedTheme = localStorage.getItem('dninja-theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-mode');
        }
        updateThemeIcons();
    };

    const updateThemeIcons = () => {
        const isDark = document.body.classList.contains('dark-mode');
        document.querySelectorAll('.theme-toggle i').forEach(icon => {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    };

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('dninja-theme', isDark ? 'dark' : 'light');
            updateThemeIcons();
        });
    });

    initTheme();

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
        if (count === 100) setTimeout(() => preloader.classList.add('hidden'), 400);
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
        rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(anim);
    })();
    document.querySelectorAll('a,button,.about-tags span,.proj-item,.skill-row,.soc-btn,.pf-btn').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hov'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
    });

    // ── Navbar ──
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const btt = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', scrollY > 60);
        btt.classList.toggle('visible', scrollY > 600);
        let cur = '';
        document.querySelectorAll('section').forEach(s => { if (scrollY >= s.offsetTop - 140) cur = s.id; });
        document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === cur));
    });
    toggle.addEventListener('click', () => { toggle.classList.toggle('active'); drawer.classList.toggle('open'); });
    document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', () => { toggle.classList.remove('active'); drawer.classList.remove('open'); }));
    btt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

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

    // ── Scroll reveal ──
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

    // ── Contact form ──
    const form = document.getElementById('contact-form');
    if (form) form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.innerHTML = '<span>Sent ✓</span>';
        btn.style.background = '#22c55e';
        setTimeout(() => {
            btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            btn.style.background = '';
            form.reset();
        }, 2500);
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
});