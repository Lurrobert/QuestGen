async function collectPage() {
    src = chrome.runtime.getURL("Readability.js");
    contentMain = await import(src);
    var documentCopy = document.cloneNode(true);
    get_tags(documentCopy);
    var article = new contentMain.Readability(documentCopy).parse().content;
    console.log(article);
    return article;
}

function sendCleanPage() {
    collectPage().then(function (article) {
        // send post data with article to the server
        var url = "http://localhost:5000/post";
        var data = { article: article };
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

function get_tags(rootElement) {
    tags_collected = [];
    const pTags = rootElement.getElementsByTagName('p');
    for (let i = 0; i < pTags.length; i++) {
        const pTag = pTags[i];
        const xpath = createXPath(rootElement, pTag);
        pTag.dataset.identifier = xpath;
    }
    console.log(rootElement);
}


function createXPath(rootElement, element) {
    let xpath = '';
    while (element !== rootElement) {
        let index = 1;
        let sibling = element.previousElementSibling;
        while (sibling) {
            if (sibling.nodeName === element.nodeName) {
                index++;
            }
            sibling = sibling.previousElementSibling;
        }
        xpath = '/' + element.nodeName + '[' + index + ']' + xpath;
        element = element.parentNode;
    }
    xpath = '/' + xpath;
    return xpath;
}


sendCleanPage();


