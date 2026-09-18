/*=========================================
LIGHTBOX
=========================================*/

function openLightbox(img){
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
}

function closeLightbox(){
    document.getElementById("lightbox").style.display = "none";
}

document.getElementById("lightbox").addEventListener("click", function(e){
    if(e.target === this){
        closeLightbox();
    }
});

/*=========================================
BASIC SLIDER TRACK
=========================================*/

let currentSlide = 0;

const track = document.getElementById("sliderTrack");
const slides = document.querySelectorAll(".slide");

function moveSlide(direction){

    currentSlide += direction;

    if(currentSlide < 0){
        currentSlide = slides.length - 1;
    }

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

/*=========================================
ABOUT IMAGE SCROLL ANIMATION
=========================================*/

const aboutImage = document.querySelector(".about-image");

const aboutObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            aboutImage.classList.add("active");
        }
    });
},{
    threshold:0.35
});

aboutObserver.observe(document.querySelector("#about"));

/*=========================================
INTRO -> WEBSITE REVEAL
=========================================*/

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("intro").classList.add("hide");
        document.getElementById("website").classList.add("show");
    }, 2800);
});

/*=========================================
NAVBAR SHOW/HIDE + THEME
=========================================*/

const navbar = document.querySelector(".glass-nav");
const sections = document.querySelectorAll("section");

let navbarUpdateQueued = false;

function updateNavbar(){

    // Show / Hide navbar
    if(window.scrollY > 80){
        navbar.classList.add("show");
        navbar.classList.remove("hide");
    }else{
        navbar.classList.remove("show");
        navbar.classList.add("hide");
    }

    // Change navbar theme based on current section
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        if(rect.top <= 120 && rect.bottom >= 120){
            if(section.dataset.nav === "dark"){
                navbar.classList.add("dark");
            }else{
                navbar.classList.remove("dark");
            }
        }
    });
}

window.addEventListener("scroll", () => {
    if(navbarUpdateQueued) return;

    navbarUpdateQueued = true;
    window.requestAnimationFrame(() => {
        updateNavbar();
        navbarUpdateQueued = false;
    });
}, { passive:true });

updateNavbar();

/*=========================================
CONTACT LEFT SCROLL REVEAL
(moved out of the scroll listener so the
observer is only created/attached once)
=========================================*/

const contactLeft = document.querySelector(".contact-left");

const contactObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            contactLeft.classList.add("show");
        }
    });
},{
    threshold:0.35
});

contactObserver.observe(contactLeft);

/*=========================================
3D COVERFLOW
=========================================*/

const coverflowCards = document.querySelectorAll(".cover-card");

let coverflowCurrent = 0;

function updateCoverflow(){

    coverflowCards.forEach((card,index)=>{

        let offset = index - coverflowCurrent;

        /* Infinite positioning */

        if(offset > coverflowCards.length/2){
            offset -= coverflowCards.length;
        }

        if(offset < -coverflowCards.length/2){
            offset += coverflowCards.length;
        }

        let x = offset * 230;
        let rotate = offset * -35;
        let scale = 1 - Math.abs(offset)*0.18;
        let opacity = 1 - Math.abs(offset)*0.28;
        let blur = Math.abs(offset)*2;
        let z = 100 - Math.abs(offset);

        card.style.transition =
        "transform .8s cubic-bezier(.22,1,.36,1),opacity .8s";

        card.style.transform = `
        translate(-50%,-50%)
        translateX(${x}px)
        rotateY(${rotate}deg)
        scale(${scale})
        `;

        card.style.opacity = opacity;
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = z;
    });
}

updateCoverflow();

/*=========================
NEXT & PREVIOUS
=========================*/

const coverflowNextBtn = document.querySelector(".next");
const coverflowPrevBtn = document.querySelector(".prev");

coverflowNextBtn.addEventListener("click",()=>{
    coverflowCurrent++;

    if(coverflowCurrent >= coverflowCards.length){
        coverflowCurrent = 0;
    }

    updateCoverflow();
});

coverflowPrevBtn.addEventListener("click",()=>{
    coverflowCurrent--;

    if(coverflowCurrent < 0){
        coverflowCurrent = coverflowCards.length-1;
    }

    updateCoverflow();
});

/*=========================================
AUTO SLIDE
=========================================*/

let coverflowAutoSlide = setInterval(()=>{
    coverflowCurrent++;

    if(coverflowCurrent >= coverflowCards.length){
        coverflowCurrent = 0;
    }

    updateCoverflow();
},3500);

/*=========================================
STOP AUTO WHEN HOVER
=========================================*/

const coverflow = document.querySelector(".coverflow");

coverflow.addEventListener("mouseenter",()=>{
    clearInterval(coverflowAutoSlide);
});

coverflow.addEventListener("mouseleave",()=>{
    coverflowAutoSlide = setInterval(()=>{
        coverflowCurrent++;

        if(coverflowCurrent >= coverflowCards.length){
            coverflowCurrent = 0;
        }

        updateCoverflow();
    },3500);
});

/*=========================================
DRAG SUPPORT (Coverflow)
=========================================*/

let coverflowIsDragging = false;
let coverflowStartX = 0;
let coverflowMoveX = 0;

const container = document.querySelector(".coverflow-container");

/* MOUSE */
container.addEventListener("mousedown", coverflowDragStart);
window.addEventListener("mousemove", coverflowDragMove);
window.addEventListener("mouseup", coverflowDragEnd);

/* TOUCH */
container.addEventListener("touchstart", coverflowDragStart,{passive:true});
window.addEventListener("touchmove", coverflowDragMove,{passive:true});
window.addEventListener("touchend", coverflowDragEnd);

function coverflowDragStart(e){
    coverflowIsDragging = true;
    clearInterval(coverflowAutoSlide);
    coverflowStartX = getPosition(e);
}

