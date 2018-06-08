// TODO: prettify
// TODO: maybe figure out domain from URLs to show in brackets?
// TODO: maybe filter/sorting

browser.storage.sync.get().then(function(items) {
  for(let url of Object.keys(items)) {
    let para = document.createElement("p");
    
    let remove = document.createElement("a");
    remove.href = "#";
    remove.innerHTML = "[x]";
    remove.addEventListener("click", function(e) {
      e.preventDefault();
      browser.storage.sync.remove(url);
      document.body.removeChild(para);
    });
    
    let favicon = document.createElement("img");
    favicon.src = items[url]["favicon"];
    favicon.width = "16"; favicon.height = "16";

    let link = document.createElement("a");
    link.href = url;
    link.innerHTML = items[url]["title"];

    let date = document.createElement("span");
    date.innerHTML = ": " + new Date(items[url]["saved_at"]);
    
    para.appendChild(remove);
    para.appendChild(favicon);
    para.appendChild(link);
    para.appendChild(date);
    document.body.appendChild(para);
  }
},
function(error) {
});