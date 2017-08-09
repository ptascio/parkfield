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
  success: function (response) {

  },
  error: function (error) {
  },
});
}



function showThings(){
  debugger
}
