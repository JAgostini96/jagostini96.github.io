// ===================================
// AUTOMATION STUDIO WEB DEMO ENGINE
// PART 1
// ===================================



// ===============================
// SNIPPET STORAGE
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






let currentKeyword = "hello";



let triggerRunning = false;






// ===============================
// SAVE DATA
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





    document.getElementById("keyword").value = keyword;





    document.getElementById("script").value =

        snippets[keyword].script;





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





    snippets[name] = {


        script:""


    };





    saveSnippets();





    loadSnippet(name);





    refreshSnippetList();



}












// ===============================
// SAVE SNIPPET
// ===============================



function saveSnippet(){





    let keyword =

    document.getElementById("keyword")

    .value

    .trim();







    let script =

    document.getElementById("script")

    .value;








    if(keyword === "")

        return;









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



    let keyword = currentKeyword;





    if(!snippets[keyword])

        return;





    delete snippets[keyword];





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
// PART 2
// SCRIPT ENGINE + TRIGGER SYSTEM
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








        document.getElementById(

            "result"

        ).innerHTML = output;









        snippets[matched].uses =

        (snippets[matched].uses || 0) + 1;





        saveSnippets();









        /*
            Remove only the trigger word
            instead of destroying the text
        */






        let removeLength =

        matched.length;







        box.value =

        value.substring(

            0,

            value.length-removeLength

        );









        setTimeout(()=>{


            triggerRunning=false;


        },300);





    }






}










// ===============================
// LIVE TYPING LISTENER
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
// SIMULATED SCRIPT ENGINE
// ===============================



function executeScript(script){





    let result = script;







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









    // MOUSE ACTIONS



    result =

    result.replace(

        /\{(click|doubleclick|move):(.*?)\}/g,

        "[Mouse Action: $1 $2]"

    );









    // KEYS



    result =

    result.replace(

        /\{(enter|tab|space|backspace)\}/g,

        "[Keyboard: $1]"

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
// CLEAR EXECUTION LOG
// ===============================



function clearLog(){





    document.getElementById(

        "result"

    ).innerHTML =

    "Waiting...";





}












// ===============================
// STATUS MESSAGE
// ===============================



function showMessage(text){





    let result =

    document.getElementById(

        "result"

    );





    result.innerHTML=text;







    setTimeout(()=>{





        result.innerHTML =

        "Waiting...";





    },2000);





}












// ===============================
// BUTTON CONNECTIONS
// ===============================



document.addEventListener(

"DOMContentLoaded",

()=>{





    let clearButton =

    document.getElementById(

        "clearLog"

    );






    if(clearButton){


        clearButton.onclick =

        clearLog;


    }







});


// ===================================
// AUTOMATION STUDIO WEB DEMO ENGINE
// PART 3
// STARTUP + BUTTON CONNECTIONS
// ===================================





// ===============================
// BUTTON CONNECTIONS
// ===============================



document.addEventListener(

"DOMContentLoaded",

()=>{







    // -------------------------------
    // SAVE BUTTON
    // -------------------------------


    let saveButton =

    document.getElementById(

        "saveSnippet"

    );




    if(saveButton){


        saveButton.onclick =

        saveSnippet;


    }









    // -------------------------------
    // DELETE BUTTON
    // -------------------------------



    let deleteButton =

    document.getElementById(

        "deleteSnippet"

    );





    if(deleteButton){


        deleteButton.onclick =

        deleteSnippet;


    }









    // -------------------------------
    // NEW BUTTON
    // -------------------------------



    let newButton =

    document.getElementById(

        "newSnippetButton"

    );





    if(newButton){



        newButton.onclick =

        newSnippet;



    }









    // -------------------------------
    // TEST BUTTON
    // -------------------------------



    let testButton =

    document.getElementById(

        "testRun"

    );






    if(testButton){


        testButton.onclick =

        testRun;


    }









    // -------------------------------
    // SEARCH BOX
    // -------------------------------



    let search =

    document.getElementById(

        "search"

    );





    if(search){



        search.addEventListener(

            "input",

            searchSnippets

        );


    }









    // -------------------------------
    // COMMAND BUTTONS
    // -------------------------------



    let commands =

    document.querySelectorAll(

        ".actions button"

    );







    commands.forEach(button=>{





        button.addEventListener(

            "click",

            ()=>{





                let command =

                button.dataset.command;





                insertCommand(

                    command

                );






            }

        );





    });











});









// ===============================
// START APPLICATION
// ===============================



document.addEventListener(

"DOMContentLoaded",

()=>{





    refreshSnippetList();





    if(snippets.hello){


        loadSnippet(

            "hello"

        );


    }






});
