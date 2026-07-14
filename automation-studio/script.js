/* ===================================
   AUTOMATION STUDIO WEB DEMO ENGINE
   PART 1 - CORE SYSTEM
=================================== */


/* ==========================
   GLOBAL STATE
========================== */


const STORAGE_KEY = "automationStudioSnippets";


let snippets =
JSON.parse(
    localStorage.getItem(STORAGE_KEY)
)
|| {};


let currentKeyword = null;


/* ==========================
   DOM REFERENCES
========================== */


const keywordInput =
document.getElementById("keyword");


const scriptEditor =
document.getElementById("script");


const snippetList =
document.getElementById("snippetList");


const searchBox =
document.getElementById("search");


const triggerBox =
document.getElementById("triggerBox");


const resultBox =
document.getElementById("result");


const statusText =
document.getElementById("statusText");


const newButton =
document.getElementById("newSnippetButton");


const saveButton =
document.getElementById("saveSnippet");


const deleteButton =
document.getElementById("deleteSnippet");


const testButton =
document.getElementById("testRun");


const clearLogButton =
document.getElementById("clearLog");



/* ==========================
   SAVE STORAGE
========================== */


function saveStorage(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(snippets)
    );

}



/* ==========================
   STARTUP
========================== */


document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        refreshSnippetList();

        updateStatus();

        log(
            "Automation Studio ready..."
        );

    }
);



/* ==========================
   REFRESH SIDEBAR
========================== */


function refreshSnippetList(
    filter=""
){


    snippetList.innerHTML = "";


    let keys =
    Object.keys(snippets)
    .sort();



    keys.forEach(keyword=>{


        if(
            filter &&
            !keyword
            .toLowerCase()
            .includes(
                filter.toLowerCase()
            )
        ){

            return;

        }



        let button =
        document.createElement(
            "button"
        );


        button.textContent =
        keyword;



        button.onclick =
        ()=>{

            loadSnippet(keyword);

        };



        snippetList.appendChild(
            button
        );



    });



    if(
        snippetList.children.length === 0
    ){


        let empty =
        document.createElement(
            "p"
        );


        empty.textContent =
        "No snippets saved";


        empty.style.color =
        "#9d9da7";


        snippetList.appendChild(
            empty
        );


    }


}





/* ==========================
   LOAD SNIPPET
========================== */


function loadSnippet(keyword){


    if(
        !snippets[keyword]
    ){

        return;

    }



    currentKeyword =
    keyword;



    keywordInput.value =
    keyword;



    scriptEditor.value =
    snippets[keyword].script;



    log(
        "Loaded snippet: "
        +
        keyword
    );


}





/* ==========================
   CREATE NEW SNIPPET
========================== */


function createNewSnippet(){


    currentKeyword = null;


    keywordInput.value = "";


    scriptEditor.value = "";


    keywordInput.focus();



    log(
        "New snippet created"
    );


}





/* ==========================
   SAVE SNIPPET
========================== */


function saveSnippet(){


    let keyword =
    keywordInput.value
    .trim()
    .toLowerCase();



    let script =
    scriptEditor.value
    .trim();




    if(
        keyword === ""
    ){

        log(
            "ERROR: Keyword required"
        );

        return;

    }




    if(
        script === ""
    ){

        log(
            "ERROR: Script required"
        );

        return;

    }





    /*
       Rename support

       If editing hello
       and changing it to hi,
       remove old entry
    */


    if(
        currentKeyword &&
        currentKeyword !== keyword
    ){

        delete snippets[currentKeyword];

    }






    snippets[keyword] = {

        script:script,

        created:
        new Date()
        .toISOString()

    };




    currentKeyword =
    keyword;



    saveStorage();


    refreshSnippetList();



    log(
        "Saved snippet: "
        +
        keyword
    );


}





/* ==========================
   DELETE SNIPPET
========================== */


function deleteSnippet(){


    let keyword =
    currentKeyword ||
    keywordInput.value
    .trim()
    .toLowerCase();




    if(
        !snippets[keyword]
    ){

        log(
            "Nothing selected"
        );

        return;

    }





    delete snippets[keyword];


    saveStorage();



    currentKeyword = null;


    keywordInput.value = "";


    scriptEditor.value = "";



    refreshSnippetList();



    log(
        "Deleted snippet: "
        +
        keyword
    );


}





