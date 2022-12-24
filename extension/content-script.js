async function collectPage() {
    src = chrome.runtime.getURL("Readability.js");
    contentMain = await import(src);
    var documentClone = document.cloneNode(true);
    var article = new contentMain.Readability(documentClone).parse().content;
    return article; 
}

function sendCleanPage() {
    collectPage().then(function(article) {
        // send post data with article to the server
        var url = "http://localhost:5000/post";
        var data = {article: article};
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
    });
}

// sendCleanPage();
collectPage();