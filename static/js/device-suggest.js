/**
 * Device typeahead → non-editable pills (recognized catalog names only).
 * Commas are separators after pills, never part of a device name.
 */
(function (global) {
    var CATALOG_URL = "/data/device-catalog.json";
    var MAX_SUGGESTIONS = 8;
    var AUTO_CANONICAL_SCORE = 0.72;

    var catalogPromise = null;
    var names = [];

    function loadCatalog() {
        if (catalogPromise) return catalogPromise;
        catalogPromise = fetch(CATALOG_URL, { credentials: "omit" })
            .then(function (res) {
                if (!res.ok) throw new Error("catalog " + res.status);
                return res.json();
            })
            .then(function (rows) {
                names = (rows || [])
                    .map(function (row) { return (row && row.name) || ""; })
                    .filter(Boolean);
                return names;
            })
            .catch(function () {
                names = [];
                return names;
            });
        return catalogPromise;
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
            .replace(/\bframework\b/g, "framework laptop");
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

    function suggest(query, limit) {
        var q = String(query || "").trim();
        if (q.length < 1) return [];
        var scored = [];
        for (var i = 0; i < names.length; i++) {
            var s = scoreMatch(q, names[i]);
            if (s >= 0.55) scored.push({ name: names[i], score: s });
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

    var OTHER_DEVICE_MAX = 120;

    /**
     * Sanitize unrecognized device free text with DOMPurify (text-only).
     * Server re-sanitizes with sanitize-html + validator; this is defense in depth.
     */
    function sanitizeOtherDeviceLabel(value) {
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
        if (text.length > OTHER_DEVICE_MAX) text = text.slice(0, OTHER_DEVICE_MAX);
        return text;
    }

    /** Recognized catalog name only; empty if not recognized. */
    function recognizedDevice(token) {
        var raw = sanitizeOtherDeviceLabel(stripOtherPrefix(stripCommas(token)));
        if (!raw) return "";
        var key = normalizeKey(raw);
        for (var i = 0; i < names.length; i++) {
            if (normalizeKey(names[i]) === key) return names[i];
        }
        var top = suggest(raw, 1)[0];
        if (top && top.score >= AUTO_CANONICAL_SCORE) return top.name;
        return "";
    }

    function toStoredDevice(token) {
        var raw = stripCommas(token).trim();
        if (!raw) return "";
        if (/^other:\s*/i.test(raw)) {
            var custom = sanitizeOtherDeviceLabel(stripOtherPrefix(raw));
            return custom ? ("Other: " + custom) : "";
        }
        var canon = recognizedDevice(raw);
        if (canon) return canon;
        var other = sanitizeOtherDeviceLabel(raw);
        return other ? ("Other: " + other) : "";
    }

    function isOtherDevice(token) {
        return /^other:\s*/i.test(String(token || "").trim());
    }

    /**
     * Split stored chips into graph buckets + free-text labels.
     * Unrecognized devices count as "Other" in aggregates; custom text
     * stays in devices_other for later review.
     */
    function partitionForSurvey(list) {
        var devices = [];
        var devices_other = [];
        (list || []).forEach(function (entry) {
            var raw = String(entry || "").trim();
            if (!raw) return;
            if (isOtherDevice(raw)) {
                devices.push("Other");
                var custom = sanitizeOtherDeviceLabel(stripOtherPrefix(raw));
                if (custom) devices_other.push(custom);
            } else {
                devices.push(raw);
            }
        });
        return { devices: devices, devices_other: devices_other };
    }

    function normalizeDeviceField(value) {
        return String(value || "")
            .split(",")
            .map(toStoredDevice)
            .filter(Boolean);
    }

    function bindDeviceSuggest(input) {
        if (!input || input.dataset.deviceSuggestBound === "1") return;
        input.dataset.deviceSuggestBound = "1";

        var selected = [];
        var wrap = document.createElement("div");
        wrap.className = "dl-device-suggest";
        input.parentNode.insertBefore(wrap, input);

        var chips = document.createElement("div");
        chips.className = "dl-device-chips";
        chips.setAttribute("role", "group");
        chips.setAttribute("aria-label", "Selected devices");

        var draft = document.createElement("input");
        draft.type = "text";
        draft.className = "dl-device-draft";
        draft.id = input.id ? input.id + "-draft" : "dl-device-draft";
        draft.setAttribute("autocomplete", "off");
        draft.setAttribute("spellcheck", "false");
        draft.setAttribute("aria-autocomplete", "list");
        draft.setAttribute("aria-label", "Add a device");
        draft.placeholder = input.placeholder || "Start typing a device…";

        /* Keep original field as the serialized value for forms / dirty checks. */
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

        function syncHidden() {
            input.value = selected.join(", ");
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
        }

        function getDevices() {
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
                li.id = "dl-device-opt-" + index;
                li.className = "dl-device-suggest-item" + (index === 0 ? " is-active" : "");
                li.setAttribute("role", "option");
                li.textContent = item.name;
                li.addEventListener("mousedown", function (event) {
                    event.preventDefault();
                    addDevice(item.name);
                });
                list.appendChild(li);
            });
            list.hidden = false;
            if (activeIndex >= 0) {
                draft.setAttribute("aria-activedescendant", "dl-device-opt-" + activeIndex);
            }
        }

        function setActive(index) {
            var items = list.querySelectorAll(".dl-device-suggest-item");
            if (!items.length) return;
            activeIndex = (index + items.length) % items.length;
            for (var i = 0; i < items.length; i++) {
                items[i].classList.toggle("is-active", i === activeIndex);
            }
            draft.setAttribute("aria-activedescendant", "dl-device-opt-" + activeIndex);
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

        function addDevice(name, asOther) {
            var store = asOther
                ? toStoredDevice("Other: " + sanitizeOtherDeviceLabel(stripOtherPrefix(stripCommas(name))))
                : (recognizedDevice(name) || "");
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
            var canon = recognizedDevice(raw);
            if (canon) return addDevice(canon, false);
            if (opts.allowOther) return addDevice(raw, true);
            return false;
        }

        function refresh() {
            var q = stripCommas(draft.value).trim();
            if (!q) {
                hide();
                return;
            }
            var items = suggest(q, MAX_SUGGESTIONS).filter(function (item) {
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
                var store = toStoredDevice(part);
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
                    addDevice(current[activeIndex].name, false);
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
                    /* Recognized only. Unrecognized needs an explicit comma → Other. */
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
                    addDevice(current[activeIndex].name, false);
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
                /* Drop leftover freeform unless it was committed as Other via comma. */
                draft.value = "";
                hide();
            }, 120);
        });

        loadCatalog().then(function () {
            seedFromValue(input.value);
            draft.addEventListener("click", refresh);
            draft.addEventListener("keyup", function (event) {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") return;
                if (event.key === "Escape" || event.key === "Enter" || event.key === ",") return;
                refresh();
            });
        });

        input._deviceSuggestGet = getDevices;
        input._deviceSuggestAdd = addDevice;
    }

    function getDevicesFromInput(input) {
        if (input && typeof input._deviceSuggestGet === "function") {
            return input._deviceSuggestGet();
        }
        return normalizeDeviceField(input && input.value);
    }

    global.WawonaDeviceSuggest = {
        loadCatalog: loadCatalog,
        suggest: suggest,
        normalizeDeviceField: normalizeDeviceField,
        recognizedDevice: recognizedDevice,
        isOtherDevice: isOtherDevice,
        partitionForSurvey: partitionForSurvey,
        sanitizeOtherDeviceLabel: sanitizeOtherDeviceLabel,
        getDevices: getDevicesFromInput,
        bind: bindDeviceSuggest
    };
})(window);
