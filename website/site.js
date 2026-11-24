const tabs = [...document.querySelectorAll('.install-tab')];

function selectTab(tab, focus = false) {
    for (const item of tabs) {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    }
    if (focus)
        tab.focus();
}

for (const tab of tabs)
    tab.addEventListener('click', () => selectTab(tab));

document.querySelector('.install-tabs').addEventListener('keydown', event => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0)
        return;
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length :
        event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length :
        event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next !== null) {
        event.preventDefault();
        selectTab(tabs[next], true);
    }
});

for (const link of document.querySelectorAll('[data-select]'))
    link.addEventListener('click', () => selectTab(document.getElementById(`tab-${link.dataset.select}`)));

function showLinkedGuide() {
    const name = location.hash.slice(1);
    if (name === 'gnome' || name === 'vscode') {
        selectTab(document.getElementById(`tab-${name}`));
        document.getElementById('install').scrollIntoView();
    }
}

window.addEventListener('hashchange', showLinkedGuide);
showLinkedGuide();

document.querySelectorAll('.copy').forEach(copyButton => copyButton.addEventListener('click', async event => {
    const button = event.currentTarget;
    try {
        await navigator.clipboard.writeText(button.parentElement.querySelector('code').textContent);
        button.textContent = 'Copied!';
    } catch {
        button.textContent = 'Select to copy';
    }
    setTimeout(() => { button.textContent = 'Copy'; }, 2500);
}));
