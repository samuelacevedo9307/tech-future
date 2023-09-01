document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  var swiper = new Swiper(".mySwiper", {
    navigation: {
      nextEl: ".swiper-next-button",
      prevEl: ".swiper-prev-button",
    },

    effect: "fade",
    loop: "infinite",
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
  });

  swiper.on("slideChange", function (sld) {
    document.body.setAttribute("data-sld", sld.realIndex);
  });

  /*--------------------
NAV
--------------------*/

  $('#myTab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  /*--------------------
Vars
--------------------*/
  let progress = 50;
  let startX = 0;
  let active = 0;
  let isDown = false;

  /*--------------------
Contants
--------------------*/
  const speedWheel = 0.02;
  const speedDrag = -0.1;

  /*--------------------
Get Z
--------------------*/
  const getZindex = (array, index) => array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

  /*--------------------
Items
--------------------*/
  const $items = document.querySelectorAll(".carousel-item");
  const $cursors = document.querySelectorAll(".cursor");

  const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty("--zIndex", zIndex);
    item.style.setProperty("--active", (index - active) / $items.length);
  };

  /*--------------------
Animate
--------------------*/
  const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor((progress / 100) * ($items.length - 1));

    $items.forEach((item, index) => displayItems(item, index, active));
  };
  animate();

  /*--------------------
Click on Items
--------------------*/
  $items.forEach((item, i) => {
    item.addEventListener("click", () => {
      progress = (i / $items.length) * 100 + 10;
      animate();
    });
  });

  /*--------------------
Handlers
--------------------*/
  const handleWheel = (e) => {
    const wheelProgress = e.deltaY * speedWheel;
    progress = progress + wheelProgress;
    animate();
  };

  const handleMouseMove = (e) => {
    if (e.type === "mousemove") {
      $cursors.forEach(($cursor) => {
        $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    }
    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress = progress + mouseProgress;
    startX = x;
    animate();
  };

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  /*--------------------
Listeners
--------------------*/
  document.addEventListener("mousewheel", handleWheel);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchstart", handleMouseDown);
  document.addEventListener("touchmove", handleMouseMove);
  document.addEventListener("touchend", handleMouseUp);

  /*---------------------------
carousel clientes
----------------------------*/

  const state = {};
  const carouselList = document.querySelector(".clientes__list");
  const carouselItems = document.querySelectorAll(".clientes__item");
  const elems = Array.from(carouselItems);

  carouselList.addEventListener("click", function (event) {
    var newActive = event.target;
    var isItem = newActive.closest(".clientes__item");

    if (!isItem || newActive.classList.contains("clientes__item_active")) {
      return;
    }

    update(newActive);
  });

  const update = function (newActive) {
    const newActivePos = newActive.dataset.pos;

    const current = elems.find((elem) => elem.dataset.pos == 0);
    const prev = elems.find((elem) => elem.dataset.pos == -1);
    const next = elems.find((elem) => elem.dataset.pos == 1);
    const first = elems.find((elem) => elem.dataset.pos == -2);
    const last = elems.find((elem) => elem.dataset.pos == 2);

    current.classList.remove("clientes__item_active");

    [current, prev, next, first, last].forEach((item) => {
      var itemPos = item.dataset.pos;

      item.dataset.pos = getPos(itemPos, newActivePos);
    });
  };

  const getPos = function (current, active) {
    const diff = current - active;

    if (Math.abs(current - active) > 2) {
      return -current;
    }

    return diff;
  };
  /*------------------------------
Equipo
-------------------------------*/

  const d = document;
  const $q = d.querySelectorAll.bind(d);
  const $g = d.querySelector.bind(d);
  const $list = $g(".equipo__list");
  let auto;
  let pauser;

  const getActiveIndex = () => {
    const $active = $g("[data-active]");
    return getSlideIndex($active);
  };

  const getSlideIndex = ($slide) => {
    return [...$q(".equipo__item")].indexOf($slide);
  };

  const previoSlide = () => {
    const index = getActiveIndex();
    const $slides = $q(".equipo__item");
    const $last = $slides[$slides.length - 1];
    $last.remove();
    $list.prepend($last);
    activateSlide($q(".equipo__item")[index]);
  };
  const siguienteSlide = () => {
    const index = getActiveIndex();
    const $slides = $q(".equipo__item");
    const $first = $slides[0];
    $first.remove();
    $list.append($first);
    activateSlide($q(".equipo__item")[index]);
  };

  const chooseSlide = (e) => {
    const max = window.matchMedia("screen and ( max-width: 600px)").matches ? 5 : 5;
    const $slide = e.target.closest(".equipo__item");
    const index = getSlideIndex($slide);
    if (index < 0 || index > max) return;
    if (index === max) siguienteSlide();
    if (index === 0) previoSlide();
    activateSlide($slide);
  };

  const activateSlide = ($slide) => {
    if (!$slide) return;
    const $slides = $q(".equipo__item");
    $slides.forEach((el) => el.removeAttribute("data-active"));
    $slide.setAttribute("data-active", true);
    $slide.focus();
  };

  const autoSlide = () => {
    siguienteSlide();
  };

  const pauseAuto = () => {
    clearInterval(auto);
    clearTimeout(pauser);
  };

  const handlesiguienteClick = (e) => {
    pauseAuto();
    siguienteSlide(e);
  };

  const handleprevioClick = (e) => {
    pauseAuto();
    previoSlide(e);
  };

  const handleSlideClick = (e) => {
    pauseAuto();
    chooseSlide(e);
  };

  const handleSlideKey = (e) => {
    switch (e.keyCode) {
      case 37:
      case 65:
        handleprevioClick();
        break;
      case 39:
      case 68:
        handlesiguienteClick();
        break;
    }
  };

  // $list.addEventListener( "click", handleSlideClick );
  $list.addEventListener("focusin", handleSlideClick);
  $list.addEventListener("keyup", handleSlideKey);

  /*----------tecnologias--------------*/

  new Swiper(".clients-slider", {
    speed: 300,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80,
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 120,
      },
    },
  });
});

$(".card-sm__container ul").owlCarousel({
  items: 4,
  addClassActive: true,
});

  /*---------------------------
slides
----------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('background-video');
  const slides = document.querySelectorAll('.carousel-item');
  
  const videoSources = [
    '../img/mafev.mp4',
    '../img/tokenizacion.mp4',
    'video_slide3.mp4'
  ];
  
  const carousel = new bootstrap.Carousel(document.getElementById('carouselExampleIndicators'), {
    interval: 5000, // Tiempo en milisegundos entre las diapositivas
    pause: false // No pausar al pasar el mouse sobre el carrusel
  });
  
  carousel.on('slide.bs.carousel', function (event) {
    const slideIndex = event.to;
    video.src = videoSources[slideIndex];
    video.load();
    video.play();
  });
  
  // Reproducir el video del primer slide al inicio
  video.src = videoSources[0];
  video.load();
  video.play();
});