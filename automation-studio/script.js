// ===================================
// AUTOMATION STUDIO WEB DEMO ENGINE
// ===================================


// ===============================
// LOAD SAVED SNIPPETS
// ===============================


let snippets = JSON.parse(
    localStorage.getItem("automationSnippets")
) || {


    hello: {

        script:
        "Hello! This is an automated message."

    },


    email: {

        script:
        "Hello,\n\nI wanted to follow up regarding our previous conversation.\n\nThank you."

    },


    meeting: {

        script:
        "Meeting scheduled for {date}"

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



    document.getElementById(
        "keyword"
    ).value = keyword;



    document.getElementById(
        "script"
    ).value =
    snippets[keyword].script;



    highlightSnippet(keyword);



}







// ===============================
// CREATE NEW SNIPPET
// ===============================


function newSnippet(){


    let name = prompt(
        "Enter new trigger keyword:"
    );



    if(!name)
        return;



    if(snippets[name]){

        alert(
            "That keyword already exists."
        );

        return;

    }



    snippets[name] = {


        script:""


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
    document
    .getElementById("keyword")
    .value
    .trim();



    let script =
    document
    .getElementById("script")
    .value;




    if(keyword === ""){


        showMessage(
            "Enter a keyword first"
        );


        return;

    }




    snippets[keyword] = {


        script:script


    };



    currentKeyword = keyword;



    saveStorage();



    refreshSnippetList();



    showMessage(
        "Snippet saved ✓"
    );



}








// ===============================
// DELETE SNIPPET
// ===============================


function deleteSnippet(){


    if(!snippets[currentKeyword])
        return;



    delete snippets[currentKeyword];



    saveStorage();



    refreshSnippetList();



    document.getElementById(
        "keyword"
    ).value="";



    document.getElementById(
        "script"
    ).value="";



    showMessage(
        "Snippet deleted"
    );


}








// ===============================
// SAVE TO LOCAL STORAGE
// ===============================


function saveStorage(){


    localStorage.setItem(

        "automationSnippets",

        JSON.stringify(snippets)

    );


}








// ===============================
// SIDEBAR SEARCH
// ===============================


function searchSnippets(){


    let query =
    document
    .getElementById("search")
    .value
    .toLowerCase();



    document
    .querySelectorAll(
        "#snippetList button"
    )
    .forEach(button=>{


        button.style.display =
        button.innerText
        .toLowerCase()
        .includes(query)

        ? "block"

        : "none";


    });

// ===============================
// REFRESH SIDEBAR
// ===============================


function refreshSnippetList(){


    let container =
    document.getElementById(
        "snippetList"
    );



    container.innerHTML="";



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



        if(keyword === currentKeyword){

            button.classList.add(
                "active"
            );

        }



        container.appendChild(button);



    });



}









// ===============================
// HIGHLIGHT ACTIVE SNIPPET
// ===============================


function highlightSnippet(keyword){


    document
    .querySelectorAll(
        "#snippetList button"
    )
    .forEach(button=>{


        button.classList.remove(
            "active"
        );


        if(
            button.innerText === keyword
        ){

            button.classList.add(
                "active"
            );

        }


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
// AUTOMATION TRIGGER SYSTEM
// ===============================


function checkTrigger(){


    let box =
    document.getElementById(
        "triggerBox"
    );



    let value =
    box.value.trim();



    let matched = null;



    Object.keys(snippets)
    .forEach(keyword=>{


        if(
            value
            .toLowerCase()
            .endsWith(
                keyword.toLowerCase()
            )
        ){


            matched = keyword;


        }



    });






    if(matched){



        setStatus(
            "running"
        );



        let output =
        executeScript(
            snippets[matched].script
        );



        document.getElementById(
            "result"
        ).innerHTML =
        output;



        box.value="";



        setTimeout(()=>{


            setStatus(
                "active"
            );


        },1500);



    }



}









// ===============================
// SIMULATED SCRIPT ENGINE
// ===============================


function executeScript(script){


    let result =
    script;




    // DATE COMMAND

    result =
    result.replace(

        /\{date\}/g,

        new Date()
        .toLocaleDateString()

    );







    // TIME COMMAND

    result =
    result.replace(

        /\{time\}/g,

        new Date()
        .toLocaleTimeString()

    );







    // SLEEP COMMAND

    result =
    result.replace(

        /\{sleep:(.*?)\}/g,

        "[Waiting $1 seconds]"

    );








    // KEYBOARD COMMANDS

    result =
    result.replace(

        /\{(ctrl|alt|shift)\+(.*?)\}/gi,

        "[Keyboard: $1+$2]"

    );








    // MOUSE ACTIONS

    result =
    result.replace(

        /\{(click|doubleclick|move):(.*?)\}/gi,

        "[Mouse Action: $1 $2]"

    );







    return result.replace(

        /\n/g,

        "<br>"

    );


}









// ===============================
// TEST RUN
// ===============================


function testRun(){


    let script =
    document
    .getElementById(
        "script"
    )
    .value;



    setStatus(
        "running"
    );



    document
    .getElementById(
        "result"
    )
    .innerHTML =
    executeScript(script);



    setTimeout(()=>{


        setStatus(
            "active"
        );


    },1500);



}








// ===============================
// STATUS INDICATOR
// ===============================


function setStatus(state){


    let status =
    document.querySelector(
        ".status"
    );



    let text =
    document.getElementById(
        "statusText"
    );



    status.className =
    "status " + state;



    if(state==="running"){


        text.innerText =
        "Running";


    }
    else{


        text.innerText =
        "Active";


    }



}








// ===============================
// MESSAGE DISPLAY
// ===============================


function showMessage(text){


    let result =
    document.getElementById(
        "result"
    );



    result.innerHTML =
    text;



    setTimeout(()=>{


        result.innerHTML =
        "Waiting...";



    },2000);



}

// ===============================
// KEYBOARD SHORTCUT SUPPORT
// ===============================


document.addEventListener(
    "keydown",
    function(event){


        // CTRL + S saves snippet

        if(
            event.ctrlKey &&
            event.key === "s"
        ){


            event.preventDefault();


            saveSnippet();


        }



    }

);








// ===============================
// AUTO SAVE EDITOR
// ===============================


document
.getElementById("script")
?.addEventListener(
    "input",
    function(){


        if(snippets[currentKeyword]){


            snippets[currentKeyword].script =
            this.value;



            saveStorage();


        }


    }

);








// ===============================
// KEYWORD LIVE UPDATE
// ===============================


document
.getElementById("keyword")
?.addEventListener(
    "change",
    function(){


        currentKeyword =
        this.value.trim();



    }

);








// ===============================
// BUTTON RIPPLE EFFECT
// ===============================


document
.querySelectorAll("button")
.forEach(button=>{


    button.addEventListener(
        "click",
        function(event){


            let ripple =
            document.createElement(
                "span"
            );



            ripple.className =
            "ripple";



            let rect =
            this.getBoundingClientRect();



            ripple.style.left =
            event.clientX -
            rect.left +
            "px";



            ripple.style.top =
            event.clientY -
            rect.top +
            "px";



            this.appendChild(
                ripple
            );



            setTimeout(()=>{


                ripple.remove();


            },600);



        }

    );


});








// ===============================
// INITIALIZE APPLICATION
// ===============================


document.addEventListener(
    "DOMContentLoaded",
    function(){



        refreshSnippetList();



        loadSnippet(
            "hello"
        );



        setStatus(
            "active"
        );



    }

);
}

