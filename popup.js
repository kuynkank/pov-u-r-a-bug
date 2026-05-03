const slider = document.getElementById('slider');

slider.addEventListener('input', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { zoom: slider.value });
});