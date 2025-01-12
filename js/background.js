
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 
        autoTranslate: false,
        selectedLang: 'vi'
    });
});


chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes('coursera.org')) {
        chrome.storage.local.get(['autoTranslate'], function(result) {
            if (result.autoTranslate) {
                chrome.tabs.sendMessage(details.tabId, { method: "translate" });
            }
        });
    }
});


chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.url.includes('coursera.org')) {
        chrome.storage.local.get(['autoTranslate'], function(result) {
            if (result.autoTranslate) {
                setTimeout(() => {
                    chrome.tabs.sendMessage(details.tabId, { method: "translate" });
                }, 1500); 
            }
        });
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method === "translate") {
        chrome.tabs.sendMessage(sender.tab.id, { method: "translate" });
        sendResponse({ status: "ok" });
    }
    return true;
});