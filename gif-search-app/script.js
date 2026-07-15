// ===================================
//
// GIF SEARCH APP WEB DEMO ENGINE
//
// ===================================



// ===============================
// GIPHY API CONFIGURATION
// ===============================


const API_KEY = "1CMawfWOQqtNnV2sXv5ljDTj87h9iAO3";


const GIF_LIMIT = 12;



let selectedGif = null;


let favorites = JSON.parse(

    localStorage.getItem("gifFavorites")

) || [];



let searchTimer = null;







// ===============================
// START APP
// ===============================


document.addEventListener(

"DOMContentLoaded",

()=>{


    console.log(

    "GIF Search App Loaded"

    );


    setupSearch();


    displayFavorites();


    loadTrending();


}

);









// ===============================
// SEARCH INPUT
// ===============================


function setupSearch(){


    const input = document.getElementById(

        "gifSearch"

    );



    if(!input){

        console.error(

        "Search box missing"

        );

        return;

    }






    input.addEventListener(

    "keyup",

    ()=>{


        clearTimeout(

            searchTimer

        );





        searchTimer = setTimeout(()=>{


            const query = input.value.trim();





            if(query === ""){


                loadTrending();


                return;


            }





            searchGifs(query);



        },500);



    });



}









// ===============================
// SEARCH GIFS
// ===============================


async function searchGifs(query){


    try{


        updateStatus(

        "Searching..."

        );





        const response = await fetch(

        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=${GIF_LIMIT}`

        );





        const data = await response.json();





        console.log(

        "Search Results",

        data

        );





        const gifs = data.data.map(gif=>({



            id:gif.id,


            title:gif.title,


            url:gif.images.fixed_height.url,


            original:gif.images.original.url



        }));






        displayGifs(gifs);




        updateStatus(

        "Connected"

        );



    }



    catch(error){



        console.error(error);



        updateStatus(

        "API Error"

        );



    }



}









// ===============================
// TRENDING GIFS
// ===============================


async function loadTrending(){


    try{


        updateStatus(

        "Loading..."

        );





        const response = await fetch(

        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${GIF_LIMIT}`

        );






        const data = await response.json();





        console.log(

        "Trending Results",

        data

        );






        const gifs = data.data.map(gif=>({



            id:gif.id,


            title:gif.title,


            url:gif.images.fixed_height.url,


            original:gif.images.original.url



        }));






        displayGifs(gifs);





        updateStatus(

        "Connected"

        );



    }



    catch(error){



        console.error(error);



        updateStatus(

        "API Error"

        );



    }



}









// ===============================
// DISPLAY GIFS
// ===============================


function displayGifs(gifs){



    const container = document.getElementById(

        "gifResults"

    );





    if(!container)

        return;







    container.innerHTML = "";







    gifs.forEach(gif=>{



        const card = document.createElement(

            "div"

        );





        card.className =

        "gif-card";






        card.innerHTML = `

        
        <img

        src="${gif.url}"

        alt="${gif.title}"

        loading="lazy"

        >

        
        `;







        card.onclick = ()=>{


            selectGif(

                gif,

                card

            );


        };







        container.appendChild(card);



    });



}









// ===============================
// SELECT GIF
// ===============================


function selectGif(gif,card){



    selectedGif = gif;






    document.querySelectorAll(

        ".gif-card"

    )

    .forEach(item=>{


        item.classList.remove(

        "selected"

        );


    });







    card.classList.add(

        "selected"

    );







    document.getElementById(

        "selectedGif"

    ).innerHTML = `


        <img

        src="${gif.url}"

        >

    `;



}









// ===============================
// COPY GIF URL
// ===============================


async function copyGif(){



    if(!selectedGif){


        showMessage(

        "Select a GIF first"

        );


        return;


    }






    try{


        await navigator.clipboard.writeText(

            selectedGif.original

        );






        showMessage(

        "GIF link copied ✓"

        );



    }



    catch(error){



        console.error(

        error

        );



        showMessage(

        "Copy failed"

        );



    }



}









// ===============================
// FAVORITES
// ===============================


function favoriteGif(){



    if(!selectedGif){


        showMessage(

        "Select a GIF first"

        );


        return;


    }







    const exists = favorites.some(

        gif =>

        gif.id === selectedGif.id

    );







    if(exists){



        showMessage(

        "Already saved"

        );



        return;


    }






    favorites.push(

        selectedGif

    );






    localStorage.setItem(

        "gifFavorites",

        JSON.stringify(

            favorites

        )

    );






    displayFavorites();





    showMessage(

    "Favorite saved ⭐"

    );



}









// ===============================
// DISPLAY FAVORITES
// ===============================


function displayFavorites(){



    const container = document.getElementById(

        "favoritesList"

    );





    if(!container)

        return;







    container.innerHTML = "";






    if(favorites.length === 0){



        container.innerHTML =

        "<p>No favorites saved</p>";



        return;


    }







    favorites.forEach(gif=>{



        const item = document.createElement(

            "div"

        );





        item.className =

        "favorite-item";







        item.innerHTML = `


        <img

        src="${gif.url}"

        >

        `;







        item.onclick = ()=>{


            selectedGif = gif;



            document.getElementById(

            "selectedGif"

            ).innerHTML = `


            <img

            src="${gif.url}"

            >

            `;


        };







        container.appendChild(item);



    });



}









// ===============================
// STATUS
// ===============================


function showMessage(text){


    updateStatus(text);





    clearTimeout(

    window.statusTimer

    );






    window.statusTimer = setTimeout(()=>{


        updateStatus(

        "Connected"

        );


    },2000);



}







function updateStatus(text){



    const status = document.getElementById(

        "statusText"

    );





    if(status){


        status.innerHTML = text;


    }



}
