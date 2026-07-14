/* ===========================
   Jonathan Agostini Portfolio
   script.js
=========================== */


/* ===========================
   Scroll Fade-In Animations
=========================== */


const observer = new IntersectionObserver(

    (entries)=>{

        entries.forEach((entry)=>{


            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }


        });


    },

    {
        threshold:0.15
    }

);



document.querySelectorAll(".section").forEach((section)=>{


    section.classList.add("hidden");


    observer.observe(section);


});





/* ===========================
   Active Navigation Highlight
=========================== */


const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav a");



window.addEventListener("scroll",()=>{


    let current = "";



    sections.forEach((section)=>{


        const sectionTop = section.offsetTop - 150;



        if(window.scrollY >= sectionTop){


            current = section.getAttribute("id");


        }


    });



    navLinks.forEach((link)=>{


        link.classList.remove("active");



        if(link.getAttribute("href") === "#" + current){


            link.classList.add("active");


        }


    });



});





/* ===========================
   Smooth Scroll For Navigation
=========================== */


document.querySelectorAll('a[href^="#"]').forEach(anchor=>{


    anchor.addEventListener("click",function(e){


        const target =
            document.querySelector(
                this.getAttribute("href")
            );



        if(target){


            e.preventDefault();



            target.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });


        }


    });


});





/* ===========================
   Button Ripple Effect
=========================== */


document.querySelectorAll(".btn").forEach(button=>{


    button.addEventListener("click",function(e){


        const ripple =
            document.createElement("span");



        const diameter =
            Math.max(
                this.clientWidth,
                this.clientHeight
            );



        const radius =
            diameter / 2;



        ripple.style.width =
            diameter + "px";



        ripple.style.height =
            diameter + "px";



        const rect =
            this.getBoundingClientRect();



        ripple.style.left =
            e.clientX - rect.left - radius + "px";



        ripple.style.top =
            e.clientY - rect.top - radius + "px";



        ripple.classList.add("ripple");



        const oldRipple =
            this.querySelector(".ripple");



        if(oldRipple){

            oldRipple.remove();

        }



        this.appendChild(ripple);



    });


});

/* ===========================
   Hero Typing Animation
=========================== */


const heroTitle =
    document.querySelector(".hero h1");



if(heroTitle){


    const text =
        heroTitle.textContent.trim();



    heroTitle.textContent = "";



    let index = 0;



    function typeTitle(){


        if(index < text.length){


            heroTitle.textContent +=
                text.charAt(index);



            index++;



            setTimeout(typeTitle,80);


        }


    }



    window.addEventListener("load",()=>{


        setTimeout(typeTitle,400);


    });


}





/* ===========================
   Scroll To Top Button
=========================== */


const scrollButton =
    document.createElement("button");



scrollButton.className =
    "scroll-top";



scrollButton.innerHTML =
    "↑";



document.body.appendChild(scrollButton);





window.addEventListener("scroll",()=>{


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


});





scrollButton.addEventListener("click",()=>{


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


});





/* ===========================
   External Link Protection
=========================== */


document.querySelectorAll(
    'a[target="_blank"]'
).forEach(link=>{


    link.setAttribute(
        "rel",
        "noopener noreferrer"
    );


});





/* ===========================
   Page Load Animation
=========================== */


window.addEventListener("load",()=>{


    document.body.classList.add(
        "loaded"
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

Thanks for visiting!

====================================

`);
