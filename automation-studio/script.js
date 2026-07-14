// ===================================
// AUTOMATION STUDIO WEB DEMO ENGINE
// PART 1 - SNIPPETS + STORAGE
// ===================================



// ===============================
// LOAD SAVED SNIPPETS
// ===============================


let snippets =

JSON.parse(

    localStorage.getItem(
        "automationSnippets"
    )

)

||

{


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





// ===============================
// CLEAN OLD INVALID SNIPPETS
// ===============================


Object.keys(snippets).forEach(key=>{


    if(

        !key ||

        key.trim()==="" ||

        !snippets[key] ||

        typeof snippets[key].script !== "string"

    ){


        delete snippets[key];


    }


});





// Save cleaned version

localStorage.setItem(

    "automationSnippets",

    JSON.stringify(snippets)

);








let currentKeyword = "hello";



let triggerRunning = false;








// ===============================
// SAVE SNIPPETS
// ===============================



function saveSnippets(){


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

    ).value = snippets[keyword].script;




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






    name = name.trim();





    if(name==="")

        return;






    snippets[name] = {


        script:""


    };






    currentKeyword = name;





    saveSnippets();





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

    .trim();








    let script =

    document.getElementById(

        "script"

    )

    .value;







    if(keyword===""){


        return;


    }








    snippets[keyword] = {


        script:script


    };







    currentKeyword = keyword;






    saveSnippets();





    refreshSnippetList();






    showMessage(

        "Snippet saved ✓"

    );





}











// ===============================
// DELETE SNIPPET
// ===============================



