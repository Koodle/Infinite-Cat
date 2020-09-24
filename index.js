//Problems & Solutions:
// 1) problem is that the scroll function is triggered multiple times
//    before the fetch(apiURL) can be completed so to fix this i added a bolean called active 

// 2) To achieve the masonry style of photos had to use bootstrap cardcolumns but the transition
//    of adding more photos is stil abit ugly. in full screen mode the column futherest to the left
//    does not change but all the other ones to the right jump up when photos are added. 
//	  FIX: Maybe i could create a new cardCoulumn everytime i load photos instead of just appending it.

var photoDATA = []; //will be a js object so use dot notation
var active = false; //Boolean to stop the scoll event listener from calling getData()
// multiple times before it can finish fetching and displaying 

// Unsplash API parameters
const query = "cats";
const per_page = "10";
const clientID = "Bz7cwx1M6OBq4hAosm5g1j-6DbSrVSzjGukEmLtbmss";
var pageNumber = 1;  


//Access the API
async function getData() {   
    try {
        
        // Unsplash API URL  
        var apiURL = "https://api.unsplash.com/search/photos/?query=" + query + "&per_page=" + per_page + "&page=" + pageNumber + "&client_id=" + clientID;
        
        //Fetch JSON data from Unsplash
        var response = await fetch(apiURL);
        photoDATA = await response.json();

        console.log(photoDATA);
        console.log(apiURL);

        displayCats();    

    } catch (error) {
        console.log(error);
    }
}

async function displayCats() { 

    for (var i = 0; i < per_page; i++) {

        let imgTitle = photoDATA.results[i].alt_description; // img (title attribute
        let linkToUnsplash = photoDATA.results[i].links.html; //a (href attribute
        let imgURL = photoDATA.results[i].urls.small; // img (src attribute)

        $(".card-columns").append(
            "<div class='card'>" +
            "<a target='_blank' href=" + "'" + linkToUnsplash + "'>" + "<img class='card-img img-fluid' src=" + "'" + imgURL + "'" + "alt='' title=" + "'" + imgTitle + "'" + "></a>" +
            "</div>"); 
    }
    photoDATA = [];  
    pageNumber +=1;
}

//Scroll Event Listener

$(window).scroll(async function () {  //Problem is this function is ran everytime i scroll so if i scroll above 80 multiple times then the function is ran multiple times. 

    var winheight = $(window).height(); //height of browser window
    var docheight = $(document).height(); //height of entire document
    var trackLength = docheight - winheight  //when we minus these two values we get the total average scrollable area
    var scrollTop = $(window).scrollTop(); //Distance from top of the page the user has scrolled (will increase the more they scroll)
    
    var pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 NaN if tracklength == 0)
    // console.log(pctScrolled + '% scrolled')  to print out the percentage scrolled

    if  (active == true){
        return;
    }else if (pctScrolled > 75) {
        active = true;
        await getData();  // THIS AWAIT IS VERY IMPORTANT 
        active = false
    }
    
});

// This is a shorter way to add scroll event listener
// $(window).scroll(function() {
//     if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
//         getData();
//     }
//  });

getData();
