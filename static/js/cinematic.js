/**
 * Homepage extras: CSS-mesh mouse follow.
 * No WebGL, GSAP, Lenis, or custom cursor.
 */

function runCinematicSetup() {
    if (!document.getElementById('hero-section')) return;
    initHeroMesh();
}

window.runCinematicSetup = runCinematicSetup;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runCinematicSetup);
} else {
    runCinematicSetup();
}

document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    var url = new URL(link.href, window.location.origin);
    if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash === window.location.hash) {
        if (url.pathname === '/' || url.pathname === '/index.html') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        var nav = document.querySelector('.right-nav');
        if (nav && nav.classList.contains('active') && window.toggleMobileMenu) {
            window.toggleMobileMenu();
        }
        e.preventDefault();
    }
});

function initHeroMesh() {
    var hero = document.getElementById('hero-section');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(any-pointer: fine)').matches) return;
    if (hero.dataset.meshBound) return;
    hero.dataset.meshBound = '1';

    hero.addEventListener('pointermove', function (event) {
        var box = hero.getBoundingClientRect();
        var x = ((event.clientX - box.left) / box.width) * 100;
        var y = ((event.clientY - box.top) / box.height) * 100;
        hero.style.setProperty('--mx', x.toFixed(2) + '%');
        hero.style.setProperty('--my', y.toFixed(2) + '%');
        hero.style.setProperty('--px', ((x / 100) - 0.5).toFixed(3));
        hero.style.setProperty('--py', ((y / 100) - 0.5).toFixed(3));
    }, { passive: true });
}
