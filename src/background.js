const windowsInfo = {};

function fillArr(windowId) {
  windowsInfo[windowId] = [];
  chrome.tabs.query({ windowId }, (tabs) => {
    tabs.forEach((tab) => {
      windowsInfo[windowId].push({ index: tab.index, title: tab.title, url: tab.url });
    });
    console.log(`filled window tabs, id:${windowId}`);
    console.log(windowsInfo[windowId]);
  });
}


function searchTabByIndex(array, idx) {
  array.forEach((t) => {
    if (t.index === idx) {
      return t;
    }
  });
  return null;
}

function isNewUrlTab(tab) {

  const arrOfTabs = windowsInfo[tab.windowId];
  if (!arrOfTabs) {
    windowsInfo[tab.windowId] = [];
    return true;
  }
  console.log(tab);
  if (tab.index >= arrOfTabs.length) {
    console.log(`tab.index(${tab.index}) >= arrOfTabs.length(${arrOfTabs.length})`);
  
    return true;
  }
  if (arrOfTabs[tab.index].title === tab.title) {
    return false;
  }
  const oldTab = searchTabByIndex(arrOfTabs, tab.index);
  console.log(`oldTab: ${oldTab})`);
  if (oldTab && oldTab.title === tab.title) {
    return false;
  }
  return true;
}


function sendAjaxObject(obj) {
  $.ajax({
    url: 'http://localhost:4500/new', // url страницы (action_ajax_form.php)
    type: 'POST', // метод отправки
    dataType: 'json', // формат данных
    data: JSON.stringify(obj),
    contentType: 'application/json; charset=utf-8',
    success(response) { // Данные отправлены успешно
      console.log(response);
    },
    error(xhr, status, error) { // Данные не отправлены
      console.log('error');
      console.log(xhr);
      console.log(status);
      console.log(error);
    },
  });
}

function checkTab(tab) {
  if (isNewUrlTab(tab)) {
    // новый url
    // отправляем инфу о новом tab
    console.log('найден новый/обновление url');
    console.log(`title: ${tab.title},\n url: ${tab.url}`);
    // send {user: Number, title: String, datetime: Number}
    sendAjaxObject({user: 1, title: tab.title, datetime: new Date().getTime() });
  }
  // в любом случае
  // обновляем список вкладок
  fillArr(tab.windowId);
}

function onUpdateListener(tabId, changeInfo, tab) {
  // console.log(`tabId: `, tabId)
  // console.log(`changeInfo: `, changeInfo)
  // console.log(`tab: `, tab)
  if (changeInfo.title) {
    if (tab.status === 'complete') {
      checkTab(tab)
    }
  }
  else if (changeInfo.status === 'complete') {
    checkTab(tab)
  }
}


// first loading
chrome.windows.getAll({ populate: true }, (windows) => {
  console.log(windows);
  windows.forEach((window) => {
    windowsInfo[window.id] = [];
    window.tabs.forEach((tab) => {
      windowsInfo[window.id].push({ index: tab.index, title: tab.title, url: tab.url });
    });
  });
  console.log(windowsInfo);
  chrome.tabs.onUpdated.addListener(onUpdateListener);
});