/* ==========================
   SEARCH
========================== */


function searchSnippets(){


    refreshSnippetList(
        searchBox.value
    );


}

/* ===================================
   AUTOMATION STUDIO WEB DEMO ENGINE
   PART 2 - TRIGGER ENGINE
=================================== */


// ===============================
// SCRIPT EXECUTION ENGINE
// ===============================

function executeScript(script){


    let result = script;



    // DATE

    result = result.replace(
        /\{date\}/g,
        new Date().toLocaleDateString()
    );



    // TIME

    result = result.replace(
        /\{time\}/g,
        new Date().toLocaleTimeString()
    );



    // SLEEP

    result = result.replace(
        /\{sleep:(.*?)\}/g,
        function(match, seconds){

            return `[Waiting ${seconds} seconds]`;

        }
    );



    // ENTER KEY

    result = result.replace(
        /\{enter\}/gi,
        "[Keyboard: ENTER]"
    );



    // TAB KEY

    result = result.replace(
        /\{tab\}/gi,
        "[Keyboard: TAB]"
    );



    // SPACE KEY

    result = result.replace(
        /\{space\}/gi,
        "[Keyboard: SPACE]"
    );



    // BACKSPACE

    result = result.replace(
        /\{backspace\}/gi,
        "[Keyboard: BACKSPACE]"
    );



    // COPY

    result = result.replace(
        /\{ctrl\+c\}/gi,
        "[Keyboard Shortcut: CTRL+C]"
    );



    // PASTE

    result = result.replace(
        /\{ctrl\+v\}/gi,
        "[Keyboard Shortcut: CTRL+V]"
    );



    // CUT

    result = result.replace(
        /\{ctrl\+x\}/gi,
        "[Keyboard Shortcut: CTRL+X]"
    );



    // SAVE

    result = result.replace(
        /\{ctrl\+s\}/gi,
        "[Keyboard Shortcut: CTRL+S]"
    );



    // MOUSE CLICK

    result = result.replace(
        /\{click:(.*?)\}/g,
        function(match, location){

            return `[Mouse Click: ${location}]`;

        }
    );



    // DOUBLE CLICK

    result = result.replace(
        /\{doubleclick:(.*?)\}/g,
        function(match, location){

            return `[Double Click: ${location}]`;

        }
    );



    // MOVE MOUSE

    result = result.replace(
        /\{move:(.*?)\}/g,
        function(match, location){

            return `[Move Mouse: ${location}]`;

        }
    );



    // HOTKEY SUPPORT

    result = result.replace(
        /\{(ctrl|alt|shift)\+(.*?)\}/g,
        function(match,key,value){

            return `[Keyboard Shortcut: ${key.toUpperCase()}+${value}]`;

        }
    );



    return result.replace(
        /\n/g,
        "<br>"
    );


}



/* ==========================
   LIVE TRIGGER SYSTEM
========================== */


/*
    This simulates the desktop app.

    It watches what the user types.

    When a saved keyword appears,
    it replaces ONLY that keyword.

    It does NOT clear the box.

    It does NOT write to the log.
*/


function checkTrigger(){


    let text =
    triggerBox.value;



    let cursor =
    triggerBox.selectionStart;



    let beforeCursor =
    text.substring(
        0,
        cursor
    );



    let matchedKeyword = null;



    Object.keys(snippets)
    .forEach(keyword=>{


        let lowerText =
        beforeCursor
        .toLowerCase();



        if(
            lowerText.endsWith(
                keyword.toLowerCase()
            )
        ){

            matchedKeyword =
            keyword;

        }


    });





    if(
        !matchedKeyword
    ){

        return;

    }





    let expansion =
    executeScript(
        snippets[matchedKeyword].script
    );





    /*
       Replace only the keyword
    */


    let start =
    cursor -
    matchedKeyword.length;



    let newText =

    text.substring(
        0,
        start
    )

    +

    expansion

    +

    text.substring(
        cursor
    );





    triggerBox.value =
    newText;





    /*
       Put cursor after expansion
    */


    let newCursor =
    start +
    expansion.length;



    triggerBox.selectionStart =
    newCursor;


    triggerBox.selectionEnd =
    newCursor;





    /*
       Prevent same keyword
       from firing repeatedly
    */


    triggerBox.dataset.lastExpansion =
    expansion;




}






