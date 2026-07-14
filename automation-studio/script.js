// ===================================

// AUTOMATION STUDIO WEB DEMO ENGINE

// ===================================





let snippets = {



    hello: {

        script: "Hello! This is an automated message."

    },



    email: {

        script: "Hello,\n\nI wanted to follow up regarding our previous conversation.\n\nThank you."

    },



    meeting: {

        script: "Meeting scheduled for {date}"

    }



};







let currentKeyword = "hello";



// ===============================
// LOAD SNIPPET
// ===============================

function loadSnippet(keyword){


    if(!snippets[keyword])

        return;



    currentKeyword = keyword;



    document.getElementById("keyword").value = keyword;



    document.getElementById("script").value =
    snippets[keyword].script;



    // update selected highlight

    refreshSnippetList();


}

function newSnippet(){


    currentKeyword = null;


    document.getElementById("keyword").value = "";


    document.getElementById("script").value = "";


    refreshSnippetList();


    document.getElementById("keyword").focus();


    showMessage(
        "Enter a new keyword and script"
    );


}

// ===============================

// SAVE SNIPPET

// ===============================





function saveSnippet(){





    let keyword =

    document.getElementById("keyword").value.trim();





    let script =

    document.getElementById("script").value;







    if(keyword === "")

        return;







    // remove old name if renamed

if(
    currentKeyword &&
    currentKeyword !== keyword
){

    delete snippets[currentKeyword];

}


snippets[keyword] = {

    script:script

};







    currentKeyword = keyword;





    refreshSnippetList();







    showMessage(

        "Snippet saved ✓"

    );





}


// ===============================
// DELETE SNIPPET
// ===============================

function deleteSnippet(){


    if(!currentKeyword){


        showMessage(
            "No snippet selected"
        );


        return;

    }




    delete snippets[currentKeyword];



    currentKeyword = null;



    document.getElementById("keyword").value = "";



    document.getElementById("script").value = "";



    refreshSnippetList();



    showMessage(
        "Snippet deleted ✓"
    );


}
// ===============================

// SIDEBAR SEARCH

// ===============================





function searchSnippets(){





    let query =

    document.getElementById("search")

    .value

    .toLowerCase();







    let buttons =

    document.querySelectorAll(

        "#snippetList button"

    );







    buttons.forEach(btn=>{





        if(

            btn.innerText

            .toLowerCase()

            .includes(query)

        ){



            btn.style.display="block";



        }

        else{



            btn.style.display="none";



        }





    });





}

// ===============================
// REFRESH SIDEBAR
// ===============================

function refreshSnippetList(){


    let container =
    document.getElementById(
        "snippetList"
    );



    container.innerHTML = "";



    Object.keys(snippets)
    .forEach(keyword=>{


        let button =
        document.createElement(
            "button"
        );



        button.innerText =
        keyword;



        // Highlight selected snippet

        if(keyword === currentKeyword){

            button.classList.add(
                "selected"
            );

        }



        button.onclick =
()=>{

    currentKeyword = keyword;

    loadSnippet(keyword);

};



        container.appendChild(
            button
        );


    });


}


// ===============================

// INSERT COMMANDS

// ===============================





function insertCommand(command){





    let editor =

    document.getElementById(

        "script"

    );





    editor.value += command;





    editor.focus();





}



















// ===============================

// AUTOMATION TRIGGER SYSTEM

// ===============================





function checkTrigger(){





    let box =

    document.getElementById(

        "triggerBox"

    );







    let value =

    box.value;







    let matched = null;







    Object.keys(snippets)

    .forEach(keyword=>{





        if(

            value.toLowerCase()

            .endsWith(

                keyword.toLowerCase()

            )

        ){



            matched = keyword;



        }





    });











   if(matched){


    clearTimeout(window.messageTimer);


    let output =

    executeScript(

        snippets[matched].script

    );


    document.getElementById(

        "result"

    ).innerHTML = output;


    box.value="";


}


// ===============================

// SIMULATED SCRIPT ENGINE

// ===============================





function executeScript(script){







    let result = script;







    // DATE COMMAND



    result =

    result.replace(

        "{date}",

        new Date()

        .toLocaleDateString()

    );









    // WAIT COMMAND



    result =

    result.replace(

        /\{sleep:(.*?)\}/g,

        "[Waiting $1 seconds]"

    );











    // HOTKEYS



    result =

    result.replace(

        /\{(ctrl|alt|shift)\+(.*?)\}/g,

        "[Keyboard: $1+$2]"

    );











    // MOUSE



    result =

    result.replace(

        /\{(click|doubleclick|move):(.*?)\}/g,

        "[Mouse Action: $1 $2]"

    );











    return result.replace(

        /\n/g,

        "<br>"

    );





}



















// ===============================

// TEST RUN BUTTON

// ===============================





function testRun(){





    let script =

    document.getElementById(

        "script"

    ).value;







    document.getElementById(

        "result"

    ).innerHTML =

    executeScript(script);





}



















// ===============================

// STATUS MESSAGE

// ===============================

function showMessage(text){

    let result =
    document.getElementById(
        "result"
    );


    result.innerHTML = text;


    clearTimeout(window.messageTimer);


    window.messageTimer = setTimeout(()=>{


        result.innerHTML =
        "Waiting...";


    },2000);


}

}

