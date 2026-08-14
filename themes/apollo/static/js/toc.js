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
   * Prefer the sticky rail TOC (overflow-y: auto). Fall back to inline / legacy.
   * Never prefer a hidden duplicate ahead of the visible rail — that used to make
   * scrollIntoView yank the window back to the top of the page while scrolling.
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

  /**
   * Keep the active TOC row visible inside a scrollable rail only.
   * Never call Element.scrollIntoView — that scrolls the window and jumps
   * the docs page back to the top when the inline TOC is above the viewport.
   */
  function ensureTocLinkVisible(link) {
    if (!link) return;
    const scroller = link.closest(".docs-toc-rail .toc, .toc");
    if (!scroller) return;
    const overflowY = getComputedStyle(scroller).overflowY;
    if (overflowY !== "auto" && overflowY !== "scroll") return;

    const scrollerBox = scroller.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    if (linkBox.top < scrollerBox.top) {
      scroller.scrollTop -= scrollerBox.top - linkBox.top + 8;
    } else if (linkBox.bottom > scrollerBox.bottom) {
      scroller.scrollTop += linkBox.bottom - scrollerBox.bottom + 8;
    }
  }

  let selection;
  function handler(entries) {
    selection = (selection || entries).map(
      (prev) => entries.find((e) => e.target === prev.target) || prev,
    );
    for (const s of selection) {
      if (!s.isIntersecting) {
        paragraphMenuMap[s.target.previousHeader]?.parentElement.classList.remove(
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
    threshold: [0],
  });
  window._tocObserver = observer;
  paragraphs.forEach((node) => observer.observe(node));
};

document.addEventListener("DOMContentLoaded", window.initTOC);
