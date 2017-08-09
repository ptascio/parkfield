var manualItems;
var instaGramItems;
var twitterItems;

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
  },
});
}



function filterResults(type, container){
  var itemsArray = content["items "];
  container = itemsArray.filter(function(item, i){
    return item["service_name"] === type;
  });
console.log(container);
}
