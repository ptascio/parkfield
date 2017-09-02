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
var filter = false;
var loadAll = false;


$(document).ready(function() {
    loadData();
});

//initial call
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
    loadAllItems();
  },
  error: function (error) {
    $("#error").html(error.responseJSON["error"]);
  },
});
}


//get content according to service_name
function filterResults(type){
  var itemsArray = content["items "];
  var container = itemsArray.filter(function(item, i){
    return item["service_name"] === type;
  });
  return container;
}

//appends new col to row
function createEntry(){
  rowDiv.appendChild(colDiv);
  return rowDiv;
}
//creates a new row
function createRow(){
  rowDiv = document.createElement("div");
  rowDiv.className = "row";
  return rowDiv;
}
//creates a new col
function createCol(classname){
  colDiv = document.createElement("div");
  colDiv.className = "col-sm-4 " + classname;
  return colDiv;
}
//scans the rows on a page
//if the last row has less than 3 cols then that row will be returned
//if the last row has 3 cols, a new row will be returned
function checkMainNodeLength(classname){
  var mainNodes = $("#main")[0].childNodes;
  var mainNodesLength = mainNodes.length;
  if (mainNodesLength >= 1){
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
//see functin above
function checkRowNodeLength(node){
  if (node.childElementCount < 3){
    return true;
  }else if (node.childElementCount === 3){
    return false;
  }
}

//when toggling filters, remove any nodes that do not have the appropriate classname
var classnames = ["manual", "twitter", "instagram"];
function filterItems(classname){
  for (var i = 0; i < classnames.length; i++){
    if (classnames[i] !== classname){
      deleteNodes(classnames[i]);
    }
  }
}
//delete any empty rows that get left behind
function removeEmptyRows(){
  var mainNode = document.getElementById("main");
  for (var i = 1; i < mainNode.childElementCount; i++){
    if (mainNode.childNodes[i].childElementCount === 0){
      mainNode.removeChild(mainNode.childNodes[i]);
    }
  }
}

//delete cols by classname
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

//filter by Instagram service_name
function instaStuff(){
  if (filter === false){
    clearAll();
    filter = true;
    loadAll = false;
  }
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
//filter by Twitter service_name
function twitterStuff(){
  if (filter === false){
    clearAll();
    filter = true;
    loadAll = false;
  }
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
//filter by Manual service_name
function manualStuff(){
  if (filter === false){
    clearAll();
    filter = true;
    loadAll = false;
  }
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

//find urls within a atring
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
//this works for the twitter text structure
//find the url within the text and divide the text based on where the url is
//create a p tag, then append 3 separate tags to it
//each tag contains either the first half of the text, the linked text, or the second half of the text
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
//see all of the content
function loadAllItems(){
  if (loadAll === false){
    clearAll();
    itemCount = 0;
    loadCount = 0;
    loadAll = true;
    filter = false;
  }

  var itemsArray = content["items "];
  var outerContainer = checkMainNodeLength();
  if (itemCount === itemsArray.length){
    itemCount = 0;
    loadCount = 0;
  }
  for (var i = itemCount; i < itemsArray.length; i++){
    if ((loadCount > 0) && (loadCount % 3 === 0)){
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
//when loading all the content, Manual items are formatted this way
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
//when loading all the content, Twitter items are formatted this way
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

//when loading all the content, Instagram items are formatted this way
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
//clear all nodes when toggling between Filter buttons or Showing all items
function clearAll(){
  var mainNode = document.getElementById("main");
  while (mainNode.firstChild){
    mainNode.removeChild(mainNode.firstChild);
  }
}
