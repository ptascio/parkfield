# Bullring Birmingham Autumn Fashion Fix

## Retrieving Data
The first step of this task was to retrieve the data. It is located on Dropbox, in a file called ```posts.json```. At first, I tried to treat this link ```https://www.dropbox.com/sh/f4qh5ia7dtnodml/AAAcI5l4Ubxq2_4xrKCpzTfua/posts.json?dl=0as``` as an endpoint and hit it through an ajax call. I got the expected ```No Access-Control-Allow-Origin``` error. Being that this task should require no backend code, I was stumped.

### Dropbox API
After some research, it looked like I could build my own app, copy the ```posts.json``` file over to it,  and then use the Dropbox API to make ajax calls. I followed these instructions for making an app: ```https://www.dropbox.com/developers```. I then created an auth token, and was able to retrieve the data.

### But that didn't quite work...
I was getting the data using the ```/files GET``` url structure ```https://content.dropboxapi.com/1/files/auto/<path>```, but couldn't parse it into JSON. After much struggle, I copy and pasted the data directly from the file into ```json.lint```. According to the site, line ```562``` had a trailing comma and line ```702``` lacked a comma. Thinking that I had made a mistake when I copied the original file to my Dropbox app, I double checked the file I had copied with the original file and both had the same errors. I fixed the errors in my copy of the file and from there was able to access the data as JSON.

## First Steps
When this code runs, it retrieves ALL of the data from the JSON file and stores it in a variable called ```content```. Initially, the user can view the data 3 items at a time, and load more items by clicking the ```Load More``` button at the bottom right of the page.

### Why 3 items at a time?
In order to fulfill the responsive design requirement of this task I chose to use ```Bootstrap```. This allowed me to write css code that will scale easily. Each of my item rows contain ```col-sm-4``` divs a piece, and 3 x 4 = 12.

## Filtering
I thought it would be fun to create individual buttons for each type of post. For example, if a user clicks the ```Twitter``` button, only those posts associated with twitter will load.

### Loading More
As pointed out in the task, if this were actually making API calls, there would be some sort of limit on how many items to retrieve. But I am merely filtering out the appropriate items from my ```content``` container from the initial call. So if the user repeatedly clicks one of the filter buttons, the code simply filters the content container and send up the same data, again and again. The instructions said this was to be expected.

### DRYing up the code
I acknowledge this code needs to be more DRY. For example, my filtering functions all share certain characteristics. BUT they also differ in significant ways. (I.E., both the Instagram and Manual items have photos associated with them, Twitter items do not. Twitter and Manual text can have URLs within them, Instagram text will not. Additionally, the Twitter text needs to be parsed to find the URLs, while the Manual items have ```link_text``` and ```link``` attributes, making the Twitter URLs more difficult to find and display.) These differences made it appealing to just write 3 separate functions that share characteristics.

## Adding and Removing Rows and Columns
When a user jumps around using the filtering buttons or loading all of the data, it is necessary to first delete the items we don't want the user to see before appending the appropriate content. Here is a basic overview of what is going on:

### All Data to Filter
  1. If the user has first loaded all of the content, then the content will first be wiped from the page.
  2. If the user is coming from one of the filter buttons, then all content will be deleted according to the current content's classname.
  3. Content will be rendered according to the current filter's classname, so if the filter is repeatedly called, more items will load.

### Filter to All Data
  1. If a user switches from a filter to loading all of the content, all content will be wiped and then items will be called starting at the beginning of the content container.
  2. However, if a user is already rendering all of the items and calls the ```load more``` button repeatedly, content is loaded 3 items at a time until all content has been loaded.  
