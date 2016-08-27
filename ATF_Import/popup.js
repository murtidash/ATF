//https://bugs.chromium.org/p/chromium/issues/detail?id=29379
// Update the relevant fields with the new data
function getFlavorsbcv(info) {  
  console.log(info);
  $("#flavorlist").text("");
  $("#flavorlist").text(info);
  chrome.storage.sync.set({'list': info}, function() {});
}

function getFlavorsece(info) {  
  console.log(info);
  $("#flavorlist").text("");
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

  $("#eceexport").click(function() {
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
      console.log("in export");
      chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup',subject: 'getFlavorsece'}, 
        getFlavorsece
      );
    })}
    );

  $("#bcvexport").click(function() {
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
      console.log("in export");
      chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup',subject: 'getFlavorsbcv'}, 
        getFlavorsbcv
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