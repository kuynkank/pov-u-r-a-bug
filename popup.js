const toggle = document.getElementById('toggle');
const answer = document.getElementById('answer');

function updateAnswer(enabled) {
    answer.textContent = enabled ? 'Yes!' : 'No';
}

async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

(async () => {
    const tab = await getActiveTab();
    if (!tab) return;
    const key = `enabled_${tab.id}`;
    const result = await chrome.storage.local.get(key);
    // default to enabled if no state stored yet
    toggle.checked = result[key] !== false;
    updateAnswer(toggle.checked);
})();

toggle.addEventListener('change', async () => {
    const tab = await getActiveTab();
    if (!tab) return;
    const key = `enabled_${tab.id}`;
    const enabled = toggle.checked;
    updateAnswer(enabled);
    await chrome.storage.local.set({ [key]: enabled });
    try {
        await chrome.tabs.sendMessage(tab.id, { type: 'toggle', enabled });
    } catch (e) {
        console.error('Could not reach content script:', e);
    }
});
