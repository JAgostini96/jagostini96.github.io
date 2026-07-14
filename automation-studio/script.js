// ==========================================
// AUTOMATION STUDIO WEB DEMO
// Jonathan Agostini
// Part 1
// ==========================================

console.clear();
console.log("Automation Studio Loaded");

// ==========================================
// DEFAULT SNIPPETS
// ==========================================

const defaultSnippets = {

    hello:{
        script:"Hello! This is an automated message."
    },

    email:{
        script:
`Hello,

I wanted to follow up regarding our previous conversation.

Thank you.`
    },

    meeting:{
        script:"Meeting scheduled for {date} at {time}"
    }

};


// ==========================================
// STORAGE
// ==========================================

let snippets = {};

let currentKeyword = "hello";

const STORAGE_KEY = "automationStudioSnippets";


// ==========================================
// LOAD STORAGE
// ==========================================

function loadStorage(){

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if(saved){

        try{

            snippets = JSON.parse(saved);

        }

        catch{

            snippets = structuredClone(defaultSnippets);

        }

    }

    else{

        snippets = structuredClone(defaultSnippets);

    }

}


// ==========================================
// SAVE STORAGE
// ==========================================

function saveStorage(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(snippets,null,2)

    );

}


// ==========================================
// LOAD SNIPPET
// ==========================================

function loadSnippet(keyword){

    if(!snippets[keyword])
        return;

    currentKeyword = keyword;

    document.getElementById("keyword").value =
        keyword;

    document.getElementById("script").value =
        snippets[keyword].script;

}


// ==========================================
// CREATE NEW SNIPPET
// ==========================================

function newSnippet(){

    let name =
        prompt(
            "Enter new trigger keyword:"
        );

    if(!name)
        return;

    name = name.trim();

    if(name==="")
        return;

    if(snippets[name]){

        alert("That keyword already exists.");

        return;

    }

    snippets[name]={

        script:""

    };

    currentKeyword=name;

    refreshSnippetList();

    loadSnippet(name);

    saveStorage();

}


// ==========================================
// SAVE SNIPPET
// ==========================================

function saveSnippet(){

    const keyword =
        document
        .getElementById("keyword")
        .value
        .trim();

    const script =
        document
        .getElementById("script")
        .value;

    if(keyword==="")
        return;

    snippets[keyword]={

        script:script

    };

    currentKeyword=keyword;

    refreshSnippetList();

    saveStorage();

    showMessage(
        "Snippet saved ✓"
    );

}


// ==========================================
// DELETE CURRENT SNIPPET
// ==========================================

function deleteSnippet(){

    if(!snippets[currentKeyword])
        return;

    if(!confirm(
        "Delete '"+currentKeyword+"'?"
    ))
        return;

    delete snippets[currentKeyword];

    saveStorage();

    refreshSnippetList();

    const keys =
        Object.keys(snippets);

    if(keys.length){

        loadSnippet(keys[0]);

    }

    else{

        snippets = structuredClone(
            defaultSnippets
        );

        saveStorage();

        refreshSnippetList();

        loadSnippet("hello");

    }

}


// ==========================================
// REFRESH SIDEBAR
// ==========================================

function refreshSnippetList(){

    const container =
        document.getElementById(
            "snippetList"
        );

    container.innerHTML="";

    Object.keys(snippets)
    .sort()
    .forEach(keyword=>{

        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            keyword;

        if(keyword===currentKeyword){

            button.classList.add(
                "active"
            );

        }

        button.onclick=()=>{

            loadSnippet(keyword);

            refreshSnippetList();

        };

        container.appendChild(button);

    });

}

// ==========================================
// AUTOMATION ENGINE
// Part 2
// ==========================================


// ==========================================
// SEARCH SNIPPETS
// ==========================================

function searchSnippets(){

    const query =
        document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

    document
        .querySelectorAll("#snippetList button")
        .forEach(button=>{

            const visible =
                button.textContent
                .toLowerCase()
                .includes(query);

            button.style.display =
                visible
                ? "block"
                : "none";

        });

}



// ==========================================
// INSERT COMMAND
// ==========================================

function insertCommand(command){

    const editor =
        document.getElementById(
            "script"
        );

    const start =
        editor.selectionStart;

    const end =
        editor.selectionEnd;

    editor.setRangeText(

        command,

        start,

        end,

        "end"

    );

    editor.focus();

}



// ==========================================
// SIMULATED SCRIPT ENGINE
// ==========================================

