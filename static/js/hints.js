(function () {
    var PAD = 8;
    var probe = null;
    var active = null;

    function measure(text) {
        if (!probe) {
            probe = document.createElement("span");
            probe.setAttribute("aria-hidden", "true");
            probe.style.cssText = "position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;font-size:0.75rem;font-weight:600;line-height:1.25;padding:0.25rem 0.6rem;border:1px solid;white-space:nowrap;box-sizing:border-box";
            document.body.appendChild(probe);
        }
        probe.textContent = text;
        return { w: probe.offsetWidth, h: probe.offsetHeight };
    }

    function place(el) {
        var text = el.getAttribute("data-hint");
        if (!text) return;
        var host = el.getBoundingClientRect();
        var wrap = el.hasAttribute("data-hint-wrap");
        var size = wrap
            ? { w: Math.min(352, window.innerWidth - PAD * 2), h: 72 }
            : measure(text);
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var roomBelow = vh - host.bottom - PAD;
        var roomAbove = host.top - PAD;
        if (size.h > roomBelow && roomAbove >= size.h) el.classList.add("hint-above");
        else el.classList.remove("hint-above");

        if (wrap) {
            el.style.setProperty("--hint-dx", "0px");
        } else {
            var center = host.left + host.width / 2;
            var left = center - size.w / 2;
            if (left < PAD) left = PAD;
            if (left + size.w > vw - PAD) left = Math.max(PAD, vw - PAD - size.w);
            el.style.setProperty("--hint-dx", (left - (center - size.w / 2)) + "px");
        }
        active = el;
    }

    function clear(el) {
        if (!el) return;
        el.style.removeProperty("--hint-dx");
        el.classList.remove("hint-above");
        if (active === el) active = null;
    }

    function hostOf(node) {
        return node && node.closest ? node.closest("[data-hint]") : null;
    }

    document.addEventListener("pointerover", function (event) {
        var next = hostOf(event.target);
        var prev = hostOf(event.relatedTarget);
        if (next && next !== prev) place(next);
    });

    document.addEventListener("pointerout", function (event) {
        var prev = hostOf(event.target);
        var next = hostOf(event.relatedTarget);
        if (prev && prev !== next) clear(prev);
    });

    document.addEventListener("focusin", function (event) {
        var el = hostOf(event.target);
        if (el) place(el);
    });

    document.addEventListener("focusout", function (event) {
        var el = hostOf(event.target);
        if (el) clear(el);
    });

    window.addEventListener("resize", function () {
        if (active) place(active);
    });
})();
