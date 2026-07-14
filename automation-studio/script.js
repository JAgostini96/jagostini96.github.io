/* =====================================================
   Automation Studio Web Version
   script.js

   PART 1
   Core App + Storage + Snippet Management
===================================================== */


/* ==========================
   GLOBAL STATE
========================== */


const APP_NAME = "Automation Studio";


let scripts =
JSON.parse(
    localStorage.getItem("automationScripts")
) || {};



let selectedScript = null;


let automationEnabled = true;


let expansionCount = 0;



let typedBuffer = "";



/* ==========================
   DOM REFERENCES
========================== */


const keywordInput =
document.getElementById("keyword");



const editor =
document.getElementById("script");



const snippetList =
document.getElementById("snippetList");



const searchBox =
document.getElementById("search");



const triggerBox =
document.getElementById("triggerBox");



const saveButton =
document.getElementById("saveSnippet");



const deleteButton =
document.getElementById("deleteSnippet");



const newButton =
document.getElementById("newSnippetButton");



const testButton =
document.getElementById("testRun");



const result =
document.getElementById("result");



const statusText =
document.getElementById("statusText");



const statusDot =
document.getElementById("statusDot");





/* ==========================
   STORAGE
========================== */


function saveScripts(){

    localStorage.setItem(
        "automationScripts",
        JSON.stringify(scripts)
    );

}







/* ==========================
   INITIAL LOAD
========================== */


refreshScripts();

updateStatus();








/* ==========================
   SNIPPET LIST
========================== */


function refreshScripts(filter=""){


    if(!snippetList)
        return;



    snippetList.innerHTML="";



    let keys =
    Object.keys(scripts)
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
        document.createElement("button");



        button.textContent =
        keyword;



        if(keyword === selectedScript){

            button.style.background =
            "#2563eb";

        }



        button.onclick=function(){

            selectScript(keyword);

        };



        snippetList.appendChild(button);



    });





    if(snippetList.children.length===0){


        let empty =
        document.createElement("p");


        empty.textContent =
        "No snippets yet";


        empty.style.color =
        "#94a3b8";


        snippetList.appendChild(empty);


    }



}









/* ==========================
   SELECT SCRIPT
========================== */


function selectScript(keyword){


    if(!scripts[keyword])
        return;



    selectedScript =
    keyword;



    keywordInput.value =
    keyword;



    editor.value =
    scripts[keyword].script;



    refreshScripts();



    log(
        "Loaded snippet: "
        + keyword
    );


}










/* ==========================
   NEW SCRIPT
========================== */


newButton.onclick=function(){


    selectedScript =
    null;



    keywordInput.value =
    "";



    editor.value =
    "";



    refreshScripts();



    log(
        "New snippet"
    );


};









/* ==========================
   SAVE SCRIPT
========================== */


saveButton.onclick=function(){



    let keyword =
    keywordInput.value.trim();



    let body =
    editor.value.trim();





    if(keyword===""){


        log(
            "ERROR: Keyword required"
        );


        return;

    }





    if(body===""){


        log(
            "ERROR: Script empty"
        );


        return;

    }






    /*
       Handle rename
    */


    if(
        selectedScript &&
        selectedScript !== keyword &&
        scripts[selectedScript]
    ){


        delete scripts[selectedScript];


    }





    let old =
    scripts[keyword] || {};





    scripts[keyword]={


        script:body,


        uses:
        old.uses || 0,


        last_used:
        old.last_used || null,


        created:
        old.created ||
        new Date()
        .toISOString()


    };






    selectedScript =
    keyword;



    saveScripts();



    refreshScripts();



    updateStatus();



    log(
        "Saved: "
        + keyword
    );



};









/* ==========================
   DELETE SCRIPT
========================== */


deleteButton.onclick=function(){



    let keyword =
    selectedScript ||
    keywordInput.value.trim();





    if(!scripts[keyword]){


        log(
            "Nothing selected"
        );


        return;


    }






    delete scripts[keyword];



    saveScripts();



    selectedScript =
    null;



    keywordInput.value =
    "";



    editor.value =
    "";



    refreshScripts();



    updateStatus();



    log(
        "Deleted: "
        + keyword
    );


};








/* ==========================
   SEARCH
========================== */


if(searchBox){


searchBox.oninput=function(){


    refreshScripts(
        searchBox.value
    );


};


}









/* ==========================
   LOG SYSTEM
========================== */


function log(message){


    if(!result)
        return;



    result.textContent +=
    "\n\n"
    +
    message;


}







/* ==========================
   STATUS
========================== */


function updateStatus(){


    if(!statusText)
        return;




    if(automationEnabled){


        statusText.textContent =
        "Active";



        if(statusDot)
        statusDot.style.color =
        "#4ade80";


    }
    else{


        statusText.textContent =
        "Paused";



        if(statusDot)
        statusDot.style.color =
        "#ef4444";


    }



}

/* =====================================================
   Automation Studio Web Version

   PART 2
   Script Engine + Command Parser
===================================================== */


/* ==========================
   COMMAND REGISTRY
========================== */