function deleteSnippet(){





    if(!currentKeyword)

        return;








    if(!snippets[currentKeyword])

        return;








    delete snippets[currentKeyword];






    saveSnippets();






    currentKeyword = null;






    document.getElementById(

        "keyword"

    ).value="";







    document.getElementById(

        "script"

    ).value="";








    refreshSnippetList();






    showMessage(

        "Snippet deleted"

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







    container.innerHTML="";








    Object.keys(snippets)

    .sort()

    .forEach(keyword=>{





        let button =

        document.createElement(

            "button"

        );






        button.innerText = keyword;







        button.onclick =

        ()=>loadSnippet(keyword);







        container.appendChild(button);





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

// ===================================
// AUTOMATION STUDIO WEB DEMO ENGINE
// PART 2 - TRIGGER + SCRIPT ENGINE
// ===================================





// ===============================
// AUTOMATION TRIGGER SYSTEM
// ===============================



function checkTrigger(){



    if(triggerRunning)

        return;






    let box =

    document.getElementById(

        "triggerBox"

    );





    if(!box)

        return;








    let value =

    box.value;







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





        triggerRunning = true;








        let output =

        executeScript(

            snippets[matched].script

        );







        let resultBox =

        document.getElementById(

            "result"

        );







        if(resultBox){



            resultBox.innerHTML = output;



        }









        // Track usage


        snippets[matched].uses =

        (

            snippets[matched].uses || 0

        ) + 1;







        snippets[matched].last_used =

        new Date()

        .toISOString();







        saveSnippets();









        /*
            Keep trigger box text.
            This allows testing
            and editing after expansion.
        */



        box.value = value;









        setTimeout(()=>{


            triggerRunning = false;



        },300);





    }





}









// ===============================
// CONNECT TRIGGER BOX
// ===============================



document.addEventListener(

"DOMContentLoaded",

()=>{





    let box =

    document.getElementById(

        "triggerBox"

    );






    if(box){





        box.addEventListener(

            "input",

            checkTrigger

        );





    }







});











// ===============================
// SCRIPT EXECUTION ENGINE
// ===============================



function executeScript(script){





    let output = script;









    // DATE


    output =

    output.replace(

        /\{date\}/g,

        new Date()

        .toLocaleDateString()

    );









    // TIME


    output =

    output.replace(

        /\{time\}/g,

        new Date()

        .toLocaleTimeString()

    );









    // WAIT


    output =

    output.replace(

        /\{sleep:(.*?)\}/g,

        "[Waiting $1 seconds]"

    );









    // HOTKEYS


    output =

    output.replace(

        /\{(ctrl|alt|shift)\+(.*?)\}/gi,

        "[Keyboard: $1+$2]"

    );









    // MOUSE


    output =

    output.replace(

        /\{(click|doubleclick|move):(.*?)\}/gi,

        "[Mouse Action: $1 $2]"

    );









    // SPECIAL KEYS


    output =

    output.replace(

        /\{(enter|tab|space|backspace)\}/gi,

        "[Keyboard: $1]"

    );








    return output.replace(

        /\n/g,

        "<br>"

    );



}











// ===============================
// TEST RUN
// ===============================



function testRun(){





    let script =

    document.getElementById(

        "script"

    ).value;







    let resultBox =

    document.getElementById(

        "result"

    );






    if(resultBox){



        resultBox.innerHTML =

        executeScript(script);



    }





}











// ===============================
// CLEAR OUTPUT LOG
// ===============================



function clearLog(){





    let resultBox =

    document.getElementById(

        "result"

    );







    if(resultBox){



        resultBox.innerHTML =

        "Waiting...";



    }





}












// ===============================
// STATUS MESSAGE
// ===============================



function showMessage(text){





    let messageBox =

    document.getElementById(

        "message"

    );







    if(messageBox){



        messageBox.innerHTML = text;



        setTimeout(()=>{


            messageBox.innerHTML="";


        },2000);



    }

    else{



        let resultBox =

        document.getElementById(

            "result"

        );





        if(resultBox){



            resultBox.innerHTML=text;



        }



    }





}

// ===================================
// AUTOMATION STUDIO WEB DEMO ENGINE
// PART 3 - TRIGGER + EXECUTION SYSTEM
// ===================================


// ===============================
// AUTOMATIC TRIGGER EXPANSION
// ===============================


function checkTrigger(){


    const box = document.getElementById(
        "triggerBox"
    );


    if(!box)
        return;



    let value = box.value;



    let matched = null;



    Object.keys(snippets).forEach(keyword=>{


        // ignore empty keywords

        if(
            keyword.trim() === ""
        )
            return;



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


        let expansion = executeScript(
            snippets[matched].script
        );



        // replace ONLY the keyword

        let newText =
        value.substring(
            0,
            value.length - matched.length
        )
        +
        expansion;



        box.value = newText;



        updateOutput(
            "Expanded: " + matched
        );



    }


}







// ===============================
// LIVE INPUT LISTENER
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


    const triggerBox =
    document.getElementById(
        "triggerBox"
    );



    if(triggerBox){


        triggerBox.addEventListener(
            "input",
            checkTrigger
        );


    }



});








// ===============================
// EXECUTION ENGINE
// ===============================


function executeScript(script){



    let output = script;



    // DATE


    output =
    output.replace(
        /\{date\}/g,

        new Date()
        .toLocaleDateString()

    );





    // TIME


    output =
    output.replace(
        /\{time\}/g,

        new Date()
        .toLocaleTimeString()

    );







    // SLEEP COMMAND


    output =
    output.replace(

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


    output =
    output.replace(

        /\{(enter|tab|space|backspace)\}/gi,

        function(match,key){


            return (
                "[Keyboard: "
                +
                key
                +
                "]"
            );


        }

    );







    // HOTKEYS


    output =
    output.replace(

        /\{(ctrl|alt|shift)\+(.*?)\}/gi,

        function(match,key,value){


            return (
                "[Hotkey: "
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


    output =
    output.replace(

        /\{(click|doubleclick|move):(.*?)\}/gi,

        function(match,type,pos){


            return (
                "[Mouse "
                +
                type
                +
                ": "
                +
                pos
                +
                "]"
            );


        }

    );






    return output.replace(
        /\n/g,
        "<br>"
    );



}









// ===============================
// TEST RUN
// ===============================


function testRun(){



    const editor =
    document.getElementById(
        "script"
    );



    if(!editor.value.trim()){


        updateOutput(
            "Nothing to test"
        );


        return;


    }





    let result =
    executeScript(
        editor.value
    );



    updateOutput(
        result
    );



}









// ===============================
// OUTPUT HANDLER
// ===============================


function updateOutput(message){



    const output =
    document.getElementById(
        "result"
    );



    if(!output)
        return;



    output.innerHTML =
    message;



}








// ===============================
// CLEAR OUTPUT BUTTON
// ===============================


function clearOutput(){



    const output =
    document.getElementById(
        "result"
    );



    if(output){


        output.innerHTML =
        "Waiting...";


    }



}








// ===============================
// COMMAND BUTTON INSERTS
// ===============================


document
.querySelectorAll(
    ".actions button"
)
.forEach(button=>{


    button.addEventListener(
        "click",
        ()=>{


            const editor =
            document.getElementById(
                "script"
            );


            editor.value +=
            button.dataset.command;



            editor.focus();


        }
    );


});








// ===============================
// INITIAL LOAD
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


    refreshSnippetList();


    if(
        snippets.hello
    ){

        loadSnippet(
            "hello"
        );

    }



});
