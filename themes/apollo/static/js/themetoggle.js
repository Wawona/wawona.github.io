const setTheme = m => localStorage.setItem("theme-storage", m);
const getSavedTheme = () => localStorage.getItem("theme-storage") || (getSysDark() ? "dark" : "light");
const getSysDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

let isToggling = false;

function toggleTheme() {
    if (isToggling) return;
    isToggling = true;

    const b = document.getElementById('dark-mode-toggle'), r = b?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : innerWidth / 2, y = r ? r.top + r.height / 2 : 0;
    const root = document.documentElement, dur = 800;

    const getEff = m => m === "auto" ? (getSysDark() ? "dark" : "light") : m;
    const cur = getSavedTheme(), next = cur === "light" ? "dark" : (cur === "dark" ? "auto" : "light");

    const cycle = () => {
        setTheme(next);
        updateItemToggleTheme();
        const icon = document.getElementById((next === "light" ? "sun" : next === "dark" ? "moon" : "auto") + "-icon");
        if (icon) { icon.classList.remove("theme-icon-pop"); void icon.offsetWidth; icon.classList.add("theme-icon-pop"); }
        return getEff(cur) !== getEff(next);
    };

    if (getEff(cur) === getEff(next) || !document.startViewTransition) {
        cycle(); isToggling = false; return;
    }

    root.style.setProperty('--reveal-x', `${x}px`);
    root.style.setProperty('--reveal-y', `${y}px`);

    const maxR = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(cycle);
    vt.ready.then(() => {
        root.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${maxR * 1.1}px at ${x}px ${y}px)` }],
            { duration: dur, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards', pseudoElement: '::view-transition-new(root)' });
        window.RippleOverlay?.trigger?.(x, y, dur);
    });
    vt.finished.finally(() => isToggling = false);
}

function updateItemToggleTheme() {
    const mode = getSavedTheme(), isDark = mode === "dark" || (mode === "auto" && getSysDark());
    const ss = document.getElementById("darkModeStyle");
    if (ss) ss.disabled = !isDark;

    const btn = document.getElementById('dark-mode-toggle');
    if (btn) btn.setAttribute('data-hint', "Theme: " + mode[0].toUpperCase() + mode.slice(1));

    const active = mode === "light" ? "sun" : mode === "dark" ? "moon" : "auto";
    ["sun", "moon", "auto"].forEach(id => {
        const el = document.getElementById(id + "-icon");
        if (el) {
            el.style.display = (active === id) ? "block" : "none";
            if (id === "auto") el.style.filter = getSysDark() ? "invert(1)" : "invert(0)";
        }
    });
    document.documentElement.className = isDark ? "dark" : "light";
}

updateItemToggleTheme();
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => getSavedTheme() === "auto" && updateItemToggleTheme());
