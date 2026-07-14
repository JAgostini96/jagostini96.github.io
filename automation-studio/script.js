/* =========================================
   Automation Studio Web Demo
   script.js
========================================= */


let snippets = JSON.parse(
    localStorage.getItem("automationSnippets")
) || [];


let selectedSnippet = null;


/* =========================
   DOM ELEMENTS
========================= */

const keywordInput = document.getElementById("keyword");
const scriptInput = document.getElementById("script");

const snippetList = document.getElementById("snippetList");

const saveButton = document.getElementById("saveSnippet");
const deleteButton = document.getElementById("deleteSnippet");
const newButton = document.getElementById("newSnippetButton");

const searchBox = document.getElementById("search");

const triggerBox = document.getElementById("triggerBox");

const result = document.getElementById("result");

const testButton = document.getElementById("testRun");

const clearButton = document.getElementById("clearLog");

const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");



/* =========================
   LOAD START
========================= */

renderSnippets();



/* =========================
   SAVE DATA
========================= */


function saveStorage(){

    localStorage.setItem(
        "automationSnippets",
        JSON.stringify(snippets)
    );

}



/* =========================
   DISPLAY SNIPPETS
========================= */


function renderSnippets(filter=""){


    snippetList.innerHTML="";


    snippets
    .filter(item =>
        item.keyword
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .forEach((item,index)=>{


        let button=document.createElement("button");


        button.textContent=item.keyword;


        button.onclick=function(){

            loadSnippet(index);

        };


        snippetList.appendChild(button);


    });


}



/* =========================
   LOAD SNIPPET
========================= */


function loadSnippet(index){


    selectedSnippet=index;


    let item=snippets[index];


    keywordInput.value=item.keyword;

    scriptInput.value=item.script;


    log(
        "Loaded snippet: "
        + item.keyword
    );


}



/* =========================
   NEW SNIPPET
========================= */


newButton.onclick=function(){


    selectedSnippet=null;


    keywordInput.value="";

    scriptInput.value="";


    log(
        "New snippet created"
    );


};



/* =========================
   SAVE SNIPPET
========================= */


saveButton.onclick=function(){


    let keyword =
        keywordInput.value.trim();


    let script =
        scriptInput.value.trim();



    if(keyword===""){

        log(
            "Error: Keyword required"
        );

        return;

    }



    let snippet={

        keyword,
        script

    };



    if(selectedSnippet !== null){


        snippets[selectedSnippet]=snippet;


    }
    else{


        snippets.push(snippet);


    }



    saveStorage();


    renderSnippets();


    updateStatus(
        "Saved"
    );


    log(
        "Saved snippet: "
        + keyword
    );



};




/* =========================
   DELETE SNIPPET
========================= */


deleteButton.onclick=function(){


    if(selectedSnippet===null){

        log(
            "No snippet selected"
        );

        return;

    }



    let removed =
        snippets[selectedSnippet].keyword;



    snippets.splice(
        selectedSnippet,
        1
    );



    selectedSnippet=null;


    saveStorage();


    renderSnippets();


    keywordInput.value="";

    scriptInput.value="";



    log(
        "Deleted: "
        + removed
    );



};





/* =========================
   SEARCH
========================= */


searchBox.oninput=function(){


    renderSnippets(
        searchBox.value
    );


};





/* =========================
   COMMAND BUTTONS
========================= */


document
.querySelectorAll(".actions button")
.forEach(button=>{


    button.onclick=function(){


        let command =
            this.dataset.command;



        scriptInput.value +=
            command;



        scriptInput.focus();


    };


});





/* =========================
   TEST SCRIPT
========================= */


testButton.onclick=function(){


    let script =
        scriptInput.value;



    if(script===""){

        log(
            "Nothing to run"
        );

        return;

    }



    updateStatus(
        "Running"
    );



    log(
        "Executing script..."
    );



    setTimeout(()=>{


        executePreview(
            script
        );


        updateStatus(
            "Ready"
        );


    },700);



};





/* =========================
   SIMULATED ENGINE
========================= */


function executePreview(script){


    let output =
        "Execution Complete\n\n";


    if(script.includes("{date}")){


        output +=
        "Inserted Date: "
        + new Date()
        .toLocaleDateString()
        + "\n";


    }



    if(script.includes("{time}")){


        output +=
        "Inserted Time: "
        + new Date()
        .toLocaleTimeString()
        + "\n";


    }



    if(script.includes("{enter}")){


        output +=
        "Pressed Enter\n";


    }



    if(script.includes("{tab}")){


        output +=
        "Pressed Tab\n";


    }



    if(script.includes("{click:left}")){


        output +=
        "Mouse Left Click\n";


    }



    if(
        output==="Execution Complete\n\n"
    ){

        output += script;

    }



    result.textContent =
        output;



}





/* =========================
   LIVE TRIGGER SYSTEM
========================= */


let buffer="";



triggerBox.addEventListener(
"keydown",
function(e){



    if(
        e.key.length===1
    ){

        buffer += e.key;


    }



    if(
        e.key===" " ||
        e.key==="Enter" ||
        e.key==="." ||
        e.key===","
    ){


        checkTrigger();


        buffer="";


    }



});





function checkTrigger(){


    let match =
        snippets.find(
            item =>
            item.keyword === buffer
        );



    if(match){


        let text =
            triggerBox.value;



        text =
        text.substring(
            0,
            text.length-buffer.length
        );



        triggerBox.value =
            text
            +
            match.script;



        log(
            "Expanded keyword: "
            + match.keyword
        );



    }



}




/* =========================
   LOGGING
========================= */


function log(message){


    result.textContent +=
        "\n\n"
        +
        message;



}




clearButton.onclick=function(){


    result.textContent =
    "Automation Studio ready...";



};





/* =========================
   STATUS
========================= */


function updateStatus(text){


    statusText.textContent=text;



    if(text==="Running"){


        statusDot.style.color=
        "#facc15";


    }
    else{


        statusDot.style.color=
        "#4ade80";


    }



}
