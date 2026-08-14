/**
 * Catalog typeahead → non-editable pills (recognized names only).
 * Used for devices and OS versions. Commas separate chips; free text
 * becomes Other: … after an explicit comma.
 */
(function (global) {
    var DEVICE_CATALOG_URL = "/data/device-catalog.json";
    var OS_CATALOG_URL = "/data/os-catalog.json";
    var MAX_SUGGESTIONS = 8;
    var AUTO_CANONICAL_SCORE = 0.72;
    var OTHER_LABEL_MAX = 120;
    var catalogs = Object.create(null);

    function getCatalog(url) {
        var key = url || DEVICE_CATALOG_URL;
        if (!catalogs[key]) {
            catalogs[key] = { names: [], promise: null };
        }
        return catalogs[key];
    }

    function loadCatalog(url) {
        var cat = getCatalog(url);
        if (cat.promise) return cat.promise;
        cat.promise = fetch(url || DEVICE_CATALOG_URL, { credentials: "omit" })
            .then(function (res) {
                if (!res.ok) throw new Error("catalog " + res.status);
                return res.json();
            })
            .then(function (rows) {
                cat.names = [];
                cat.aliasToName = Object.create(null);
                cat.aliasTexts = [];
                (rows || []).forEach(function (row) {
                    var name = (row && row.name) || "";
                    if (!name) return;
                    cat.names.push(name);
                    var aliases = (row && row.aliases) || [];
                    for (var i = 0; i < aliases.length; i++) {
                        var alias = String(aliases[i] || "").trim();
                        if (!alias) continue;
                        cat.aliasToName[normalizeKey(alias)] = name;
                        cat.aliasTexts.push({ text: alias, name: name });
                    }
                });
                return cat.names;
            })
            .catch(function () {
                cat.names = [];
                return cat.names;
            });
        return cat.promise;
    }

    function normalizeKey(s) {
        return String(s || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, " ");
    }

    function expandQuery(query) {
        var q = normalizeKey(query);
        q = q
            .replace(/\bmba\b/g, "macbook air")
            .replace(/\bmbp\b/g, "macbook pro")
            .replace(/\bipadpro\b/g, "ipad pro")
            .replace(/\biphone\b/g, "iphone")
            .replace(/\bpixel\b/g, "pixel")
            .replace(/\bframework\b/g, "framework laptop")
            .replace(/\bmacos\b/g, "macos")
            .replace(/\bios\b/g, "ios")
            .replace(/\bubu\b/g, "ubuntu")
            .replace(/\bnixos\b/g, "nixos");
        return q.replace(/\s+/g, " ").trim();
    }

    function scoreMatch(query, candidate) {
        var q = expandQuery(query);
        var c = normalizeKey(candidate);
        if (!q || !c) return 0;
        if (c === q) return 1;
        if (c.indexOf(q) === 0) return 0.92;
        if (c.indexOf(q) !== -1) return 0.82;
        var qCompact = q.replace(/\s+/g, "");
        var cCompact = c.replace(/\s+/g, "");
        if (cCompact.indexOf(qCompact) !== -1) return 0.8;
        var qParts = q.split(" ");
        var cParts = c.split(" ");
        var hit = 0;
        for (var i = 0; i < qParts.length; i++) {
            var part = qParts[i];
            if (!part) continue;
            var found = false;
            for (var j = 0; j < cParts.length; j++) {
                if (cParts[j].indexOf(part) === 0 || cParts[j] === part) {
                    found = true;
                    break;
                }
            }
            if (found) hit++;
            else return 0;
        }
        return 0.55 + (0.25 * hit) / Math.max(qParts.length, 1);
    }

    function suggest(query, limit, url) {
        var cat = getCatalog(url);
        var names = cat.names;
        var q = String(query || "").trim();
        if (q.length < 1) return [];
        var best = Object.create(null);
        function consider(matchText, canonical) {
            var s = scoreMatch(q, matchText);
            if (s < 0.55) return;
            if (!best[canonical] || s > best[canonical]) best[canonical] = s;
        }
        for (var i = 0; i < names.length; i++) consider(names[i], names[i]);
        var aliasTexts = cat.aliasTexts || [];
        for (var j = 0; j < aliasTexts.length; j++) {
            consider(aliasTexts[j].text, aliasTexts[j].name);
        }
        var scored = [];
        for (var name in best) {
            if (Object.prototype.hasOwnProperty.call(best, name)) {
                scored.push({ name: name, score: best[name] });
            }
        }
        scored.sort(function (a, b) {
            if (b.score !== a.score) return b.score - a.score;
            return a.name.length - b.name.length || a.name.localeCompare(b.name);
        });
        return scored.slice(0, limit || MAX_SUGGESTIONS);
    }

    function stripCommas(s) {
        return String(s || "").replace(/,/g, "");
    }

    function stripOtherPrefix(s) {
        return String(s || "").replace(/^other:\s*/i, "").trim();
    }

    function sanitizeOtherLabel(value) {
        var text = String(value == null ? "" : value);
        if (global.DOMPurify && typeof DOMPurify.sanitize === "function") {
            text = DOMPurify.sanitize(text, {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
                KEEP_CONTENT: true
            });
        }
        text = text
            .replace(/[\u0000-\u001F\u007F]/g, "")
            .replace(/,/g, "")
            .replace(/\s+/g, " ")
            .trim();
        if (text.length > OTHER_LABEL_MAX) text = text.slice(0, OTHER_LABEL_MAX);
        return text;
    }

    function recognizedName(token, url) {
        var raw = sanitizeOtherLabel(stripOtherPrefix(stripCommas(token)));
        if (!raw) return "";
        var cat = getCatalog(url);
        var names = cat.names;
        var aliasToName = cat.aliasToName || Object.create(null);
        var key = normalizeKey(raw);
        if (aliasToName[key]) return aliasToName[key];
        for (var i = 0; i < names.length; i++) {
            if (normalizeKey(names[i]) === key) return names[i];
        }
        var top = suggest(raw, 1, url)[0];
        if (top && top.score >= AUTO_CANONICAL_SCORE) return top.name;
        return "";
    }

    function toStored(token, url) {
        var raw = stripCommas(token).trim();
        if (!raw) return "";
        if (/^other:\s*/i.test(raw)) {
            var custom = sanitizeOtherLabel(stripOtherPrefix(raw));
            return custom ? ("Other: " + custom) : "";
        }
        var canon = recognizedName(raw, url);
        if (canon) return canon;
        var other = sanitizeOtherLabel(raw);
        return other ? ("Other: " + other) : "";
    }

    function isOtherEntry(token) {
        return /^other:\s*/i.test(String(token || "").trim());
    }

    function partitionForSurvey(list) {
        var items = [];
        var others = [];
        (list || []).forEach(function (entry) {
            var raw = String(entry || "").trim();
            if (!raw) return;
            if (isOtherEntry(raw)) {
                items.push("Other");
                var custom = sanitizeOtherLabel(stripOtherPrefix(raw));
                if (custom) others.push(custom);
            } else {
                items.push(raw);
            }
        });
        return { items: items, others: others, devices: items, devices_other: others };
    }

    function normalizeField(value, url) {
        return String(value || "")
            .split(",")
            .map(function (part) { return toStored(part, url); })
            .filter(Boolean);
    }

    function bindCatalogSuggest(input, options) {
        options = options || {};
        var catalogUrl = options.catalogUrl || DEVICE_CATALOG_URL;
        var boundFlag = options.boundFlag || "catalogSuggestBound";
        if (!input || input.dataset[boundFlag] === "1") return;
        input.dataset[boundFlag] = "1";

        var selected = [];
        var wrap = document.createElement("div");
        wrap.className = "dl-device-suggest";
        input.parentNode.insertBefore(wrap, input);

        var chips = document.createElement("div");
        chips.className = "dl-device-chips";
        chips.setAttribute("role", "group");
        chips.setAttribute("aria-label", options.groupLabel || "Selected items");

        var draft = document.createElement("input");
        draft.type = "text";
        draft.className = "dl-device-draft";
        draft.id = input.id ? input.id + "-draft" : "dl-catalog-draft";
        draft.setAttribute("autocomplete", "off");
        draft.setAttribute("spellcheck", "false");
        draft.setAttribute("aria-autocomplete", "list");
        draft.setAttribute("aria-label", options.draftLabel || "Add an item");
        draft.placeholder = input.placeholder || "Start typing…";

        input.type = "hidden";
        input.removeAttribute("placeholder");
        wrap.appendChild(chips);
        chips.appendChild(draft);
        wrap.appendChild(input);

        if (input.id) {
            var label = document.querySelector('label[for="' + input.id + '"]');
            if (label) label.setAttribute("for", draft.id);
        }

        var list = document.createElement("ul");
        list.className = "dl-device-suggest-list";
        list.hidden = true;
        list.setAttribute("role", "listbox");
        wrap.appendChild(list);

        var activeIndex = -1;
        var current = [];
        var optPrefix = (input.id || "dl-catalog") + "-opt-";

        function syncHidden() {
            input.value = selected.join(", ");
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
        }

        function getSelected() {
            return selected.slice();
        }

        function hide() {
            list.hidden = true;
            list.innerHTML = "";
            activeIndex = -1;
            current = [];
            draft.removeAttribute("aria-activedescendant");
        }

        function renderSuggestions(items) {
            current = items;
            activeIndex = items.length ? 0 : -1;
            list.innerHTML = "";
            if (!items.length) {
                hide();
                return;
            }
            items.forEach(function (item, index) {
                var li = document.createElement("li");
                li.id = optPrefix + index;
                li.className = "dl-device-suggest-item" + (index === 0 ? " is-active" : "");
                li.setAttribute("role", "option");
                li.textContent = item.name;
                li.addEventListener("mousedown", function (event) {
                    event.preventDefault();
                    addItem(item.name);
                });
                list.appendChild(li);
            });
            list.hidden = false;
            if (activeIndex >= 0) {
                draft.setAttribute("aria-activedescendant", optPrefix + activeIndex);
            }
        }

        function setActive(index) {
            var items = list.querySelectorAll(".dl-device-suggest-item");
            if (!items.length) return;
            activeIndex = (index + items.length) % items.length;
            for (var i = 0; i < items.length; i++) {
                items[i].classList.toggle("is-active", i === activeIndex);
            }
            draft.setAttribute("aria-activedescendant", optPrefix + activeIndex);
        }

        function renderChips() {
            chips.querySelectorAll(".dl-device-chip").forEach(function (node) {
                node.parentNode.removeChild(node);
            });
            selected.forEach(function (store) {
                var isOther = /^other:\s*/i.test(store);
                var display = isOther ? stripOtherPrefix(store) : store;
                var chip = document.createElement("span");
                chip.className = "dl-device-chip" + (isOther ? " is-other" : "");
                chip.dataset.device = store;

                var labelEl = document.createElement("span");
                labelEl.className = "dl-device-chip-label";
                labelEl.textContent = isOther ? ("Other: " + display) : display;
                chip.appendChild(labelEl);

                var remove = document.createElement("button");
                remove.type = "button";
                remove.className = "dl-device-chip-remove";
                remove.setAttribute("aria-label", "Remove " + display);
                remove.textContent = "×";
                remove.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var target = chip.dataset.device;
                    selected = selected.filter(function (name) { return name !== target; });
                    renderChips();
                    syncHidden();
                    draft.focus();
                });
                chip.appendChild(remove);
                chips.insertBefore(chip, draft);
            });
        }

        function addItem(name, asOther) {
            var store = asOther
                ? toStored("Other: " + sanitizeOtherLabel(stripOtherPrefix(stripCommas(name))), catalogUrl)
                : (recognizedName(name, catalogUrl) || "");
            if (!store) return false;
            var key = normalizeKey(store);
            for (var i = 0; i < selected.length; i++) {
                if (normalizeKey(selected[i]) === key) {
                    draft.value = "";
                    hide();
                    return true;
                }
            }
            selected.push(store);
            draft.value = "";
            renderChips();
            syncHidden();
            hide();
            draft.focus();
            return true;
        }

        function tryCommitDraft(opts) {
            opts = opts || {};
            var raw = stripCommas(draft.value).trim();
            if (!raw) return false;
            var canon = recognizedName(raw, catalogUrl);
            if (canon) return addItem(canon, false);
            if (opts.allowOther) return addItem(raw, true);
            return false;
        }

        function refresh() {
            var q = stripCommas(draft.value).trim();
            if (!q) {
                hide();
                return;
            }
            var items = suggest(q, MAX_SUGGESTIONS, catalogUrl).filter(function (item) {
                var key = normalizeKey(item.name);
                for (var i = 0; i < selected.length; i++) {
                    if (normalizeKey(selected[i]) === key) return false;
                }
                return true;
            });
            renderSuggestions(items);
        }

        function seedFromValue(value) {
            selected = [];
            String(value || "").split(",").forEach(function (part) {
                var store = toStored(part, catalogUrl);
                if (!store) return;
                var key = normalizeKey(store);
                var dup = selected.some(function (s) { return normalizeKey(s) === key; });
                if (!dup) selected.push(store);
            });
            draft.value = "";
            renderChips();
            syncHidden();
        }

        chips.addEventListener("click", function (event) {
            if (event.target === chips || event.target === draft) draft.focus();
        });

        draft.addEventListener("input", function () {
            var cleaned = stripCommas(draft.value);
            if (cleaned !== draft.value) draft.value = cleaned;
            refresh();
        });

        draft.addEventListener("paste", function (event) {
            event.preventDefault();
            var text = stripCommas((event.clipboardData || window.clipboardData).getData("text") || "");
            var start = draft.selectionStart || 0;
            var end = draft.selectionEnd || 0;
            draft.value = draft.value.slice(0, start) + text + draft.value.slice(end);
            var pos = start + text.length;
            draft.setSelectionRange(pos, pos);
            refresh();
        });

        draft.addEventListener("keydown", function (event) {
            if (event.key === ",") {
                event.preventDefault();
                if (!tryCommitDraft({ allowOther: true }) && activeIndex >= 0 && current[activeIndex]) {
                    addItem(current[activeIndex].name, false);
                }
                return;
            }
            if (event.key === "Backspace" && !draft.value && selected.length) {
                event.preventDefault();
                selected.pop();
                renderChips();
                syncHidden();
                return;
            }
            if (list.hidden || !current.length) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    tryCommitDraft();
                }
                return;
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive(activeIndex + 1);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive(activeIndex - 1);
            } else if (event.key === "Enter" || event.key === "Tab") {
                if (activeIndex >= 0 && current[activeIndex]) {
                    event.preventDefault();
                    addItem(current[activeIndex].name, false);
                } else if (event.key === "Enter") {
                    event.preventDefault();
                    tryCommitDraft();
                }
            } else if (event.key === "Escape") {
                hide();
            }
        });

        draft.addEventListener("blur", function () {
            setTimeout(function () {
                tryCommitDraft();
                draft.value = "";
                hide();
            }, 120);
        });

        loadCatalog(catalogUrl).then(function () {
            seedFromValue(input.value);
            draft.addEventListener("click", refresh);
            draft.addEventListener("keyup", function (event) {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") return;
                if (event.key === "Escape" || event.key === "Enter" || event.key === ",") return;
                refresh();
            });
        });

        input._deviceSuggestGet = getSelected;
        input._deviceSuggestAdd = addItem;
    }

    function getSelectedFromInput(input, url) {
        if (input && typeof input._deviceSuggestGet === "function") {
            return input._deviceSuggestGet();
        }
        return normalizeField(input && input.value, url);
    }

    function makeApi(catalogUrl, labels) {
        return {
            loadCatalog: function () { return loadCatalog(catalogUrl); },
            suggest: function (q, limit) { return suggest(q, limit, catalogUrl); },
            normalizeDeviceField: function (v) { return normalizeField(v, catalogUrl); },
            normalizeField: function (v) { return normalizeField(v, catalogUrl); },
            recognizedDevice: function (t) { return recognizedName(t, catalogUrl); },
            isOtherDevice: isOtherEntry,
            partitionForSurvey: partitionForSurvey,
            sanitizeOtherDeviceLabel: sanitizeOtherLabel,
            getDevices: function (input) { return getSelectedFromInput(input, catalogUrl); },
            bind: function (input) {
                return bindCatalogSuggest(input, {
                    catalogUrl: catalogUrl,
                    boundFlag: catalogUrl === OS_CATALOG_URL ? "osSuggestBound" : "deviceSuggestBound",
                    groupLabel: labels.groupLabel,
                    draftLabel: labels.draftLabel
                });
            }
        };
    }

    global.WawonaDeviceSuggest = makeApi(DEVICE_CATALOG_URL, {
        groupLabel: "Selected devices",
        draftLabel: "Add a device"
    });
    global.WawonaOsSuggest = makeApi(OS_CATALOG_URL, {
        groupLabel: "Selected OS versions",
        draftLabel: "Add an OS version"
    });
})(window);