const actions = {


    date(command){

        return new Date()
        .toLocaleDateString();

    },



    time(command){

        return new Date()
        .toLocaleTimeString();

    },



    sleep(command){


        let seconds =
        command
        .split(":")[1];



        return (
            "⏱ Wait "
            +
            seconds
            +
            " seconds"
        );


    },



    click(command){


        let position =
        command
        .split(":")[1];



        return (
            "🖱 Click "
            +
            position
        );


    },



    doubleclick(command){


        let position =
        command
        .split(":")[1];



        return (
            "🖱 Double Click "
            +
            position
        );


    },



    move(command){


        let position =
        command
        .split(":")[1];



        return (
            "🖱 Move Mouse "
            +
            position
        );


    },



    enter(command){

        return "⌨ Enter";

    },



    tab(command){

        return "⌨ Tab";

    },



    space(command){

        return "⌨ Space";

    },



    backspace(command){

        return "⌫ Backspace";

    },



    esc(command){

        return "⎋ Escape";

    }


};









/* ==========================
   COMMAND EXECUTION
========================== */


function executeCommand(command){



    command =
    command
    .toLowerCase()
    .trim();






    /*
       Exact commands

       {date}
       {enter}

    */


    if(actions[command]){


        return actions[command](command);


    }





    /*
       Prefix commands

       {sleep:1}
       {click:200,300}

    */


    for(let key in actions){



        if(
            command.startsWith(
                key + ":"
            )
        ){


            return actions[key](command);


        }


    }







    /*
       Hotkeys

       {ctrl+c}
       {alt+tab}

    */


    if(
        command.includes("+")
    ){


        return (
            "⌨ Hotkey ["
            +
            command
            +
            "]"
        );


    }






    /*
       Normal key press

       {a}
       {backspace}

    */


    return (

        "⌨ Key ["
        +
        command
        +
        "]"

    );


}









/* ==========================
   SCRIPT PARSER
========================== */


function parseScript(script){



    let parts =
    script.split(
        /(\{.*?\})/
    );



    let output = "";





    parts.forEach(part=>{



        if(!part)
            return;






        if(
            part.startsWith("{")
            &&
            part.endsWith("}")
        ){



            let command =
            part.substring(
                1,
                part.length - 1
            );



            output +=
            executeCommand(command);



        }

        else{


            output += part;


        }



    });




    return output;


}









/* ==========================
   TEST RUN
========================== */



if(testButton){



testButton.onclick=function(){



    let script =
    editor.value.trim();




    if(script===""){


        log(
            "Nothing to test"
        );


        return;


    }






    let preview =
    parseScript(script);






    result.textContent =

    "TEST RUN\n\n"

    +

    preview;



};

}









/* ==========================
   ACTION BUTTON INSERTS
========================== */



let actionButtons =
document.querySelectorAll(
    ".actions button"
);





actionButtons.forEach(button=>{



    button.onclick=function(){



        let command =
        this.dataset.command;





        if(command){


            editor.value +=
            command;



            editor.focus();


        }



    };



});

/* =====================================================
   Automation Studio Web Version

   PART 3
   Live Trigger Expansion Engine
===================================================== */


/* ==========================
   KEYBOARD BUFFER SYSTEM

   Mimics:

   keyboard_worker()

   from Python app

========================== */


let triggerBuffer = "";





if(triggerBox){



triggerBox.addEventListener(
"input",
function(){



    if(!automationEnabled)
        return;




    triggerBuffer =
    triggerBox.value;




    checkForExpansion();




});



}









/* ==========================
   CHECK TRIGGERS
========================== */


function checkForExpansion(){



    let currentText =
    triggerBuffer.toLowerCase();






    for(let keyword in scripts){



        let compareKeyword =
        keyword.toLowerCase();






        if(
            currentText.endsWith(
                compareKeyword
            )
        ){



            expandTrigger(keyword);



            return;



        }



    }



}









/* ==========================
   EXPAND SNIPPET

   Equivalent to:

   backspace keyword
   execute_script()

========================== */


function expandTrigger(keyword){



    let data =
    scripts[keyword];



    if(!data)
        return;







    /*
       Remove trigger word

       Example:

       hello

       becomes:

       ""

    */


    let remaining =

    triggerBuffer.substring(

        0,

        triggerBuffer.length -
        keyword.length

    );







    let expansion =
    parseScript(
        data.script
    );






    /*
       Replace text

    */


    triggerBox.value =
    remaining +
    expansion;





    triggerBuffer =
    triggerBox.value;








    /*
       Update statistics

    */


    data.uses =
    (data.uses || 0)+1;




    data.last_used =
    new Date()
    .toISOString();





    expansionCount++;





    saveScripts();



    updateStatus();






    result.textContent =

    "EXPANDED:\n\n"

    +

    expansion;



}









/* ==========================
   STATUS UPDATE

   Adds expansion count

========================== */


function updateStatus(){



    if(!statusText)
        return;





    if(automationEnabled){



        statusText.textContent =

        "Active  •  "

        +

        Object.keys(scripts).length

        +

        " snippets  •  "

        +

        expansionCount

        +

        " expanded";






        if(statusDot)

        statusDot.style.color =
        "#4ade80";



    }

    else{



        statusText.textContent =
        "Paused";



        if(statusDot)

        statusDot.style.color =
        "#ef4444";


    }




}









/* ==========================
   PAUSE BUTTON SUPPORT

   Optional if button exists

========================== */


const pauseButton =
document.getElementById("pauseAutomation");



if(pauseButton){



pauseButton.onclick=function(){



    automationEnabled =
    !automationEnabled;



    updateStatus();





};



}
