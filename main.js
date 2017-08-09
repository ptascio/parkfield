var manualItems;
var instaGramItems;
var twitterItems;
var rowDiv;
var colDiv;
var imgTag;
var pTag;


$(document).ready(function() {
    loadData();
});


  var content;
function loadData(){
  content = $.ajax({
    url: "https://content.dropboxapi.com/1/files/auto/posts.json",
    type: 'GET',
    headers: {
      "Authorization": "Bearer ",
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
      console.log('there');
      return latestNode;
    }else {
      console.log('there there');
      return createRow();
    }
  }else {
    console.log('here');
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
    pTag = document.createElement("p");
    imgTag.setAttribute("src", obj["image"]["medium"]);
    pTag.innerText = obj["caption"];
    col.appendChild(imgTag);
    col.appendChild(pTag);
    if (outerContainer.childElementCount < 3){
      outerContainer.appendChild(col);
    }else {
      outerContainer = checkMainNodeLength();
      outerContainer.appendChild(col);
    }

  }
  $("#main").append(rowDiv);
}
