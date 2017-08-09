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
  },
  error: function (error) {
  },
});
}



function showThings(){
  debugger
}
