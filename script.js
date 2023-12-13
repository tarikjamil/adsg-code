function runSplit() {
  text = new SplitType("[animation=loading-split]", {
    types: "lines",
    lineClass: "loading-animation-split",
  });
  textfade = new SplitType("[animation=split-fade]", {
    types: "lines",
    lineClass: "animation-split-fade",
  });

  // Wrap each line in a div with class 'overflow-hidden'
  $(".loading-animation-split").each(function () {
    $(this).wrap("<div class='overflow-hidden'></div>");
  });
  $(".animation-split-fade").each(function () {
    $(this).wrap("<div class='overflow-hidden'></div>");
  });
}

runSplit();

// Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    text.revert();
    textfade.revert();
    runSplit();
  }
});

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollSmoother);

ScrollSmoother.create({
  smooth: 1,
  effects: true,
});

CustomEase.create("smooth", "M0,0 C0.38,0.005 0.215,1 1,1");

// On Page Load
function pageLoad() {
  let tl = gsap.timeline();

  tl.to(".main-wrapper", {
    opacity: 1,
    ease: "smooth",
    duration: 0.6,
  });

  // Add a label to mark the starting point of simultaneous animations
  tl.add("loadingAnimationsStart");

  // Add the 'loading' animation and set its position to the label
  tl.from(
    ".loading-animation-split",
    {
      y: "100%",
      opacity: "0",
      stagger: { each: 0.1, from: "start" },
      ease: "smooth",
      duration: 0.6,
    },
    "loadingAnimationsStart"
  );
  tl.from(
    "[animation=loading]",
    {
      y: "20rem",
      opacity: "0",
      stagger: { each: 0.1, from: "start" },
      ease: "smooth",
      duration: 0.6,
    },
    "loadingAnimationsStart"
  ); // <-- position parameter set to the label

  // Add the 'loading-reverse' animation and set its position to the label
  tl.from(
    "[animation=loading-reverse]",
    {
      y: "-20rem",
      opacity: "0",
      stagger: { each: 0.1, from: "start" },
      ease: "smooth",
      duration: 1,
    },
    "loadingAnimationsStart"
  ); // <-- position parameter set to the label
}

pageLoad();

// marquee is--scrolling
const scrollSpeed = 50; // pixels per second, adjust as needed

function updateScrollingSpeed() {
  document.querySelectorAll(".marquee--row").forEach((element) => {
    const scrollWidth = element.offsetWidth;
    const duration = scrollWidth / scrollSpeed; // seconds

    element.style.setProperty("--scroll-width", `${scrollWidth}px`);
    element.style.animationDuration = `${duration}s`;
  });
}

// Call initially
updateScrollingSpeed();

// Update on window resize
window.addEventListener("resize", updateScrollingSpeed);

// hero animation on scroll
gsap.to(".section.is--hero", {
  scrollTrigger: {
    trigger: ".section.is--hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
    markers: false,
  },
  scale: 0.8,
});

gsap.utils.toArray("[animation=split-fade]").forEach((container) => {
  const splitFadeElements = container.querySelectorAll(".animation-split-fade");

  gsap.from(splitFadeElements, {
    scrollTrigger: {
      trigger: container,
      start: "top bottom", // When the top of the container hits the bottom of the viewport
      end: "bottom top", // When the bottom of the container leaves the top of the viewport
      toggleActions: "play none none none", // Play the animation when the container enters the viewport
      once: true, // Ensures the animation only triggers once
    },
    opacity: 0,
    y: "100%", // translateY
    duration: 0.6, // Duration of the animation
    ease: "smooth", // Custom easing function
    stagger: {
      amount: 0.1, // Total time for the stagger (in seconds)
    },
  });
});

// navbar is--scrolling animation
ScrollTrigger.create({
  trigger: ".navbar",
  start: "top+=200",
  end: "top+=200",
  onEnter: () =>
    gsap.to(".navbar", {
      backgroundColor: "var(--light-blue)",
      ease: "smooth",
      duration: 0.6,
    }),
  onLeaveBack: () =>
    gsap.to(".navbar", {
      backgroundColor: "",
      ease: "smooth",
      duration: 0.6,
    }), // Assuming the original color is the default
  toggleActions: "play none none reverse",
});

// navbar menu
let isMenuOpen = false; // Track if the menu is open

document.querySelector(".menu--trigger").addEventListener("click", function () {
  let tl = gsap.timeline();

  if (!isMenuOpen) {
    // Set initial styles for opening
    gsap.set(".navbar--menu", {
      display: "flex",
      top: "-50rem",
      height: "0vh",
    });
    gsap.set(".navbar--menu-logo", { bottom: "50rem" });
    gsap.set(".menu--trigger-icon-toopen", { right: "0rem", opacity: "1" });
    gsap.set(".menu--trigger-icon-toclose", { right: "-40rem", opacity: "0" });

    // Add animations to the timeline for opening
    tl.to(
      ".navbar--menu",
      { top: "0rem", height: "100vh", duration: 0.6, ease: "smooth" },
      0
    )
      .to(
        ".navbar--menu-logo",
        { bottom: "0rem", duration: 0.6, ease: "smooth" },
        0
      )
      .to(
        ".menu--trigger-icon-toopen",
        { right: "40rem", opacity: "0", duration: 0.6, ease: "smooth" },
        0
      )
      .to(
        ".menu--trigger-icon-toclose",
        { right: "0rem", opacity: "1", duration: 0.6, ease: "smooth" },
        0
      );

    isMenuOpen = true;
  } else {
    // Reverse the animations for closing
    tl.to(
      ".navbar--menu",
      { top: "-50rem", height: "0vh", duration: 0.6, ease: "smooth" },
      0
    )
      .to(
        ".navbar--menu-logo",
        { bottom: "50rem", duration: 0.6, ease: "smooth" },
        0
      )
      .to(
        ".menu--trigger-icon-toopen",
        { right: "0rem", opacity: "1", duration: 0.6, ease: "smooth" },
        0
      )
      .to(
        ".menu--trigger-icon-toclose",
        { right: "-40rem", opacity: "0", duration: 0.6, ease: "smooth" },
        0
      )
      .then(() => gsap.set(".navbar--menu", { display: "none" })); // Hide the menu after animation

    isMenuOpen = false;
  }
});
