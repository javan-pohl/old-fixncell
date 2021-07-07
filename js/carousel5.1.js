/*const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__button--right');
const prevButton = document.querySelector('.carousel__button--left');
const dotsNav = document.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);
const buffer = 60;*/
 
var slider = document.getElementById('slider'),
    sliderItems = document.getElementById('items'),
    prev = document.getElementById('prev'),
    next = document.getElementById('next');

slide(slider, sliderItems, prev, next);
 
function slide(wrapper, items, prev, next) {
    var posX1 = 0,
        posX2 = 0,
        posInitial,
        posFinal,
        threshold = 100,
        slides = items.getElementsByClassName('slide'),
        slidesLength = slides.length,
        slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
        firstSlide = slides[0],
        secondSlide = slides[1],
        lastSlide = slides[slidesLength - 1],
        secondLastSlide = slides[slidesLength -2],
        cloneFirst = firstSlide.cloneNode(true),
        cloneSecond = secondSlide.cloneNode(true),
        cloneLast = lastSlide.cloneNode(true),
        cloneSecondLast = secondLastSlide.cloneNode(true),
        index = 0,
        allowShift = true;
    
    // Clone first and last slide
    items.appendChild(cloneFirst);
    items.appendChild(cloneSecond);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');
    
    // Mouse and Touch events
    items.onmousedown = dragStart;
    
    // Touch events
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('touchend', dragEnd);
    items.addEventListener('touchmove', dragAction);
    
    // Click events
    prev.addEventListener('click', function () { shiftSlide(-1) });
    next.addEventListener('click', function () { shiftSlide(1) });
    
    // Transition events
    items.addEventListener('transitionend', checkIndex);
    
    function dragStart (e) {
      e = e || window.event;
      e.preventDefault();
      posInitial = items.offsetLeft;
      
      if (e.type == 'touchstart') {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
    }
    console.log(slideSize);
  
    function dragAction (e) {
      e = e || window.event;
      
      if (e.type == 'touchmove') {
        posX2 = posX1 - e.touches[0].clientX;
        posX1 = e.touches[0].clientX;
      } else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
      }
      items.style.left = (items.offsetLeft - posX2) + "px";
    }
    
    function dragEnd (e) {
      posFinal = items.offsetLeft;
      if (posFinal - posInitial < -threshold) {
        shiftSlide(1, 'drag');
      } else if (posFinal - posInitial > threshold) {
        shiftSlide(-1, 'drag');
      } else {
        items.style.left = (posInitial) + "px";
      }
  
      document.onmouseup = null;
      document.onmousemove = null;
    }
    
    function shiftSlide(dir, action) {
      items.classList.add('shifting');
      
      if (allowShift) {
        if (!action) { posInitial = items.offsetLeft; }
  
        if (dir == 1) {
          items.style.left = (posInitial - slideSize) + "px";
          index++;      
        } else if (dir == -1) {
          items.style.left = (posInitial + slideSize) + "px";
          index--;      
        }
      };
      
      allowShift = false;
    }
      
    function checkIndex (){
      items.classList.remove('shifting');
  
      if (index == -1) {
        items.style.left = -(slidesLength * slideSize) + "px";
        index = slidesLength - 1;
      }
  
      if (index == slidesLength) {
        items.style.left = -(1 * slideSize) + "px";
        index = 0;
      }
      
      allowShift = true;
    }
  }


/////////////////////////////////////////////////////////////////
/*const slideWidth = slides[0].getBoundingClientRect().width;

const setSlidePosition = (slide, index) => {
    slide.style.left = (slideWidth + buffer) * index  + 'px';
}
slides.forEach(setSlidePosition);

const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = 'translateX(-' + targetSlide.style.left; + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
}

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
}

const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
    if (targetIndex === 0) {
        prevButton.classList.add('is-hidden');
        nextButton.classList.remove('is-hidden');
    } else if (targetIndex === slides.length - 1) {
        prevButton.classList.remove('is-hidden');
        nextButton.classList.add('is-hidden');
    } else {
        prevButton.classList.remove('is-hidden');
        nextButton.classList.remove('is-hidden');
    }
}

//need to loop the slides so I can set one to the left and one to the right


//when I click left, move slides to the left
prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    const prevDot = currentDot.previousElementSibling;    
    const prevIndex = slides.findIndex(slide => slide === prevSlide);

    moveToSlide(track, currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
    hideShowArrows(slides, prevButton, nextButton, prevIndex);
});

//when I click right, move slides to the right
nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    const nextDot = currentDot.nextElementSibling;
    const nextIndex = slides.findIndex(slide => slide === nextSlide);

    moveToSlide(track, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    hideShowArrows(slides, prevButton, nextButton, nextIndex);
});


//when I click the nav indicators, move to that slide
dotsNav.addEventListener('click', e => {
    //what indicator was clicked on?
    const targetDot = e.target.closest('button');

    if (!targetDot) return;
    //"null" is a 'falesy' statement (i.e. the function returns here if !targetDot is null)
    const currentSlide = track.querySelector('.current-slide');
    const currentDot = dotsNav.querySelector('.current-slide');
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(track, currentSlide, targetSlide);
    updateDots(currentDot, targetDot);

    hideShowArrows(slides, prevButton, nextButton, targetIndex);
    
});*/