function executeScript(script){

    let output = script;

    const now = new Date();

    output = output.replace(
        /\{date\}/gi,
        now.toLocaleDateString()
    );

    output = output.replace(
        /\{time\}/gi,
        now.toLocaleTimeString()
    );

    output = output.replace(
        /\{datetime\}/gi,
        now.toLocaleString()
    );

    output = output.replace(

        /\{sleep:(.*?)\}/gi,

        (match,value)=>{

            return `[Sleep ${value}s]`;

        }

    );

    output = output.replace(

        /\{(ctrl|alt|shift)\+(.+?)\}/gi,

        (match,key,button)=>{

            return `[Keyboard ${key.toUpperCase()}+${button.toUpperCase()}]`;

        }

    );

    output = output.replace(

        /\{click:(.*?)\}/gi,

        (match,value)=>{

            return `[Mouse Click ${value}]`;

        }

    );

    output = output.replace(

        /\{doubleclick:(.*?)\}/gi,

        (match,value)=>{

            return `[Double Click ${value}]`;

        }

    );

    output = output.replace(

        /\{move:(.*?)\}/gi,

        (match,value)=>{

            return `[Move Mouse ${value}]`;

        }

    );

    output = output.replace(

        /\n/g,

        "<br>"

    );

    return output;

}



// ==========================================
// LIVE TRIGGER SYSTEM
// ==========================================

let triggerTimer = null;

function checkTrigger(){

    clearTimeout(triggerTimer);

    triggerTimer = setTimeout(()=>{

        const box =
            document.getElementById(
                "triggerBox"
            );

        const value =
            box.value
            .trim()
            .toLowerCase();

        if(value==="")
            return;

        let matched = null;

        Object.keys(snippets)
        .forEach(keyword=>{

            if(
                value ===
                keyword.toLowerCase()
            ){

                matched = keyword;

            }

        });

        if(!matched)
            return;

        setStatus("running");

        const result =
            executeScript(
                snippets[matched].script
            );

        document
            .getElementById("result")
            .innerHTML =
            result;

        box.value = "";

        setTimeout(()=>{

            setStatus("active");

        },800);

    },150);

}



// ==========================================
// TEST RUN
// ==========================================

function testRun(){

    const script =
        document
        .getElementById("script")
        .value;

    setStatus("running");

    document
        .getElementById("result")
        .innerHTML =
        executeScript(script);

    setTimeout(()=>{

        setStatus("active");

    },800);

}

// ==========================================
// AUTOMATION STUDIO WEB DEMO
// Part 3
// ==========================================


// ==========================================
// STATUS INDICATOR
// ==========================================

function setStatus(state){

    const dot =
        document.getElementById("statusDot");

    const text =
        document.getElementById("statusText");

    if(!dot || !text)
        return;

    switch(state){

        case "running":

            dot.style.color="#f59e0b";
            text.textContent="Running";
            break;

        case "saved":

            dot.style.color="#22c55e";
            text.textContent="Saved";
            break;

        case "active":

        default:

            dot.style.color="#22c55e";
            text.textContent="Active";
            break;

    }

}



// ==========================================
// RESULT MESSAGE
// ==========================================

function showMessage(message){

    const result =
        document.getElementById("result");

    if(!result)
        return;

    result.innerHTML=message;

    setStatus("saved");

    setTimeout(()=>{

        result.innerHTML="Waiting...";

        setStatus("active");

    },1800);

}



// ==========================================
// AUTO SAVE WHILE EDITING
// ==========================================

document
.getElementById("script")
.addEventListener("input",()=>{

    const keyword =
        document
        .getElementById("keyword")
        .value
        .trim();

    if(keyword==="")
        return;

    snippets[keyword]={

        script:
        document
        .getElementById("script")
        .value

    };

    saveStorage();

});




// ==========================================
// SAVE WHEN KEYWORD CHANGES
// ==========================================

document
.getElementById("keyword")
.addEventListener("change",()=>{

    saveSnippet();

});




// ==========================================
// DELETE BUTTON
// ==========================================

const deleteButton =
    document.querySelector(".delete");

if(deleteButton){

    deleteButton.onclick =
        deleteSnippet;

}




// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener("keydown",(e)=>{

    // CTRL + S

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        saveSnippet();

    }

    // DELETE

    if(

        e.key==="Delete" &&

        document.activeElement.id==="keyword"

    ){

        deleteSnippet();

    }

});




// ==========================================
// INITIALIZE
// ==========================================

loadStorage();

refreshSnippetList();

if(snippets[currentKeyword]){

    loadSnippet(currentKeyword);

}
else{

    loadSnippet(

        Object.keys(snippets)[0]

    );

}

setStatus("active");




// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log(`
======================================

Automation Studio Web Demo

Features Enabled

✓ Persistent Snippets
✓ Search
✓ Live Trigger Detection
✓ Save / Delete
✓ Local Storage
✓ Simulated Commands
✓ Keyboard Shortcuts
✓ Browser Automation Demo

======================================
`);
