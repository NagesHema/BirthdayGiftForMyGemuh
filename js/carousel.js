(function () {
  "use strict";

  var activeSwiper;
  var slideshowTimer;
  var keydownHandler;

  function destroy() {
    window.clearInterval(slideshowTimer);
    slideshowTimer = null;
    if (activeSwiper) activeSwiper.destroy(true, true);
    if (keydownHandler) document.removeEventListener("keydown", keydownHandler);
    activeSwiper = null;
    keydownHandler = null;
    document.body.classList.remove("viewer-open");
  }

  function init() {
    destroy();
    var root = document.querySelector(".memory-swiper");
    if (!root) return;
    var slides = Array.from(root.querySelectorAll(".swiper-slide"));
    var swiper = window.Swiper ? new window.Swiper(root, {
      slidesPerView: 1.15,
      centeredSlides: true,
      spaceBetween: 18,
      speed: 750,
      grabCursor: true,
      keyboard: { enabled: true },
      pagination: { el: ".swiper-pagination", type: "fraction" },
      navigation: { nextEl: "[data-next]", prevEl: "[data-prev]" },
      autoplay: false,
      breakpoints: {
        640: { slidesPerView: 2.1, spaceBetween: 25 },
        980: { slidesPerView: 3, spaceBetween: 34 }
      }
    }) : null;
    activeSwiper = swiper;
    if (!swiper) {
      root.classList.add("native-carousel");
      if (slides[0]) slides[0].classList.add("swiper-slide-active");
    }
    var autoplayButton = document.querySelector("[data-slideshow]");
    var playing = false;
    var currentSlide = 0;
    function moveTo(index) {
      currentSlide = (index + slides.length) % slides.length;
      if (swiper) swiper.slideToLoop ? swiper.slideToLoop(currentSlide) : swiper.slideTo(currentSlide);
      else {
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("swiper-slide-active", slideIndex === currentSlide);
        });
        slides[currentSlide].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        var pagination = document.querySelector(".swiper-pagination");
        if (pagination) pagination.textContent = (currentSlide + 1) + " / " + slides.length;
      }
    }
    if (!swiper) {
      var fallbackPagination = document.querySelector(".swiper-pagination");
      if (fallbackPagination) fallbackPagination.textContent = "1 / " + slides.length;
    }

    if (!swiper) {
      var previousButton = document.querySelector("[data-prev]");
      var nextButton = document.querySelector("[data-next]");
      if (previousButton) previousButton.addEventListener("click", function () { moveTo(currentSlide - 1); });
      if (nextButton) nextButton.addEventListener("click", function () { moveTo(currentSlide + 1); });
    }
    if (autoplayButton) {
      autoplayButton.addEventListener("click", function () {
        if (playing) {
          if (swiper) swiper.autoplay.stop();
          else window.clearInterval(slideshowTimer);
          autoplayButton.dataset.playing = "false";
          autoplayButton.textContent = autoplayButton.dataset.playLabel;
        } else {
          if (swiper) {
            swiper.params.autoplay = { delay: 3400, disableOnInteraction: false };
            swiper.autoplay.start();
          } else {
            slideshowTimer = window.setInterval(function () { moveTo(currentSlide + 1); }, 3400);
          }
          autoplayButton.dataset.playing = "true";
          autoplayButton.textContent = autoplayButton.dataset.pauseLabel;
        }
        playing = !playing;
        autoplayButton.setAttribute("aria-pressed", String(playing));
      });
    }
    var viewer = document.querySelector(".photo-viewer");
    if (!viewer) return;
    var viewerImage = viewer.querySelector(".viewer-image");
    var viewerCaption = viewer.querySelector(".viewer-caption");
    var current = 0;

    function open(index) {
      current = (index + slides.length) % slides.length;
      var image = slides[current].querySelector("img");
      var caption = slides[current].querySelector(".memory-caption h3");
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerCaption.textContent = caption ? caption.textContent : image.alt;
      viewer.hidden = false;
      document.body.classList.add("viewer-open");
      viewer.querySelector(".viewer-close").focus();
    }
    function close() {
      viewer.hidden = true;
      document.body.classList.remove("viewer-open");
    }
    root.querySelectorAll("[data-open-photo]").forEach(function (button, index) {
      button.addEventListener("click", function () { open(index); });
    });
    viewer.querySelector(".viewer-close").addEventListener("click", close);
    viewer.querySelector(".viewer-prev").addEventListener("click", function () { open(current - 1); });
    viewer.querySelector(".viewer-next").addEventListener("click", function () { open(current + 1); });
    viewer.addEventListener("click", function (event) { if (event.target === viewer) close(); });
    keydownHandler = function (event) {
      if (viewer.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") open(current - 1);
      if (event.key === "ArrowRight") open(current + 1);
    };
    document.addEventListener("keydown", keydownHandler);
  }

  window.BirthdayCarousel = { init: init, destroy: destroy };
})();
