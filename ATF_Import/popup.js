//https://bugs.chromium.org/p/chromium/issues/detail?id=29379
// Update the relevant fields with the new data
function setDOMInfo(info) {
  document.getElementById('total').textContent   = info.total;
  document.getElementById('inputs').textContent  = info.inputs;
  document.getElementById('buttons').textContent = info.buttons;
}

function getFlavors(info) {  
  console.log(info);
  $("#flavorlist").text(info);
  chrome.storage.sync.set({'list': info}, function() {});
}

function pushFlavors(info) {
  console.log("response: "+info);
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
  var flist=[];
  chrome.storage.sync.get('list',function(items) {flist=items.list;$("#flavorlist").text(flist)});
  // ...query for the active tab...
  chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {from: 'popup', subject: 'DOMInfo'},
      // ...also specifying a callback to be called 
      //    from the receiving end (content script)
      setDOMInfo
    );
  });

  console.log("before clicky");
  $("#bcvexport").click(function() {
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
      console.log("in export");
      chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup',subject: 'getFlavors'}, 
        getFlavors
      );
    })}
    );

  $("#atfimport").click(function() {
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
      console.log("in import");
      console.log("flist: "+flist);
      chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup',subject: 'pushFlavors',data:flist}, 
        pushFlavors
      );
    })}
    );

  $("#savelist").click(function() { 
    var list2 = $("#flavorlist").val();
    console.log(list2);
    chrome.storage.sync.set({'list': list2},function() {});
    console.log("saved");
    });

});