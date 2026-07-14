/* =====================================================
   Automation Studio Web Version
   script.js
   Part 1 - Core Engine
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


const saveButton =
document.getElementById("saveSnippet");


const deleteButton =
document.getElementById("deleteSnippet");


const newButton =
document.getElementById("newSnippetButton");


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



        button.onclick=function(){

            selectScript(keyword);

        };



        snippetList.appendChild(button);



    });



    if(snippetList.children.length===0){


        let empty =
        document.createElement("p");


        empty.style.color="#94a3b8";


        empty.textContent =
        "No snippets yet";


        snippetList.appendChild(empty);


    }


}





/* ==========================
   SELECT SCRIPT
========================== */


function selectScript(keyword){


    if(!scripts[keyword])
        return;



    selectedScript = keyword;



    keywordInput.value =
    keyword;



    editor.value =
    scripts[keyword].script;



    log(
        "Loaded snippet: "
        + keyword
    );


}





/* ==========================
   NEW SCRIPT
========================== */


newButton.onclick=function(){


    selectedScript=null;


    keywordInput.value="";


    editor.value="";


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





    let oldData =
    scripts[keyword] || {};




    /*
       Rename support:
       If user selects hello,
       changes keyword to hi,
       old hello gets removed
    */


    if(
        selectedScript &&
        selectedScript !== keyword &&
        scripts[selectedScript]
    ){

        delete scripts[selectedScript];

    }





    scripts[keyword]={


        script:body,


        uses:
        oldData.uses || 0,


        last_used:
        oldData.last_used || null,


        created:
        oldData.created ||
        new Date().toISOString()


    };



    selectedScript =
    keyword;



    saveScripts();


    refreshScripts();



    log(
        "Saved: "
        + keyword
    );



    updateStatus();



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



    selectedScript=null;



    keywordInput.value="";

    editor.value="";



    refreshScripts();



    log(
        "Deleted: "
        + keyword
    );



};







/* ==========================
   SEARCH
========================== */


searchBox.oninput=function(){


    refreshScripts(
        searchBox.value
    );


};







/* ==========================
   LOG SYSTEM
========================== */


function log(message){


    result.textContent +=
    "\n\n"
    +
    message;


}







/* ==========================
   STATUS
========================== */


function updateStatus(){


    if(automationEnabled){


        statusText.textContent =
        "Active";


        statusDot.style.color =
        "#4ade80";


    }
    else{


        statusText.textContent =
        "Paused";


        statusDot.style.color =
        "#ef4444";


    }


}







/* ==========================
   PAUSE TOGGLE
========================== */


function toggleAutomation(){


    automationEnabled =
    !automationEnabled;


    updateStatus();



    log(
        automationEnabled ?
        "Automation enabled":
        "Automation paused"
    );


}

/* =====================================================
   Automation Studio Web Version
   Part 2 - Script Engine
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


    enter(command){

        return "⌨ [Enter]";

    },


    tab(command){

        return "⌨ [Tab]";

    },


    space(command){

        return "⌨ [Space]";

    },


    backspace(command){

        return "⌨ [Backspace]";

    },


    sleep(command){


        let seconds =
        command
        .split(":")[1];


        return (
            "⏱ Waiting "
            +
            seconds
            +
            " seconds"
        );


    },


    click(command){


        let pos =
        command
        .split(":")[1];


        return (
            "🖱 Click "
            +
            pos
        );


    },


    doubleclick(command){


        let pos =
        command
        .split(":")[1];


        return (
            "🖱 Double Click "
            +
            pos
        );


    },


    move(command){


        let pos =
        command
        .split(":")[1];


        return (
            "🖱 Move Mouse "
            +
            pos
        );


    }



};







/* ==========================
   COMMAND HANDLER
========================== */


function executeCommand(command){


    command =
    command.toLowerCase();



    /*
       Exact matches
    */


    if(actions[command]){


        return actions[command](command);


    }



    /*
       Prefix commands

       sleep:1
       click:200,300
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

       ctrl+c
       alt+tab
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



    let output="";



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
                part.length-1
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


const testButton =
document.getElementById("testRun");



testButton.onclick=function(){



    let script =
    editor.value;



    if(!script){


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








/* ==========================
   COMMAND BUTTON INSERTS
========================== */


document
.querySelectorAll(
    ".actions button"
)
.forEach(button=>{


    button.onclick=function(){


        let command =
        this.dataset.command;



        editor.value +=
        command;



        editor.focus();


    };


});
