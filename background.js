// import $ from './lib/jquery-3.3.1.min'

let arrOfTabs = [];
let windowsInfo = {};

function fillArr() {
  arrOfTabs = [];
  chrome.tabs.query({ }, function (tabs) {
    tabs.forEach(tab => {
      arrOfTabs.push({ index: tab.index, title: tab.title, url: tab.url })
    });
    console.log('filled Array')
    console.log(arrOfTabs)
  });
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
  console.log(arrOfTabs)
  console.log(tab)
  if (tab.index >= arrOfTabs.length) {
    console.log(`tab.index(${tab.index}) >= arrOfTabs.length(${arrOfTabs.length})`)
    // по любому новая
    return true;
  }
  // совпадает, нельзя считать за изменение
  if (arrOfTabs[tab.index].title === tab.title) {
    return false;
  }
  let oldTab = searchTabByIndex(tab.index);
  console.log(`oldTab: ${oldTab})`)
  if (oldTab && oldTab.title === tab.title) {
    return false;
  }
  return true;
}

function sendAjaxObject(obj) {
  $.ajax({
    url: 'http://localhost:4500/new', //url страницы (action_ajax_form.php)
    type: "POST", //метод отправки
    dataType: "json", //формат данных
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function (response) { //Данные отправлены успешно
      console.log(response)
    },
    error: function (response) { // Данные не отправлены
      console.log('error')
      console.log(response)
    }
  });
}

chrome.windows.getAll({populate: true}, function callback(windows) {
  console.log(windows);
  windows.forEach(window => {
    windowsInfo[window.id] = []
    window.tabs.forEach(tab => {
      windowsInfo[window.id].push({ index: tab.index, title: tab.title, url: tab.url })
    });
  });
  console.log(windowsInfo)
})


// first loading
// fillArr();
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   // console.log(`tabId: `, tabId)
//   // console.log(`changeInfo: `, changeInfo)
//   // console.log(`tab: `, tab)
//   if (changeInfo.status === 'complete') {
//     if (isNewUrlTab(tab)) {
//       // новый url
//       // отправляем инфу о новом tab
//       console.log(`найден новый/обновление url`);
//       console.log(`title: ${tab.title},\n url: ${tab.url}`)
//       // send {title, datetime}
//       sendAjaxObject({ title: tab.title, datetime: new Date() })
//     }
//     // в любом случае
//     // обновляем список вкладок
//     fillArr();
//   }
// })