/* ==========================
   TRIGGER INPUT LISTENER
========================== */


triggerBox.addEventListener(
    "input",
    ()=>{


        checkTrigger();


    }
);






/* ==========================
   COMMAND BUTTON INSERTS
========================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


document
.querySelectorAll(
    ".actions button"
)
.forEach(button=>{


    button.addEventListener(
        "click",
        ()=>{


            let command =
            button.dataset.command;


            let start =
            scriptEditor.selectionStart;


            let end =
            scriptEditor.selectionEnd;


            let text =
            scriptEditor.value;



            scriptEditor.value =

            text.substring(
                0,
                start
            )

            +

            command

            +

            text.substring(
                end
            );



            let cursor =
            start +
            command.length;



            scriptEditor.selectionStart =
            cursor;


            scriptEditor.selectionEnd =
            cursor;



            scriptEditor.focus();


        }
    );


});


});






/* ==========================
   TEST SCRIPT
========================== */


function testScript(){


    let script =
    scriptEditor.value;



    if(
        script.trim()===""
    ){

        log(
            "Nothing to test"
        );


        return;

    }




    let output =
    executeScript(
        script
    );




    log(
        "TEST OUTPUT:\n\n"
        +
        output
    );



}






/* ==========================
   EXECUTION LOG
========================== */


function log(message){


    if(
        !resultBox
    ){

        return;

    }



    if(
        resultBox.textContent
        ===
        "Automation Studio ready..."
    ){

        resultBox.textContent =
        "";

    }




    resultBox.textContent +=

    message

    +

    "\n\n";



}





/* ==========================
   CLEAR LOG
========================== */


function clearLog(){


    resultBox.textContent =
    "Automation Studio ready...";


}






/* ==========================
   STATUS
========================== */


function updateStatus(){


    if(statusText){

        statusText.textContent =
        "Ready";

    }


}

/* ===================================
   AUTOMATION STUDIO WEB DEMO ENGINE
   PART 3 - BUTTON CONNECTIONS
=================================== */


/* ==========================
   BUTTON EVENTS
========================== */


/*
   New Snippet
*/

if(newButton){

    newButton.addEventListener(
        "click",
        ()=>{

            createNewSnippet();

        }
    );

}





/*
   Save Snippet
*/

if(saveButton){

    saveButton.addEventListener(
        "click",
        ()=>{

            saveSnippet();

        }
    );

}





/*
   Delete Snippet
*/

if(deleteButton){

    deleteButton.addEventListener(
        "click",
        ()=>{

            deleteSnippet();

        }
    );

}





/*
   Test Script
*/

if(testButton){

    testButton.addEventListener(
        "click",
        ()=>{

            testScript();

        }
    );

}





/*
   Clear Execution Log
*/

if(clearLogButton){

    clearLogButton.addEventListener(
        "click",
        ()=>{

            clearLog();

        }
    );

}





/*
   Search Snippets
*/

if(searchBox){

    searchBox.addEventListener(
        "input",
        ()=>{

            searchSnippets();

        }
    );

}





/* ==========================
   INITIAL DEFAULT DATA
========================== */


/*
   Only creates examples if
   the user has never saved
   anything.

   Prevents the old
   keyword 0 issue.
*/


function createDefaultSnippets(){


    let hasSaved =
    Object.keys(snippets)
    .length > 0;



    if(hasSaved){

        return;

    }




    snippets = {

        hello:{

            script:
            "Hello! This is an automated message."

        },

        email:{

            script:
            "Hello,\n\nI wanted to follow up regarding our previous conversation.\n\nThank you."

        },

        meeting:{

            script:
            "Meeting scheduled for {date}"

        }


    };



    saveStorage();


}





/* ==========================
   FINAL STARTUP
========================== */


function initializeAutomationStudio(){


    createDefaultSnippets();



    refreshSnippetList();



    if(
        Object.keys(snippets).length > 0
    ){

        let first =
        Object.keys(snippets)[0];


        loadSnippet(first);

    }



    clearLog();



    updateStatus();



}





/* ==========================
   START APP
========================== */


initializeAutomationStudio();
