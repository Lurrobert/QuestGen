console.log('The extension was clicked');

chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tab) {
    
    document.querySelector('#buttony').addEventListener('click', function(){
      chrome.runtime.sendMessage({
        tab_id: tab[0].id,
        type: "generate",
      }, function(response) {
      if (!chrome.runtime.lastError) {
          console.log("Message sent successfully")
      } else {
        console.log(chrome.runtime.lastError);
      }
    }
      )
    }); 

  })
  
