// importScripts('service-worker-utils.js');


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'generate') {
        console.log("Message received");
        chrome.scripting.executeScript({
            target: { tabId: request.tab_id },
            files: ['content-script.js']
        });
    }
});

chrome.tabs.onUpdated.addListener( function (request, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        console.log("Updating tags");
        console.log(tab);
        console.log(changeInfo);
        console.log(request);
        chrome.scripting.executeScript({
            target: { tabId: request },
            files: ['modify_tags.js']
        });
        console.log("DONE");
    }
  })