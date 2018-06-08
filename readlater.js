// TODO: loop over tabs on first start and set correct button

let setButton = function(name, text, tabId) {
  browser.browserAction.setIcon({
    path: {
      16: "button/" + name + "16.png",
      32: "button/" + name + "32.png",
      64: "button/" + name + "64.png"
    },
    tabId: tabId
  });
  browser.browserAction.setTitle({
    title: text,
    tabId: tabId
  });
};

browser.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if(changeInfo.hasOwnProperty("url")) {
    let url = changeInfo["url"];
    
    browser.storage.sync.get(url).then(function(result) {
      // in the reading list, so switch to the "remove" button
      if(result.hasOwnProperty(url)) {
        setButton("done", "Remove from list", tabId);
      }
    },
    function(err) {
      console.log("Storage access error in update listener: " + err);
    });
  }
});

browser.storage.onChanged.addListener(function(changes) {
  let new_urls = [];
  let removed_urls = [];
  
  for(let url of Object.keys(changes)) {
    if(changes[url].hasOwnProperty("newValue")) {
      // created or updated (somehow)
      new_urls.push(url);
    } else {
      // no newValue so it was removed
      removed_urls.push(url);
    }
  }
  
  browser.tabs.query({}).then(function(tabs) {
    for(let tab of tabs) {
      if(new_urls.indexOf(tab.url) >= 0) {
        setButton("done", "Remove from list", tab.id);
      } else if(removed_urls.indexOf(tab.url) >= 0) {
        setButton("save", "Save for later", tab.id);
      }
    }
  }, function(err) {
    console.log("Tab query error: " + err);
  });
});

browser.browserAction.onClicked.addListener(function(tab) {
  let url = tab.url;

  browser.storage.sync.get(url).then(function(result) {
    if(result.hasOwnProperty(url)) {
      // was in storage, remove it
      browser.storage.sync.remove(url).catch(function(err) {
        console.log("Removal error: " + err);
      });
    } else {
      // wasn't in storage, add it
      let keys = {};
      keys[url] = {
        "title": tab.title,
        "saved_at": Date.now(),
        "favicon": tab.favIconUrl
      };
      browser.storage.sync.set(keys).catch(function(err) {
        console.log("Save error: " + err);
      });
    }
  },
  function(err) {
    console.log("Storage access error in browser action: " + err);
  });
});