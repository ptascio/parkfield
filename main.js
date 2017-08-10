var manualItems;
var instaGramItems;
var twitterItems;
var rowDiv;
var colDiv;
var imgTag;
var pTag;
var h2Tag;
var aTag;


$(document).ready(function() {
    loadData();
});


  var content;
function loadData(){
  content = $.ajax({
    url: "https://content.dropboxapi.com/1/files/auto/posts.json",
    type: 'GET',
    headers: {
      "Authorization": "Bearer AkpoFy1WulgAAAAAAAAAfvVbPMzpOCMhfnekIX_OhQVk3yV6STBNLCinhWKXupnZ",
  },
  success: function (data) {
    content = JSON.parse(data);
    filterResults("Manual", "manualItems");
    filterResults("Instagram", "instaGramItems");
    filterResults("Twitter", "twitterItems");

  },
  error: function (error) {
    $("#error").html(error.responseJSON["error"]);
  },
});
}



function filterResults(type){
  var itemsArray = content["items "];
  var container = itemsArray.filter(function(item, i){
    return item["service_name"] === type;
  });
return container;
}

function createEntry(){


  rowDiv.appendChild(colDiv);
  return rowDiv;
}

function createRow(){
  rowDiv = document.createElement("div");
  rowDiv.className = "row";
  return rowDiv;
}

function createCol(){
  colDiv = document.createElement("div");
  colDiv.className = "col-sm-4";
  return colDiv;
}

function checkMainNodeLength(){
  var mainNodes = $("#main")[0].childNodes;
  var mainNodesLength = $("#main")[0].childNodes.length;
  if (mainNodesLength > 1){
    var latestNode = mainNodes[mainNodesLength-1];
    if (checkRowNodeLength(latestNode)){
      return latestNode;
    }else {
      return createRow();
    }
  }else {
    return createRow();
  }
}

function checkRowNodeLength(node){
  if (node.childElementCount < 3){
    return true;
  }else if (node.childElementCount === 3){
    return false;
  }
}

function instaStuff(){
var outerContainer = checkMainNodeLength();
// $("#main")[0].childNodes[1].childNodes.length
  instaGramItems = filterResults("Instagram");
  for(var i = 0; i < instaGramItems.length; i++){
    var col = createCol();
    var obj = instaGramItems[i]["item_data"];
    imgTag = document.createElement("img");
    // pTag = document.createElement("p");
    h2Tag = document.createElement("h2");
    imgTag.setAttribute("src", obj["image"]["medium"]);
    pTag = myregEx(obj["caption"]);
    h2Tag.innerText = obj["user"]["username"];
    col.appendChild(imgTag);
    col.appendChild(h2Tag);
    col.appendChild(pTag);
    if (outerContainer.childElementCount < 3){
      outerContainer.appendChild(col);
    }else {
      $("#main").append(outerContainer);
      outerContainer = checkMainNodeLength();
      outerContainer.appendChild(col);
    }

  }
  if (outerContainer){
    $("#main").append(outerContainer);
  }
}

function twitterStuff(){
  var outerContainer = checkMainNodeLength();
  // $("#main")[0].childNodes[1].childNodes.length
    twitterItems = filterResults("Twitter");
    for(var i = 0; i < twitterItems.length; i++){
      var col = createCol();
      var obj = twitterItems[i]["item_data"];
      imgTag = document.createElement("img");
      h2Tag = document.createElement("h2");
      pTag = document.createElement("p");
      imgTag.setAttribute("src", obj["user"]["avatar"]);
      pTag.innerHTML = myregEx(obj["tweet"]);
      h2Tag.innerText = obj["user"]["username"];
      col.appendChild(h2Tag);
      col.appendChild(imgTag);
      col.appendChild(pTag);
      if (outerContainer.childElementCount < 3){
        outerContainer.appendChild(col);
      }else {
        $("#main").append(outerContainer);
        outerContainer = checkMainNodeLength();
        outerContainer.appendChild(col);
      }
    }

if (outerContainer){
  $("#main").append(outerContainer);
}
}


function myregEx(sentence){
  var myReg = /(https?:\/\/[^\s]+)/g;
  var matches = sentence.match(myReg);
  if (matches){
    return parseURLs(sentence, matches);
  }else {
    return sentence;
  }
}

function parseURLs(sentence, matches){
  pTag = document.createElement("p");
  pTag.innerText = sentence;
  for (var i = 0; i < matches.length; i++){
    aTag = document.createElement("a");
    aTag.innerHTML = matches[i];
    pTag.replace(matches[i], aTag);
  }
  // pTag = document.createElement("p");
  // pTag.innerHTML = sentence;
  return pTag;
  // return sentence;
}