function coverflowDragMove(e){
    if(!coverflowIsDragging) return;
    coverflowMoveX = getPosition(e);
}

function coverflowDragEnd(){
    if(!coverflowIsDragging) return;

    coverflowIsDragging = false;

    const distance = coverflowMoveX - coverflowStartX;

    if(distance < -80){
        coverflowCurrent++;

        if(coverflowCurrent >= coverflowCards.length){
            coverflowCurrent = 0;
        }
    }

    if(distance > 80){
        coverflowCurrent--;

        if(coverflowCurrent < 0){
            coverflowCurrent = coverflowCards.length - 1;
        }
    }

    updateCoverflow();

    coverflowAutoSlide = setInterval(()=>{
        coverflowCurrent++;

        if(coverflowCurrent >= coverflowCards.length){
            coverflowCurrent = 0;
        }

        updateCoverflow();
    },3500);
}

function getPosition(e){
    return e.type.includes("mouse")
        ? e.clientX
        : e.touches[0]?.clientX || e.changedTouches[0].clientX;
}

/*=========================================
WATCH NOW
=========================================*/

const modal = document.querySelector(".video-modal");
const video = document.getElementById("fullscreenVideo");
const closeBtn = document.querySelector(".close-video");
const videoWrapper = document.querySelector(".video-wrapper");

function enableModalAudio(){
    video.muted = false;
    video.defaultMuted = false;
    video.removeAttribute("muted");
    video.volume = 1;
}

const watchButtons = document.querySelectorAll(".watch-btn");

watchButtons.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const src = btn.dataset.video;

        if(!src) return;

        video.pause();
        video.src = src;
        video.load();
        enableModalAudio();

        modal.style.display="flex";
        const playback = video.play();
        enableModalAudio();
        playback.catch(() => {
            /* Visible controls allow a retry if a browser blocks playback. */
        });
    });
});

/* Mobile browsers require a user gesture before audio can start. */
document.querySelectorAll(".ads-image video").forEach(preview => {
    preview.addEventListener("click", () => {
        preview.muted = false;
        preview.volume = 1;
        preview.controls = true;
        preview.play().catch(() => {});
    });
});

video.addEventListener("loadedmetadata",()=>{
    enableModalAudio();
    videoWrapper.classList.toggle(
        "landscape",
        video.videoWidth > video.videoHeight
    );
});

closeBtn.addEventListener("click",closeVideo);

modal.addEventListener("click",(e)=>{
    if(e.target===modal){
        closeVideo();
    }
});

function closeVideo(){
    video.pause();
    video.currentTime=0;
    modal.style.display="none";
}

document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        closeVideo();
    }
});

video.addEventListener("dblclick",()=>{
    if(document.fullscreenElement){
        document.exitFullscreen();
    }else{
        video.requestFullscreen();
    }
});

/*=========================================
ADS & REELS CAROUSEL
=========================================*/

const slider = document.querySelector(".ads-slider");
const adsCards = document.querySelectorAll(".ads-card");
const dots = document.querySelectorAll(".ads-dots .dot");

let adsCurrent = 0;

function updateCarousel(){

    adsCards.forEach((card,index)=>{

        let offset = index - adsCurrent;

        if(offset > adsCards.length/2){
            offset -= adsCards.length;
        }

        if(offset < -adsCards.length/2){
            offset += adsCards.length;
        }

        let translateX = offset * 360;
        let rotateY = offset * -28;
        let scale = offset===0 ? 1 : 0.82;
        let opacity = offset===0 ? 1 : 0.45;
        let blur = offset===0 ? 0 : 2;
        let z = 100 - Math.abs(offset);

        card.style.transform = `
        translate(-50%,-50%)
        translateX(${translateX}px)
        rotateY(${rotateY}deg)
        scale(${scale})
        `;

        card.style.opacity = opacity;
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = z;
    });

    dots.forEach((dot,index)=>{
        dot.classList.toggle("active",index===adsCurrent);
    });
}

updateCarousel();

const adsNextBtn = document.querySelector(".ads-next");
const adsPrevBtn = document.querySelector(".ads-prev");

adsNextBtn.addEventListener("click",()=>{
    adsCurrent++;

    if(adsCurrent>=adsCards.length){
        adsCurrent=0;
    }

    updateCarousel();
});

adsPrevBtn.addEventListener("click",()=>{
    adsCurrent--;

    if(adsCurrent<0){
        adsCurrent=adsCards.length-1;
    }

    updateCarousel();
});

function nextAdSlide(){
    adsCurrent++;

    if(adsCurrent>=adsCards.length){
        adsCurrent=0;
    }

    updateCarousel();
}

/*=========================================
DRAG SUPPORT (Ads Carousel)
=========================================*/

let adsStartX=0;
let adsIsDragging=false;

slider.addEventListener("mousedown",e=>{
    adsIsDragging=true;
    adsStartX=e.clientX;
});

window.addEventListener("mouseup",e=>{
    if(!adsIsDragging) return;

    adsIsDragging=false;

    let distance=e.clientX-adsStartX;

    if(distance<-80){
        nextAdSlide();
    }

    if(distance>80){
        adsCurrent--;

        if(adsCurrent<0){
            adsCurrent=adsCards.length-1;
        }

        updateCarousel();
    }
});

slider.addEventListener("touchstart",e=>{
    adsStartX=e.touches[0].clientX;
});

slider.addEventListener("touchend",e=>{
    let distance=e.changedTouches[0].clientX-adsStartX;

    if(distance<-80){
        nextAdSlide();
    }

    if(distance>80){
        adsCurrent--;

        if(adsCurrent<0){
            adsCurrent=adsCards.length-1;
        }

        updateCarousel();
    }
});
