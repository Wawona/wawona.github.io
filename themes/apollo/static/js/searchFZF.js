/**
 * FZF Search Implementation for Wawona
 * Uses fzf.js for fuzzy matching with content awareness and highlighting.
 */

window.onload = function () {
    const searchModal = document.getElementById('searchModal');
    if (!searchModal) return;

    const lang = document.documentElement.lang || 'en';
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('search-button');
    const clearSearchButton = document.getElementById('clear-search');
    const resultsContainer = document.getElementById('results-container');
    const results = document.getElementById('results');

    const resultSpans = {
        zero_results: document.getElementById('zero_results'),
        one_results: document.getElementById('one_results'),
        many_results: document.getElementById('many_results'),
    };

    let searchIndexPromise = null;
    let fzfInstance = null;
    let allDocuments = [];

    function getShortcut() {
        return window.navigator.userAgent.toLowerCase().includes('mac') ? 'Cmd + K' : 'Ctrl + K';
    }

    // Set accessibility attributes
    if (searchButton) {
        const shortcut = getShortcut();
        ['title', 'aria-label'].forEach(attr => {
            let val = searchButton.getAttribute(attr);
            if (val) searchButton.setAttribute(attr, val.replace('$SHORTCUT', shortcut));
        });
    }

    function loadSearchIndex() {
        if (searchIndexPromise) return searchIndexPromise;

        searchIndexPromise = new Promise((resolve) => {
            const checkIndex = () => {
                if (window.searchIndex) {
                    allDocuments = Object.keys(window.searchIndex.documentStore.docs).map(id => {
                        const doc = window.searchIndex.documentStore.docs[id];
                        let normalizedId = id;
                        try {
                            const url = new URL(id, window.location.origin);
                            normalizedId = url.pathname + url.search + url.hash;
                        } catch (e) { }

                        return {
                            id: normalizedId,
                            title: doc.title || '',
                            description: doc.description || '',
                            body: (doc.body || '').replace(/\s+/g, ' ').trim(),
                            path: doc.path || id
                        };
                    });

                    // FZF configuration: prioritize Title by repeating it in the search string
                    fzfInstance = new fzf.Fzf(allDocuments, {
                        selector: (d) => `${d.title} ${d.title} ${d.title} ${d.description} ${d.path} ${d.body}`
                    });
                    resolve();
                } else {
                    setTimeout(checkIndex, 50);
                }
            };
            checkIndex();
        });
        return searchIndexPromise;
    }

    async function performSearch() {
        const query = searchInput.value.trim();
        await loadSearchIndex();

        results.innerHTML = '';
        const hasInput = searchInput.value.length > 0;
        clearSearchButton.style.display = hasInput ? 'block' : 'none';
        resultsContainer.style.display = query.length > 0 ? 'block' : 'none';

        if (query.length === 0) {
            updateResultText(0);
            return;
        }

        const fzfResults = fzfInstance.find(query);
        updateResultText(fzfResults.length);

        if (fzfResults.length === 0) return;

        // Render all results to ensure count matches UI
        fzfResults.forEach((result, idx) => {
            const doc = result.item;
            const div = document.createElement('div');
            div.setAttribute('role', 'option');
            div.id = 'result-' + idx;

            const highlightedTitle = highlightText(doc.title || doc.path, query);
            const snippet = doc.body ? generateSnippet(doc.body, query) : highlightText(doc.description || '', query);

            // Add highlighting query param for the on-page highlighter
            const finalUrl = doc.id + (doc.id.includes('?') ? '&' : '?') + `h=${encodeURIComponent(query)}`;

            div.innerHTML = `
                <a href="${finalUrl}" data-search-query="${query}">
                    <span style="display: block; font-weight: 600; margin-bottom: 0.2rem; color: var(--text-0);">${highlightedTitle}</span>
                    <span style="display: block; font-size: 0.85rem; opacity: 0.7; line-height: 1.4; color: var(--text-1);">${snippet}</span>
                </a>
            `;

            div.addEventListener('mouseover', () => updateSelection(div));
            div.addEventListener('click', (e) => {
                // If it's a normal click, let the SPA handle it but ensure we pass the query
                // The SPA router in base.html handles the click.
                // We just need to make sure the modal closes.
                if (!e.ctrlKey && !e.metaKey) {
                    // Modal will be closed by the SPA router's effect or manually here
                    setTimeout(closeModal, 100);
                }
            });
            results.appendChild(div);
        });

        if (results.firstChild) updateSelection(results.firstChild);
    }

    function highlightText(text, query) {
        if (!text) return '';
        let highlighted = text;
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        words.forEach(word => {
            if (word.length > 1) {
                const re = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                highlighted = highlighted.replace(re, '<b style="color: var(--primary-color);">$1</b>');
            }
        });
        return highlighted;
    }

    function generateSnippet(text, query) {
        if (!text) return '';
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return text.slice(0, 150);

        const firstWord = words[0];
        const index = text.toLowerCase().indexOf(firstWord);

        const start = Math.max(0, index - 60);
        const end = Math.min(text.length, index + 100);
        let snippet = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');

        return highlightText(snippet, query);
    }

    function updateSelection(div) {
        results.querySelectorAll('div[role="option"]').forEach(d => d.setAttribute('aria-selected', 'false'));
        div.setAttribute('aria-selected', 'true');
        searchInput.setAttribute('aria-activedescendant', div.id);
    }

    function updateResultText(count) {
        Object.values(resultSpans).forEach(span => { if (span) span.style.display = 'none'; });
        const key = count === 0 ? 'zero_results' : (count === 1 ? 'one_results' : 'many_results');
        const activeSpan = resultSpans[key];
        if (activeSpan) {
            if (!activeSpan.dataset.template) activeSpan.dataset.template = activeSpan.textContent;
            activeSpan.textContent = activeSpan.dataset.template.replace('$NUMBER', count);
            activeSpan.style.display = 'inline';
        }
    }

    function closeModal() {
        searchModal.style.display = 'none';
        searchInput.value = '';
        results.innerHTML = '';
        resultsContainer.style.display = 'none';
    }

    function openSearchModal() {
        searchModal.style.display = 'block';
        searchInput.focus();
        loadSearchIndex();
    }

    function toggleModal() {
        if (searchModal.style.display === 'block') closeModal();
        else openSearchModal();
    }

    // Input handlers
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('focus', performSearch);

    if (searchButton) {
        searchButton.addEventListener('click', openSearchModal);
        searchButton.addEventListener('mouseover', loadSearchIndex);
    }

    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', () => {
            searchInput.value = '';
            performSearch();
            searchInput.focus();
        });
    }

    searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeModal(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();

        const isMac = navigator.userAgent.toLowerCase().includes('mac');
        if (e.key === 'k' && (isMac ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            toggleModal();
        }

        if (searchModal.style.display === 'block') {
            const divs = Array.from(results.querySelectorAll('div[role="option"]'));
            const activeDiv = results.querySelector('[aria-selected="true"]');
            let activeIdx = divs.indexOf(activeDiv);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (activeIdx < divs.length - 1) updateSelection(divs[activeIdx + 1]);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (activeIdx > 0) updateSelection(divs[activeIdx - 1]);
            } else if (e.key === 'Enter' && activeDiv) {
                activeDiv.querySelector('a').click();
            }
        }
    });
};
