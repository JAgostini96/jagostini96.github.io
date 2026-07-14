/* ===========================
   Jonathan Agostinis Portfolio
   script.js
=========================== */


/* ===========================
   Scroll Fade-In Animations
=========================== */


const animatedElements = document.querySelectorAll(
    ".section, .card, .skill-card, .highlight, .timeline-item"
);


const observer = new IntersectionObserver(
    (entries)=>{


        entries.forEach((entry)=>{


            if(entry.isIntersecting){


                entry.target.classList.add("show");


                observer.unobserve(entry.target);


            }


        });


    },
    {
        threshold:0.15
    }
);



animatedElements.forEach((element)=>{


    element.classList.add("hidden");


    observer.observe(element);


});




/* ===========================
   Active Navigation Highlight
=========================== */


const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll("nav a");



function updateActiveNav(){


    let currentSection = "";



    sections.forEach((section)=>{


        const sectionTop =
            section.offsetTop - 200;



        if(window.scrollY >= sectionTop){


            currentSection =
                section.getAttribute("id");


        }


    });



    navLinks.forEach((link)=>{


        link.classList.remove("active");



        if(
            link.getAttribute("href") ===
            "#" + currentSection
        ){

            link.classList.add("active");

        }


    });


}



window.addEventListener(
    "scroll",
    updateActiveNav
);


updateActiveNav();





/* ===========================
   Smooth Button Ripple Effect
=========================== */


document.querySelectorAll(".btn")
.forEach((button)=>{


    button.addEventListener(
        "click",
        function(event){


            const ripple =
                document.createElement("span");



            const size =
                Math.max(
                    this.offsetWidth,
                    this.offsetHeight
                );



            const rect =
                this.getBoundingClientRect();



            ripple.style.width =
                size + "px";


            ripple.style.height =
                size + "px";


            ripple.style.left =
                event.clientX -
                rect.left -
                size / 2 +
                "px";


            ripple.style.top =
                event.clientY -
                rect.top -
                size / 2 +
                "px";



            ripple.className =
                "ripple";



            const oldRipple =
                this.querySelector(".ripple");



            if(oldRipple){

                oldRipple.remove();

            }



            this.appendChild(ripple);



        }
    );


});

/* ===========================
   Hero Name Typing Effect
=========================== */


const heroTitle =
    document.querySelector(".hero h1");



if(heroTitle){


    const originalText =
        heroTitle.textContent.trim();



    heroTitle.textContent = "";



    let index = 0;



    function typeHeroText(){


        if(index < originalText.length){


            heroTitle.textContent +=
                originalText.charAt(index);



            index++;


            setTimeout(
                typeHeroText,
                70
            );


        }


    }



    window.addEventListener(
        "load",
        ()=>{


            setTimeout(
                typeHeroText,
                400
            );


        }
    );


}





/* ===========================
   Scroll To Top Button
=========================== */


const scrollButton =
    document.createElement("button");



scrollButton.innerHTML =
    "↑";



scrollButton.className =
    "scroll-top";



document.body.appendChild(
    scrollButton
);




function toggleScrollButton(){


    if(window.scrollY > 500){


        scrollButton.classList.add(
            "visible"
        );


    }
    else{


        scrollButton.classList.remove(
            "visible"
        );


    }


}



window.addEventListener(
    "scroll",
    toggleScrollButton
);





scrollButton.addEventListener(
    "click",
    ()=>{


        window.scrollTo({

            top:0,

            behavior:"smooth"

        });


    }
);





/* ===========================
   Project Card Equal Height Fix
=========================== */


function resizeProjectCards(){


    const cards =
        document.querySelectorAll(
            ".highlight"
        );



    let maxHeight = 0;



    cards.forEach((card)=>{


        card.style.height =
            "auto";



        if(card.offsetHeight > maxHeight){

            maxHeight =
                card.offsetHeight;

        }


    });



    if(window.innerWidth > 700){


        cards.forEach((card)=>{


            card.style.height =
                maxHeight + "px";


        });


    }


}



window.addEventListener(
    "load",
    resizeProjectCards
);



window.addEventListener(
    "resize",
    resizeProjectCards
);





/* ===========================
   External Link Safety
=========================== */


document
.querySelectorAll(
    'a[target="_blank"]'
)
.forEach((link)=>{


    link.setAttribute(
        "rel",
        "noopener noreferrer"
    );


});





/* ===========================
   Console Message
=========================== */


console.log(`

====================================
 Jonathan Agostini Portfolio
====================================

Built with:

✔ HTML
✔ CSS
✔ JavaScript
✔ GitHub Pages

Features:

✔ Scroll animations
✔ Active navigation
✔ Button effects
✔ Responsive layout
✔ Project cards
✔ Smooth scrolling

Thanks for visiting!

====================================

`);
