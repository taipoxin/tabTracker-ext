let arrOfTabs = [];

function fillArr() {
    arrOfTabs = [];
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        tabs.forEach(tab => {
            arrOfTabs.push({ index: tab.index, title: tab.title, url: tab.url })
        });
    });
}

function retriveTabs() {
    d = document;
    var i = d.createElement('textarea');
    arrOfTabs.forEach(tab => {
        i.value += JSON.stringify(tab) + '\n';
    });
    d.body.appendChild(i);
}


document.addEventListener('DOMContentLoaded', function () {
    var getTabsBtn = document.getElementById('getTabs');
    fillArr();
    getTabsBtn.addEventListener('click', function () {
        retriveTabs();
    }, false);

}, false);

