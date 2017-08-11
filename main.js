var manualItems;
var instaGramItems;
var twitterItems;
var rowDiv;
var colDiv;
var imgTag;
var pTag;
var h2Tag;
var aTag;
var itemCount = 0;
var loadCount = 0;


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
    loadAllItems();
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

function removeOtherNodes(type){
  var mainNode = document.getElementById('main');
  for (var i = 0; i < mainNode.childNodes.length; i++){
    console.log(mainNode[i]);
  }
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

function createCol(classname){
  colDiv = document.createElement("div");
  colDiv.className = "col-sm-4 " + classname;
  return colDiv;
}

function checkMainNodeLength(classname){
  var mainNodes = $("#main")[0].childNodes;
  var mainNodesLength = $("#main")[0].childNodes.length;
  if (mainNodesLength > 1){
    var latestNode = mainNodes[mainNodesLength-1];
    if (checkRowNodeLength(latestNode)){
      return latestNode;
    }else {
      return createRow(classname);
    }
  }else {
    return createRow(classname);
  }
}

function checkRowNodeLength(node){
  if (node.childElementCount < 3){
    return true;
  }else if (node.childElementCount === 3){
    return false;
  }
}


var classnames = ["manual", "twitter", "instagram"];
function filterItems(classname){
  for (var i = 0; i < classnames.length; i++){
    if (classnames[i] !== classname){
      deleteNodes(classnames[i]);
    }
  }
}

function removeEmptyRows(){
  var mainNode = document.getElementById("main");
  for (var i = 1; i < mainNode.childElementCount; i++){
    if (mainNode.childNodes[i].childElementCount === 0){
      mainNode.removeChild(mainNode.childNodes[i]);
    }
  }
}


function deleteNodes(classname){
  var elmnts = document.getElementsByClassName(classname);
  if (elmnts.length > 0){
    var parent = elmnts[0].parentNode;
  }
    while (elmnts.length > 0){
      elmnts[0].parentNode.removeChild(elmnts[0]);
    }
    removeEmptyRows();
}


function instaStuff(){
  filterItems("instagram");
  var outerContainer = checkMainNodeLength();
  instaGramItems = filterResults("Instagram");

  for(var i = 0; i < instaGramItems.length; i++){
    var col = createCol("instagram");
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
  filterItems("twitter");
  var outerContainer = checkMainNodeLength();
    twitterItems = filterResults("Twitter");
    for(var i = 0; i < twitterItems.length; i++){
      var col = createCol("twitter");
      var obj = twitterItems[i]["item_data"];
      h2Tag = document.createElement("h2");
      pTag = document.createElement("div");
      var sent = myregEx(obj["tweet"]);
      var sentContainer = document.createElement("div");
      sentContainer.appendChild(sent);
      h2Tag.innerText = obj["user"]["username"];
      col.appendChild(h2Tag);
      col.appendChild(sentContainer);
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

function manualStuff(){
  filterItems("manual");
  var outerContainer = checkMainNodeLength();
    manualItems = filterResults("Manual");
    for(var i = 0; i < manualItems.length; i++){
      var col = createCol("manual");
      var obj = manualItems[i]["item_data"];
      imgTag = document.createElement("img");
      pTag = document.createElement("p");
      aTag = document.createElement("a");
      pTag.innerText = obj["text"];
      pTag.className = "manual";
      aTag.innerText = obj["link_text"];
      aTag.href = obj["link"];
      aTag.setAttribute("target", "blank");
      imgTag.setAttribute("src", obj["image_url"]);
      col.appendChild(imgTag);
      col.appendChild(pTag);
      col.appendChild(aTag);
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
    var things = document.createElement("p");
    things.innerText = sentence;
    return things;
  }
}

function parseURLs(sentence, matches){
  var sentArr = sentence.split(" ");
  var newP = document.createElement("p");
  var beginning;
  var end;
  for (var i = 0; i < matches.length; i++){
    var matchIdx = sentArr.indexOf(matches[i]);
    aTag = document.createElement("a");
    aTag.innerText = matches[i];
    beginning = sentArr.slice(0, matchIdx);
    end = sentArr.slice((matchIdx+1), (sentArr.length));
    aTag.setAttribute("href", matches[i]);
    aTag.setAttribute("target", "blank");

  }

  var p1 = document.createElement("span");
  var p2 = document.createElement("span");
  p1.innerText = beginning.join(" ") + " ";
  p2.innerText = " " + end.join(" ");
  newP.appendChild(p1);
  newP.appendChild(aTag);
  newP.appendChild(p2);
  return newP;
}

function loadAllItems(){
  var itemsArray = content["items "];
  var outerContainer = checkMainNodeLength();
  console.log(itemCount);
  if (itemCount === itemsArray.length){
    itemCount = 0;
  }
  for (var i = itemCount; i < itemsArray.length; i++){
    if ((loadCount > 0) && (loadCount % 5 === 0)){
      loadCount = 0;
      break;
    }
    var data = itemsArray[i].item_data;
    var newCol;
    if (itemsArray[i].service_name === "Manual"){
      newCol = manualItem(data);
    }else if (itemsArray[i].service_name === "Twitter") {
      newCol = twitterItem(data);
    }else if (itemsArray[i].service_name === "Instagram"){
      newCol = instagramItem(data);
    }
    if (outerContainer.childElementCount < 3){
      outerContainer.appendChild(newCol);
    }else {
      $("#main").append(outerContainer);
      outerContainer = checkMainNodeLength();
      outerContainer.appendChild(newCol);
    }
    itemCount+=1;
    loadCount+=1;
  }
  if (outerContainer){
    $("#main").append(outerContainer);
  }
}

function manualItem(data){
  var col = createCol("manual");
  imgTag = document.createElement("img");
  pTag = document.createElement("p");
  aTag = document.createElement("a");
  pTag.innerText = data["text"];
  pTag.className = "manual";
  aTag.innerText = data["link_text"];
  aTag.href = data["link"];
  aTag.setAttribute("target", "blank");
  imgTag.setAttribute("src", data["image_url"]);
  col.appendChild(imgTag);
  col.appendChild(pTag);
  col.appendChild(aTag);
  return col;
}

function twitterItem(data){
  var col = createCol("twitter");
  h2Tag = document.createElement("h2");
  pTag = document.createElement("div");
  var sent = myregEx(data["tweet"]);
  var sentContainer = document.createElement("div");
  sentContainer.appendChild(sent);
  h2Tag.innerText = data["user"]["username"];
  col.appendChild(h2Tag);
  col.appendChild(sentContainer);
  return col;
}


function instagramItem(data){
  var col = createCol("instagram");
  imgTag = document.createElement("img");
  // pTag = document.createElement("p");
  h2Tag = document.createElement("h2");
  imgTag.setAttribute("src", data["image"]["medium"]);
  pTag = myregEx(data["caption"]);
  h2Tag.innerText = data["user"]["username"];
  col.appendChild(imgTag);
  col.appendChild(h2Tag);
  col.appendChild(pTag);
  return col;
}
