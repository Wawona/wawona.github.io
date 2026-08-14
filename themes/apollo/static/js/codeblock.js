const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

const changeIcon = (button, isSuccess) => {
    button.innerHTML = isSuccess ? successIcon : errorIcon;
    setTimeout(() => {
        button.innerHTML = copyIcon;
    }, 2000);
};

const getCodeFromTable = (codeBlock) => {
    return [...codeBlock.querySelectorAll('tr')]
        .map(row => row.querySelector('td:last-child')?.innerText ?? '')
        .join('');
};

const getNonTableCode = (codeBlock) => {
    return codeBlock.textContent.trim();
};

const isMermaid = (pre, codeBlock) => {
    const haystack = `${codeBlock.className} ${pre.className}`.toLowerCase();
    const dataLang = (pre.getAttribute('data-lang') || codeBlock.getAttribute('data-lang') || '').toLowerCase();
    return haystack.includes('language-mermaid') || dataLang === 'mermaid' || pre.classList.contains('mermaid');
};

const wrapPre = (pre) => {
    if (pre.parentElement && pre.parentElement.classList.contains('code-block')) {
        return pre.parentElement;
    }
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    return wrap;
};

window.initCodeBlocks = function () {
    document.querySelectorAll('pre code').forEach(codeBlock => {
        const pre = codeBlock.closest('pre') || codeBlock.parentNode;
        if (!pre || isMermaid(pre, codeBlock)) return;

        const wrap = wrapPre(pre);
        if (wrap.querySelector('.clipboard-button')) return;

        const body = document.createElement('div');
        body.className = 'code-block-body';
        wrap.appendChild(body);
        body.appendChild(pre);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'clipboard-button';
        copyBtn.innerHTML = copyIcon;
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
        copyBtn.type = 'button';
        body.appendChild(copyBtn);

        copyBtn.addEventListener('click', async () => {
            const isTable = codeBlock.querySelector('table');
            const codeToCopy = isTable ? getCodeFromTable(codeBlock) : getNonTableCode(codeBlock);
            try {
                await navigator.clipboard.writeText(codeToCopy);
                changeIcon(copyBtn, true);
            } catch (error) {
                console.error('Failed to copy text: ', error);
                changeIcon(copyBtn, false);
            }
        });

        const getLang = () => {
            const classMatch = (codeBlock.className + " " + pre.className).match(/(?:language-|lang-)([\w-]+)/);
            if (classMatch) return classMatch[1].toLowerCase();

            const dataLang = pre.getAttribute('data-lang') || codeBlock.getAttribute('data-lang');
            if (dataLang) return dataLang.toLowerCase();

            const commonLangs = ['bash', 'js', 'javascript', 'yaml', 'json', 'python', 'rust', 'go', 'html', 'css', 'shell', 'zsh', 'sh', 'console'];
            const classes = (codeBlock.className + " " + pre.className).toLowerCase().split(/\s+/);
            for (const l of commonLangs) {
                if (classes.includes(l)) return l;
            }

            return 'default';
        };

        let lang = getLang();
        if (['sh', 'shell', 'zsh', 'console', 'shellscript', 'shell-script'].includes(lang)) {
            lang = 'bash';
        }

        const label = document.createElement('span');
        label.className = 'code-label label-' + lang;
        label.textContent = lang.toUpperCase();
        wrap.insertBefore(label, body);
    });
};

document.addEventListener('DOMContentLoaded', window.initCodeBlocks);
