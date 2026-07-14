// ===================================
// AUTOMATION STUDIO WEB DEMO ENGINE
// Enhanced Simulation Version
// ===================================


// ===============================
// LOAD SAVED SNIPPETS
// ===============================


let snippets =
    JSON.parse(
        localStorage.getItem("automationSnippets")
    )
    ||
    {

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



let currentKeyword = "hello";

let triggerTimer;








// ===============================
// SAVE TO BROWSER STORAGE
// ===============================


function saveStorage(){


    localStorage.setItem(
        "automationSnippets",
        JSON.stringify(snippets)
    );


}









// ===============================
// LOAD SNIPPET
// ===============================


function loadSnippet(keyword){


    if(!snippets[keyword])
        return;



    currentKeyword = keyword;



    document.getElementById(
        "keyword"
    ).value = keyword;



    document.getElementById(
        "script"
    ).value =
    snippets[keyword].script;



}









// ===============================
// CREATE NEW SNIPPET
// ===============================


function newSnippet(){


    let name =
    prompt(
        "Enter new trigger keyword:"
    );



    if(!name)
        return;



    name =
    name
    .trim()
    .toLowerCase();



    if(snippets[name]){


        alert(
            "This keyword already exists."
        );


        return;


    }



    snippets[name] = {


        script:
        ""

    };



    saveStorage();



    loadSnippet(name);



    refreshSnippetList();



}









// ===============================
// SAVE SNIPPET
// ===============================


function saveSnippet(){


    let keyword =
    document.getElementById(
        "keyword"
    )
    .value
    .trim()
    .toLowerCase();



    let script =
    document.getElementById(
        "script"
    )
    .value;





    if(keyword === ""){


        alert(
            "Keyword cannot be empty."
        );


        return;


    }





    snippets[keyword] = {


        script:script


    };




    currentKeyword =
    keyword;




    saveStorage();



    refreshSnippetList();



    showMessage(
        "Snippet saved ✓"
    );



}

// ===============================
// SIDEBAR SEARCH
// ===============================


function searchSnippets(){


    let query =
    document.getElementById(
        "search"
    )
    .value
    .toLowerCase();



    let buttons =
    document.querySelectorAll(
        "#snippetList button"
    );



    buttons.forEach(btn=>{


        let name =
        btn.innerText
        .toLowerCase();



        if(
            name.includes(query)
        ){

            btn.style.display =
            "block";

        }
        else{

            btn.style.display =
            "none";

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



        button.onclick =
        function(){

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



    let start =
    editor.selectionStart;



    let end =
    editor.selectionEnd;



    let text =
    editor.value;



    editor.value =
        text.substring(0,start)
        +
        command
        +
        text.substring(end);



    editor.focus();



}









// ===============================
// DEBOUNCE TYPING
// SIMULATES DESKTOP LISTENER
// ===============================


function debouncedTrigger(){


    clearTimeout(
        triggerTimer
    );



    triggerTimer =
    setTimeout(()=>{


        checkTrigger();



    },400);



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



    let matched =
    null;





    Object.keys(snippets)
    .forEach(keyword=>{


        let regex =
        new RegExp(
            "\\b"
            +
            keyword
            +
            "\\b",
            "i"
        );



        if(
            regex.test(value)
        ){

            matched =
            keyword;

        }



    });






    if(matched){



        setStatus(
            "running"
        );



        let output =
        executeScript(
            snippets[matched]
            .script
        );




        document.getElementById(
            "result"
        )
        .innerHTML =
        output;




        // simulate keyword replacement


        box.value =
        value.replace(
            new RegExp(
                matched,
                "i"
            ),
            ""
        )
        .trim();





        setTimeout(()=>{


            setStatus(
                "active"
            );



        },1200);



    }



}









// ===============================
// SIMULATED AUTOMATION ENGINE
// ===============================


function executeScript(script){


    let result =
    script;





    // DATE COMMAND


    result =
    result.replace(

        "{date}",

        new Date()
        .toLocaleDateString()

    );






    // SLEEP COMMAND


    result =
    result.replace(

        /\{sleep:(.*?)\}/g,

        function(match,time){


            return (
                "[Waiting "
                +
                time
                +
                " seconds]"
            );


        }

    );







    // KEYBOARD COMMANDS


    result =
    result.replace(

        /\{(ctrl|alt|shift)\+(.*?)\}/gi,


        function(match,key,value){


            return (

                "[Keyboard Action: "
                +
                key
                +
                "+"
                +
                value
                +
                "]"

            );


        }

    );








    // MOUSE COMMANDS


    result =
    result.replace(

        /\{(click|doubleclick|move):(.*?)\}/gi,


        function(match,action,target){


            return (

                "[Mouse Action: "
                +
                action
                +
                " "
                +
                target
                +
                "]"

            );


        }

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
    )
    .value;



    let output =
    executeScript(script);



    document.getElementById(
        "result"
    )
    .innerHTML =
    output;



    setStatus(
        "running"
    );



    setTimeout(()=>{


        setStatus(
            "active"
        );


    },1000);



}









// ===============================
// DELETE SNIPPET
// ===============================


document
.querySelector(".delete")
.addEventListener(
"click",
function(){


    let keyword =
    document.getElementById(
        "keyword"
    )
    .value
    .trim();



    if(
        !keyword
    )
    return;




    if(
        snippets[keyword]
    ){



        delete snippets[keyword];



        refreshSnippetList();




        document.getElementById(
            "keyword"
        )
        .value = "";



        document.getElementById(
            "script"
        )
        .value = "";



        showMessage(
            "Snippet deleted"
        );


    }



});









// ===============================
// STATUS INDICATOR
// ===============================


function setStatus(state){


    let dot =
    document.getElementById(
        "statusDot"
    );



    let text =
    document.getElementById(
        "statusText"
    );





    if(
        state === "running"
    ){


        dot.style.color =
        "#facc15";


        text.innerHTML =
        "Running";


    }
    else{


        dot.style.color =
        "#22c55e";


        text.innerHTML =
        "Active";


    }



}









// ===============================
// STATUS MESSAGE
// ===============================


function showMessage(message){


    let result =
    document.getElementById(
        "result"
    );



    result.innerHTML =
    message;



    setTimeout(()=>{


        result.innerHTML =
        "Waiting...";



    },2500);



}









// ===============================
// LOCAL STORAGE SAVE
// SIMULATES APP SETTINGS
// ===============================


function saveToStorage(){


    localStorage.setItem(

        "automationSnippets",

        JSON.stringify(
            snippets
        )

    );


}









// ===============================
// LOAD SAVED SNIPPETS
// ===============================


function loadStorage(){


    let saved =
    localStorage.getItem(
        "automationSnippets"
    );



    if(saved){


        snippets =
        JSON.parse(
            saved
        );


    }



}









// ===============================
// AUTO SAVE WHEN SAVING
// ===============================


const originalSave =
saveSnippet;



saveSnippet =
function(){


    originalSave();



    saveToStorage();



};









// ===============================
// KEYBOARD SIMULATION
// ENTER TRIGGERS TEST
// ===============================


document
.getElementById(
    "triggerBox"
)
.addEventListener(
"keydown",
function(e){


    if(
        e.key === "Enter"
    ){


        checkTrigger();



    }



});









// ===============================
// INITIALIZE APP
// ===============================


let triggerTimer;



loadStorage();



refreshSnippetList();



if(
    snippets.hello
){

    loadSnippet(
        "hello"
    );

}
else{


    let first =
    Object.keys(
        snippets
    )[0];



    if(first){

        loadSnippet(
            first
        );

    }


}





setStatus(
    "active"
);
