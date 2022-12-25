chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'generate') {
        console.log("Message received");
        chrome.scripting.executeScript({
            target: { tabId: request.tab_id },
            files: ['content-script.js']
        });
    }
});