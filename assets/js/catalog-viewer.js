/**
 * D'NINJA — Catalog Viewer
 * Pinterest masonry grid + Google/Lightbox image viewer
 * Features: zoom, pan, download, prev/next, keyboard nav, share
 */
(function () {
    'use strict';

    /* ─── CONFIG ─── */
    const MAX_IMAGES = 60;
    const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    
    // GOOGLE FORM CONFIG
    const FORM_CONFIG = {
        url: "https://docs.google.com/forms/d/e/1FAIpQLSfSTa2vXu7hfrneCq3plXLOIn9W68XQvZULHnSnfFl4dWRaVg/viewform", // Your actual Form URL
        designEntryId: "entry.123456789" // Replace this with your Design Name field Entry ID later
    };

    /* ─── STATE ─── */
    let images = [];       // { src, alt }
    let currentIdx = 0;
    let zoom = 1;
    let panX = 0, panY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let panStartX = 0, panStartY = 0;
    let viewMode = 'grid'; // 'scroll' | 'grid'

    /* ─── DOM REFS ─── */
    const track = document.getElementById('gallery-track');
    const scrollWrap = document.getElementById('scroll-wrap');
    const folder = track ? track.dataset.folder : '';
    const label = track ? track.dataset.label : '';

    /* ─── UTILITIES ─── */
    const el = (tag, cls, html) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html) e.innerHTML = html;
        return e;
    };

    const getOrderUrl = (name) => {
        const baseUrl = FORM_CONFIG.url;
        const entryId = FORM_CONFIG.designEntryId;
        return `${baseUrl}?${entryId}=${encodeURIComponent(name)}`;
    };

    const handleAddToCart = (idx) => {
        const img = images[idx];
        // Ensure the path in the cart is always root-relative (images/...)
        const cleanSrc = img.src.replace(/^(\.\.\/)+/, '');
        
        if (window.dninjaCart) {
            window.dninjaCart.addItem({
                id: `${img.folder}-${img.idx}`,
                name: img.alt,
                src: cleanSrc,
                folder: img.folder
            });
        }
    };

    /* ═══════════════════════════════════════════
       1. LOAD IMAGES (try jpg → png → webp)
    ═══════════════════════════════════════════ */
    function loadImages() {
        images = [];
        if (!window.CATALOG_DATA) {
            console.error("CATALOG_DATA not found. Run Sync-Images.bat!");
            onAllAttempted();
            return;
        }

        const isSubfolder = window.location.pathname.includes('/catalog/');
        const pathPrefix = isSubfolder ? '../' : '';

        if (folder === 'all') {
            let globalIdx = 0;
            for (const f in window.CATALOG_DATA) {
                window.CATALOG_DATA[f].forEach((item) => {
                    images.push({
                        src: pathPrefix + item.src,
                        alt: item.name,
                        idx: globalIdx++,
                        folder: f
                    });
                });
            }
        } else {
            const folderData = window.CATALOG_DATA[folder] || [];
            folderData.forEach((item, i) => {
                images.push({
                    src: pathPrefix + item.src,
                    alt: item.name,
                    idx: i,
                    folder: folder
                });
            });
        }
        
        onAllAttempted();
    }

    let allAttempted = false;
    function onAllAttempted() {
        if (allAttempted) return;
        allAttempted = true;
        renderGridView();
        if (images.length === 0) renderEmpty();

        // Apply URL search filter if present
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) {
            applySearchFilter(q);
        }
    }

    function applySearchFilter(query) {
        const q = query.toLowerCase();
        const items = document.querySelectorAll('.gallery-frame, .masonry-card');
        items.forEach(item => {
            if (item.dataset.search.includes(q)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }



    /* ═══════════════════════════════════════════
       2. RENDER — HORIZONTAL SCROLL (default)
    ═══════════════════════════════════════════ */
    function renderScrollView() {
        document.body.classList.add('horizontal-mode');
        track.innerHTML = '';
        images.forEach((img, i) => {
            const displayName = img.alt;
            const searchStr = img.alt.toLowerCase();

            const frame = el('div', 'gallery-frame');
            frame.setAttribute('data-search', searchStr);
            frame.innerHTML = `
                <div class="gf-inner">
                    <img src="${img.src}" alt="${img.alt}" class="gf-img" loading="lazy">
                    <div class="gf-actions">
                        <button class="gf-action-btn" data-action="view" data-idx="${i}" title="View fullscreen">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button class="gf-action-btn" data-action="download" data-src="${img.src}" data-name="${folder}-${img.idx}" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="gf-action-btn add-to-cart-btn" data-idx="${i}" title="Add to Cart">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <a href="${getOrderUrl(displayName)}" target="_blank" class="gf-action-btn" title="Quick Order (Google Form)">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                    <div class="gf-caption">
                        <span class="gf-text">${displayName}</span>
                        <span class="gf-num">${String(img.idx).padStart(2, '0')}</span>
                    </div>
                </div>`;
            track.appendChild(frame);

            /* cursor hover */
            const ring = document.getElementById('cursor-ring');
            if (ring) {
                frame.addEventListener('mouseenter', () => ring.classList.add('hov'));
                frame.addEventListener('mouseleave', () => ring.classList.remove('hov'));
            }

            /* click image → lightbox */
            frame.querySelector('.gf-inner').addEventListener('click', (e) => {
                if (!e.target.closest('.gf-action-btn')) openLightbox(i);
            });
            frame.querySelector('[data-action="view"]').addEventListener('click', () => openLightbox(i));
            frame.querySelector('[data-action="download"]').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadImage(img.src, `${folder}-${img.idx}`);
            });
            frame.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                handleAddToCart(i);
            });
        });
    }

    /* ═══════════════════════════════════════════
       3. RENDER — PINTEREST MASONRY GRID
    ═══════════════════════════════════════════ */
    function renderGridView() {
        document.body.classList.remove('horizontal-mode');
        // Switch layout container
        scrollWrap.classList.add('grid-mode');
        track.classList.add('masonry-grid');
        track.innerHTML = '';

        images.forEach((img, i) => {
            const displayName = img.alt;
            const searchStr = img.alt.toLowerCase();

            const card = el('div', 'masonry-card');
            card.setAttribute('data-search', searchStr);
            card.innerHTML = `
                <img src="${img.src}" alt="${img.alt}" class="masonry-img" loading="lazy">
                <div class="masonry-overlay">
                    <div class="masonry-actions">
                        <button class="masonry-btn" data-action="view" data-idx="${i}" title="View">
                            <i class="fas fa-search-plus"></i>
                        </button>
                        <button class="masonry-btn" data-action="download" data-src="${img.src}" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="masonry-btn add-to-cart-btn" data-idx="${i}" title="Add to Cart">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <a href="${getOrderUrl(displayName)}" target="_blank" class="masonry-btn" title="Quick Order">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                    <div class="masonry-label">${displayName}</div>
                </div>`;
            track.appendChild(card);

            card.querySelector('[data-action="view"]').addEventListener('click', () => openLightbox(i));
            card.querySelector('[data-action="download"]').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadImage(img.src, `${folder}-${img.idx}`);
            });
            card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                handleAddToCart(i);
            });
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.masonry-btn')) openLightbox(i);
            });

            // 3D Tilt Effect
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const xc = r.width / 2;
                const yc = r.height / 2;
                const dx = (x - xc) / 10;
                const dy = (y - yc) / 10;
                card.style.transform = `perspective(1000px) rotateY(${dx}deg) rotateX(${-dy}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ═══════════════════════════════════════════
       4. VIEW MODE TOGGLE
    ═══════════════════════════════════════════ */
    function buildViewToggle() {
        const nav = document.querySelector('.catalog-nav .catalog-right');
        if (!nav) return;

        const toggleWrap = el('div', 'view-toggle-wrap');
        toggleWrap.innerHTML = `
            <button class="view-toggle-btn" id="btn-scroll" title="Scroll view">
                <i class="fas fa-grip-lines"></i>
            </button>
            <button class="view-toggle-btn active" id="btn-grid" title="Grid view">
                <i class="fas fa-th"></i>
            </button>`;
        nav.insertBefore(toggleWrap, nav.firstChild);

        document.getElementById('btn-scroll').addEventListener('click', () => {
            if (viewMode === 'scroll') return;
            viewMode = 'scroll';
            document.getElementById('btn-scroll').classList.add('active');
            document.getElementById('btn-grid').classList.remove('active');
            scrollWrap.classList.remove('grid-mode');
            track.classList.remove('masonry-grid');
            renderScrollView();
            bindScrollWheel();
        });

        document.getElementById('btn-grid').addEventListener('click', () => {
            if (viewMode === 'grid') return;
            viewMode = 'grid';
            document.getElementById('btn-grid').classList.add('active');
            document.getElementById('btn-scroll').classList.remove('active');
            renderGridView();
        });
    }

    /* ═══════════════════════════════════════════
       5. LIGHTBOX
    ═══════════════════════════════════════════ */
    function buildLightbox() {
        const lb = el('div', 'lb-overlay', `
            <div class="lb-backdrop"></div>
            <div class="lb-container">
                <div class="lb-toolbar">
                    <div class="lb-toolbar-left">
                        <span class="lb-counter" id="lb-counter">1 / 1</span>
                        <span class="lb-title" id="lb-title"></span>
                    </div>
                    <div class="lb-toolbar-right">
                        <button class="lb-btn" id="lb-zoom-out" title="Zoom out"><i class="fas fa-search-minus"></i></button>
                        <button class="lb-btn" id="lb-zoom-in" title="Zoom in"><i class="fas fa-search-plus"></i></button>
                        <button class="lb-btn" id="lb-zoom-reset" title="Reset zoom"><i class="fas fa-expand-arrows-alt"></i></button>
                        <button class="lb-btn" id="lb-download" title="Download"><i class="fas fa-download"></i></button>
                        <button class="lb-btn lb-cart-btn" id="lb-add-to-cart" title="Add to Cart">
                            <i class="fas fa-cart-plus"></i> <span class="order-text">Add to Cart</span>
                        </button>
                        <a href="#" target="_blank" class="lb-btn lb-order-btn" id="lb-order" title="Order Now">
                            <i class="fas fa-external-link-alt"></i> <span class="order-text">Order Form</span>
                        </a>
                        <button class="lb-btn" id="lb-share" title="Copy link"><i class="fas fa-share-alt"></i></button>
                        <button class="lb-btn lb-close-btn" id="lb-close" title="Close (Esc)"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                <div class="lb-stage" id="lb-stage">
                    <button class="lb-nav lb-prev" id="lb-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="lb-img-wrap" id="lb-img-wrap">
                        <img class="lb-img" id="lb-img" src="" alt="">
                        <div class="lb-zoom-indicator" id="lb-zoom-indicator">100%</div>
                    </div>
                    <button class="lb-nav lb-next" id="lb-next"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="lb-thumbnails" id="lb-thumbnails"></div>
            </div>
        `);
        lb.id = 'lb-overlay';
        document.body.appendChild(lb);

        /* Events */
        document.getElementById('lb-close').addEventListener('click', closeLightbox);
        lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
        document.getElementById('lb-prev').addEventListener('click', () => navigateLightbox(-1));
        document.getElementById('lb-next').addEventListener('click', () => navigateLightbox(1));
        document.getElementById('lb-zoom-in').addEventListener('click', () => applyZoom(zoom * 1.3));
        document.getElementById('lb-zoom-out').addEventListener('click', () => applyZoom(zoom / 1.3));
        document.getElementById('lb-zoom-reset').addEventListener('click', () => applyZoom(1));
        document.getElementById('lb-download').addEventListener('click', () => downloadImage(images[currentIdx].src, `${folder}-${images[currentIdx].idx}`));
        document.getElementById('lb-add-to-cart').addEventListener('click', () => handleAddToCart(currentIdx));
        document.getElementById('lb-share').addEventListener('click', shareImage);

        /* Click to toggle zoom like Pinterest */
        document.getElementById('lb-img').addEventListener('click', (e) => {
            if (isDragging) return;
            if (zoom === 1) {
                const rect = e.target.getBoundingClientRect();
                const offsetX = e.clientX - rect.left - (rect.width / 2);
                const offsetY = e.clientY - rect.top - (rect.height / 2);
                panX = -offsetX * 1.5;
                panY = -offsetY * 1.5;
                applyZoom(2.5);
            } else {
                applyZoom(1);
            }
        });

        /* Scroll to zoom */
        document.getElementById('lb-stage').addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            applyZoom(zoom * delta);
        }, { passive: false });

        /* Drag to pan */
        const imgWrap = document.getElementById('lb-img-wrap');
        imgWrap.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);
        imgWrap.addEventListener('touchstart', startDragTouch, { passive: true });
        window.addEventListener('touchmove', onDragTouch, { passive: false });
        window.addEventListener('touchend', endDrag);

        /* Keyboard */
        document.addEventListener('keydown', onKeyDown);
    }

    function openLightbox(idx) {
        currentIdx = idx;
        zoom = 1; panX = 0; panY = 0;
        document.getElementById('lb-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightbox();
        buildThumbnails();
    }

    function closeLightbox() {
        document.getElementById('lb-overlay').classList.remove('active');
        document.body.style.overflow = '';
        zoom = 1; panX = 0; panY = 0;
    }

    function navigateLightbox(dir) {
        currentIdx = (currentIdx + dir + images.length) % images.length;
        zoom = 1; panX = 0; panY = 0;
        updateLightbox();
        updateThumbnailActive();
    }

    function updateLightbox() {
        const img = images[currentIdx];
        const lbImg = document.getElementById('lb-img');
        lbImg.style.opacity = '0';
        lbImg.onload = () => { lbImg.style.opacity = '1'; };
        lbImg.src = img.src;
        if (lbImg.complete) {
            lbImg.style.opacity = '1';
        }
        lbImg.alt = img.alt;
        document.getElementById('lb-counter').textContent = `${currentIdx + 1} / ${images.length}`;
        document.getElementById('lb-title').textContent = img.alt;
        document.getElementById('lb-order').href = getOrderUrl(img.alt);
        applyZoom(1);

        // Show/hide prev-next
        document.getElementById('lb-prev').style.visibility = images.length > 1 ? 'visible' : 'hidden';
        document.getElementById('lb-next').style.visibility = images.length > 1 ? 'visible' : 'hidden';
    }

    function buildThumbnails() {
        const strip = document.getElementById('lb-thumbnails');
        strip.innerHTML = '';
        images.forEach((img, i) => {
            const thumb = el('div', `lb-thumb${i === currentIdx ? ' active' : ''}`);
            thumb.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
            thumb.addEventListener('click', () => {
                currentIdx = i;
                zoom = 1; panX = 0; panY = 0;
                updateLightbox();
                updateThumbnailActive();
            });
            strip.appendChild(thumb);
        });
        scrollThumbIntoView();
    }

    function updateThumbnailActive() {
        document.querySelectorAll('.lb-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === currentIdx);
        });
        scrollThumbIntoView();
    }

    function scrollThumbIntoView() {
        const active = document.querySelector('.lb-thumb.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    /* ─── Zoom ─── */
    function applyZoom(z) {
        zoom = Math.max(0.5, Math.min(5, z));
        if (zoom === 1) { panX = 0; panY = 0; }
        const imgWrap = document.getElementById('lb-img-wrap');
        imgWrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
        
        const lbImg = document.getElementById('lb-img');
        if (lbImg) lbImg.style.cursor = zoom > 1 ? 'zoom-out' : 'zoom-in';
        imgWrap.style.cursor = zoom > 1 ? 'grab' : 'default';
        document.getElementById('lb-zoom-indicator').textContent = Math.round(zoom * 100) + '%';
        document.getElementById('lb-zoom-indicator').classList.add('show');
        clearTimeout(window._zoomHideTimer);
        window._zoomHideTimer = setTimeout(() => {
            document.getElementById('lb-zoom-indicator').classList.remove('show');
        }, 1200);
    }

    /* ─── Pan / Drag ─── */
    function startDrag(e) {
        if (zoom <= 1) return;
        isDragging = true;
        dragStartX = e.clientX; dragStartY = e.clientY;
        panStartX = panX; panStartY = panY;
        document.getElementById('lb-img-wrap').style.cursor = 'grabbing';
        e.preventDefault();
    }
    function startDragTouch(e) {
        if (zoom <= 1 || e.touches.length !== 1) return;
        isDragging = true;
        dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY;
        panStartX = panX; panStartY = panY;
    }
    function onDrag(e) {
        if (!isDragging) return;
        panX = panStartX + (e.clientX - dragStartX);
        panY = panStartY + (e.clientY - dragStartY);
        document.getElementById('lb-img-wrap').style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    }
    function onDragTouch(e) {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        panX = panStartX + (e.touches[0].clientX - dragStartX);
        panY = panStartY + (e.touches[0].clientY - dragStartY);
        document.getElementById('lb-img-wrap').style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    }
    function endDrag() {
        isDragging = false;
        if (document.getElementById('lb-img-wrap'))
            document.getElementById('lb-img-wrap').style.cursor = zoom > 1 ? 'grab' : 'default';
    }

    /* ─── Keyboard ─── */
    function onKeyDown(e) {
        const lb = document.getElementById('lb-overlay');
        if (!lb || !lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === '+' || e.key === '=') applyZoom(zoom * 1.2);
        if (e.key === '-') applyZoom(zoom / 1.2);
        if (e.key === '0') applyZoom(1);
    }

    /* ─── Download ─── */
    function downloadImage(src, name) {
        const a = document.createElement('a');
        a.href = src;
        a.download = name || 'image';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /* ─── Share / Copy ─── */
    function shareImage() {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: images[currentIdx].alt, url });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                const btn = document.getElementById('lb-share');
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => btn.innerHTML = orig, 2000);
            });
        }
    }

    /* ─── Empty state ─── */
    function renderEmpty() {
        track.innerHTML = `
            <div class="catalog-empty">
                <i class="fas fa-folder-open"></i>
                <p>No images found in<br><code>images/${folder}/</code></p>
                <span>Save your designs here with descriptive names<br>
                e.g. <code>my-cool-design.jpg</code><br>
                then run <code>Sync-Images.bat</code></span>
            </div>`;
    }

    /* ═══════════════════════════════════════════
       6. HORIZONTAL SCROLL WHEEL
    ═══════════════════════════════════════════ */
    function bindScrollWheel() {
        if (scrollWrap) {
            scrollWrap.addEventListener('wheel', (e) => {
                if (viewMode !== 'scroll') return;
                e.preventDefault();
                scrollWrap.scrollBy({ left: e.deltaY * 2.5, behavior: 'smooth' });
            }, { passive: false });
        }
    }

    /* ═══════════════════════════════════════════
       7. INIT
    ═══════════════════════════════════════════ */
    function init() {
        if (!track || !folder) return;
        buildLightbox();
        buildViewToggle();
        loadImages();
        bindScrollWheel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
