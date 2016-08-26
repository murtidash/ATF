 function findFlavor(flavor,callback) {
      //put flavor text in
      $("#name_like").val(flavor.mfg + " " + flavor.name);
      //then update the form
      $("#name_like").addClass("loading"); // show the spinner
      var form = $("#flavors-search-form"); // grab the form wrapping the search bar.
      var url = "/flavors/live_search"; // live_search action.
      var formData = form.serialize(); // grab the data in the form
      $.get(url, formData, function(html) { // perform an AJAX get
        $("#name_like").removeClass("loading"); // hide the spinner
        $("#flavors-results").html(html); // replace the "results" div with the results      
      });
      //Let's see if we found a match
      setTimeout(function() {
        var len = $("#flavors-results tr").length;
        console.log("Found " + len + " results");
        if (len == 0) {
          var lastIndex = flavor.name.lastIndexOf(" ");
          flavor.name = flavor.name.substring(0, lastIndex);
          $("#name_like").val(flavor.mfg + " " + flavor.name);
          //Only let it recurse once
          console.log(flavor.recurse);
          if(flavor.recurse == undefined) {
            console.log("in recurse");
            flavor.recurse=true;
            findFlavor(flavor);            
          }
        }
        else {
          console.log("results found, picking first one");
          addflavor(flavor)
        };        
      },1000)
      if(callback) callback();
};

function addflavor(flavor){
  console.log("in addflavor for " + JSON.stringify(flavor));
  $("#user_flavor_volume").val(flavor.quantity);
  $("#user_flavor_cost").val(flavor.price);
  $(".glyphicon-chevron-right").click();
  setTimeout(function(){
    flavor.quantity = Number(flavor.quantity[0].match(/\d*/)[0]);
    var origFlavor = $("#user_flavor_volume").val();
    console.log("origFlavor = "+origFlavor + "quantity = "+flavor.quantity);
    var totalflavor = Number(origFlavor)+Number(flavor.quantity);
    flavor.price = flavor.price.match(/\$(.*)/)[1];
    $("#user_flavor_stashed").prop( "checked","checked");
    $("#user_flavor_volume").val(totalflavor);
    $("#user_flavor_cost").val(flavor.price);
    var priceperml = Number((flavor.price/flavor.quantity*100/100)).toFixed(2);
    console.log(priceperml);
    $("#user_flavor_cost_per_ml").val(priceperml);
    $(".panel-footer > .btn").click();
    console.log("had " + origFlavor + " added " + flavor.quantity + " for a total of "+ totalflavor);
  },2000);
}

if(!(typeof JSON === 'object' && typeof JSON.stringify === 'function')) {
      $.getScript('//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2.min.js', winHasJSON);
    }
var flavorlist = [];
// Inform the background page that
// this tab should have a page-action
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});

// Listen for messages from the popup
console.log("start of content.js");
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // First, validate the message's structure
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`)
    var domInfo = {
      total:   document.querySelectorAll('*').length,
      inputs:  document.querySelectorAll('input').length,
      buttons: document.querySelectorAll('button').length
    };
    response(domInfo);
  }

  if ((msg.from === 'popup') && (msg.subject === 'pushFlavors')) {
    // Collect the necessary data 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`)
    var jsonFlavors = eval('(' + msg.data + ')');
    console.log("in pushflavors " + jsonFlavors + " has " + jsonFlavors.length + " flavors");
    $.each(jsonFlavors, function(index,flavor) {
      setTimeout(function(){
        console.log(flavor);        
        findFlavor(flavor,function() {})
      },index*6000);
    });
    response("hi"+jsonFlavors);
    }
  

  if ((msg.from === 'popup') && (msg.subject === 'getFlavors')) {
    // Collect the necessary data
    console.log("in cart message");
    cart = $('.CartContents:first > tbody > tr');
    cart.each( 
      function(index, row) {
        //Get the flavor info
        var fullString = ($(this).find("a").text()).split("-");
        var price = $(this).find(".ProductPrice").text();
        var quantity = ($(this).find(".OrderItemOptions").text()).match(/\d*ml/);
        console.log("quantity:"+quantity);
        var flavor=fullString[0];
        var mfg=fullString[1];
        if(mfg=='TFA') {
          mfg='TPA';
        }        
        console.log("name:"+flavor+" mfg:"+mfg + " price:"+price+" quantity:"+quantity);
        if(quantity!==null) {
          flavorlist.push({name:flavor,mfg:mfg,price:price,quantity:quantity});
        }
      });
    //Turn it into json
    var json_data = JSON.stringify(flavorlist);
    console.log(json_data);
    }    
    // Directly respond to the sender (popup), 
    // through the specified callback */
    response(json_data);
});