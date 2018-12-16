let arrOfTabs = [];

function fillArr() {
    arrOfTabs = [];
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        tabs.forEach(tab => {
            arrOfTabs.push({index: tab.index, title: tab.title, url: tab.url })
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

function searchTabByIndex(idx) {
    arrOfTabs.forEach(t => {
        if (t.index === idx) {
            return t;
        }
    });
    return null;
}

function isNewUrlTab(tab) {
    // console.log(tab)
    if (tab.index >= arrOfTabs.length) {
        // по любому новая
        return true;
    }
    // совпадает, нельзя считать за изменение
    if(arrOfTabs[tab.index].url === tab.url) {
        return false;
    }
    let oldTab = searchTabByIndex(tab.index);
    if (oldTab && oldTab.url === tab.url) {
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    var getTabsBtn = document.getElementById('getTabs');
    // первоначальная загрузка
    fillArr();
    getTabsBtn.addEventListener('click', function () {
        retriveTabs();
    }, false);

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        // console.log(`tabId: `, tabId)
        // console.log(`changeInfo: `, changeInfo)
        // console.log(`tab: `, tab)
        if (changeInfo.status === 'complete') {
            if (isNewUrlTab(tab)) {
                // новый url
                // отправляем инфу о новом tab
                console.log(`найден новый/обновление url`);
                console.log(`title: ${tab.title},\n url: ${tab.url}`);
            }
            // в любом случае
            // обновляем список вкладок
            fillArr();
        }
    })
}, false);

