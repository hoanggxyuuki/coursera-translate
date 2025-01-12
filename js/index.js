document.addEventListener("DOMContentLoaded", function() {
  let checkButton = document.getElementById("translateBtn");
  let langSelect = document.getElementById("lang");

  chrome.storage.local.get(['selectedLang', 'autoTranslate'], function(result) {
      if(result.selectedLang) {
          langSelect.value = result.selectedLang;
      }
      if(result.autoTranslate) {
          autoTranslate();
      }
  });

  function autoTranslate() {
      let lang = langSelect.value;
     
      chrome.storage.sync.set({ lang: lang });
      chrome.storage.local.set({ 
          selectedLang: lang,
          autoTranslate: true 
      });

      
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, { 
                  method: "translate" 
              }, function(response) {
                  if (chrome.runtime.lastError) {
                      console.log('Translation failed:', chrome.runtime.lastError);
                      return;
                  }
              });
          }
      });
  }

 
  checkButton.addEventListener("click", autoTranslate, false);
});