window.initTOC = () => {
  if (window._tocObserver) {
    window._tocObserver.disconnect();
    window._tocObserver = null;
  }

  /* Prefer article body children so we do not observe unrelated <section> trees. */
  let paragraphs = [
    ...document.querySelectorAll(
      ".docs-main section.body > *, section.body > *, .body > *, main article section > *",
    ),
  ];
  if (!paragraphs.length) {
    paragraphs = [...document.querySelectorAll("section > *")];
  }

  /*
   * Prefer the sticky rail TOC. Fall back to inline / legacy.
   * Never prefer a hidden duplicate ahead of the visible rail.
   */
  let submenu = [...document.querySelectorAll(".docs-toc-rail .toc a")];
  if (!submenu.length) {
    submenu = [
      ...document.querySelectorAll(
        ".docs-toc-inline .toc a, .right-content .toc a, aside .toc a",
      ),
    ];
  }
  if (!submenu.length) {
    submenu = [...document.querySelectorAll(".toc a")];
  }

  if (paragraphs.length === 0 || submenu.length === 0) return;

  function previousHeaderId(e) {
    for (; e && !e.matches("h1, h2, h3, h4"); ) e = e.previousElementSibling;
    return e?.id;
  }

  let paragraphMenuMap = paragraphs.reduce((map, node) => {
    let id = previousHeaderId(node);
    if ((node.previousHeader = id) && id) {
      let link = submenu.find((a) => decodeURIComponent(a.hash) === "#" + id);
      map[id] = link;
    }
    return map;
  }, {});

  /*
   * Keep the active TOC row visible inside the sticky rail only.
   * - Element.closest() must use a compound selector (no descendant combinator)
   *   or Safari throws and the IntersectionObserver callback aborts.
   * - Never call scrollIntoView — that scrolls the window (jump-to-top on iOS).
   * - Skip entirely on touch / coarse pointers; rail auto-scroll fights rubber-banding.
   */
  const allowRailAutoscroll =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function ensureTocLinkVisible(link) {
    if (!allowRailAutoscroll || !link) return;
    const toc = link.closest(".toc");
    if (!toc || !toc.closest(".docs-toc-rail")) return;
    const overflowY = getComputedStyle(toc).overflowY;
    if (overflowY !== "auto" && overflowY !== "scroll") return;

    const scrollerBox = toc.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    if (linkBox.top < scrollerBox.top) {
      toc.scrollTop -= scrollerBox.top - linkBox.top + 8;
    } else if (linkBox.bottom > scrollerBox.bottom) {
      toc.scrollTop += linkBox.bottom - scrollerBox.bottom + 8;
    }
  }

  function clearActive() {
    submenu.forEach((a) => {
      const li = a.closest("li");
      if (!li) return;
      li.classList.remove("selected", "parent");
    });
  }

  let selection;
  function handler(entries) {
    selection = (selection || entries).map(
      (prev) => entries.find((e) => e.target === prev.target) || prev,
    );
    for (const s of selection) {
      if (!s.isIntersecting) {
        paragraphMenuMap[s.target.previousHeader]?.parentElement?.classList.remove(
          "selected",
          "parent",
        );
      }
    }
    for (const s of selection) {
      if (!s.isIntersecting) continue;
      let li = paragraphMenuMap[s.target.previousHeader]?.closest("li");
      if (!li) continue;
      li.classList.add("selected");
      ensureTocLinkVisible(li.querySelector("a"));
      while (li) {
        li.classList.add("parent");
        li = li.parentElement && li.parentElement.closest("li");
      }
    }
  }

  let observer = new IntersectionObserver(handler, {
    /* Slight bottom bias so the last section stays selected near page end
       without thrashing as the iOS chrome expands/collapses. */
    rootMargin: "0px 0px -25% 0px",
    threshold: [0, 0.1],
  });
  window._tocObserver = observer;
  /* Clear stale classes from a previous SPA page before observing. */
  clearActive();
  paragraphs.forEach((node) => observer.observe(node));
};

document.addEventListener("DOMContentLoaded", window.initTOC);
