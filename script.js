'use strict';

// DOM Elements
const elements = {
  modalElements: document.querySelectorAll('.modal, .overlay'),
  btnsOpenModal: document.querySelectorAll('.btn--show-modal'),
  btnsCloseModal: document.querySelectorAll('.btn--close-modal, .overlay'),
  btnsSmoothScr: [
    ...document.querySelectorAll(
      '.btn--scroll-to, .nav__links :not(:last-child)'
    ),
  ],
  navLinks: document.querySelectorAll('.nav__link'),

  nav: document.querySelector('.nav'),
  header: document.querySelector('.header__title'),

  tabsContainer: document.querySelector('.operations__tab-container'),
  tabs: document.querySelectorAll('.operations__tab'),
  operationsContent: document.querySelectorAll('.operations__content'),

  sections: [...document.querySelectorAll('.section')],

  secImages: document.querySelectorAll('.features__img'),

  slider: document.querySelector('.slider'),
  slides: document.querySelectorAll('.slide'),
  sliderBtnRight: document.querySelector('.slider__btn--right'),
  sliderBtnLeft: document.querySelector('.slider__btn--left'),

  dotsContainer: document.querySelector('.dots'),
  dots: document.querySelectorAll('.dots__dot'),
};
let curSlide = 0;

//////////////////////// Functions \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Opens modal window
const openModal = e => {
  e.preventDefault();
  elements.modalElements.forEach(el => el.classList.remove('hidden'));
};

// Closes modal window
const closeModal = e => {
  if (!e.key || e.key === 'Escape')
    elements.modalElements.forEach(el => el.classList.add('hidden'));
};

// Smooth scroll
const smoothScroll = e => {
  e.preventDefault();
  elements.sections[Number(e.target.dataset.scrollTo) - 1].scrollIntoView({
    behavior: 'smooth',
  });
};

// Hide other nav links on hover
const navHoverEffect = (e, mouseLeave) => {
  if (mouseLeave) {
    elements.navLinks.forEach(link => link.classList.remove('hide-nav-link'));
    return;
  }

  elements.navLinks.forEach(link => link.classList.add('hide-nav-link'));
  e.target.classList.remove('hide-nav-link');
};

// Modal window opening & closing handlers
elements.btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
elements.btnsCloseModal.forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', closeModal);

// Smooth scroll handlers
elements.btnsSmoothScr.forEach(btn =>
  btn.addEventListener('click', smoothScroll)
);

// Operation tabs switcher
const switchTab = e => {
  if (e.target !== elements.tabsContainer) {
    const target = e.target.closest('.operations__tab');

    // hide previous active tab & content
    elements.tabs.forEach(tab =>
      tab.classList.remove('operations__tab--active')
    );
    elements.operationsContent.forEach(con =>
      con.classList.remove('operations__content--active')
    );

    // make the clicked tab & content active
    target.classList.add('operations__tab--active');
    target.parentNode.parentNode
      .querySelector(`.operations__content--${target.dataset.tab}`)
      .classList.add('operations__content--active');
  }
};

// Makes the navigation sticky after scrolling
const stickyNav = entries => {
  const [entry] = entries;

  if (entry.intersectionRatio <= 0.8) {
    elements.nav.classList.add('sticky');
    setTimeout(() => {
      elements.nav.classList.add('animate-sticky-nav');
    }, 20);
    elements.header.classList.add('sticky-active');
  } else {
    elements.nav.classList.remove('sticky', 'animate-sticky-nav');
    elements.header.classList.remove('sticky-active');
  }
};

// Animate sections & make them visible on scroll
const revealSections = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  });
};

// Lazy load images on scroll
const loadImage = (entries, observer) => {
  entries.forEach(entry => {
    const target = entry.target;

    if (entry.isIntersecting) {
      target.setAttribute('src', target.dataset.src);

      target.addEventListener('load', () =>
        target.classList.remove('lazy-img')
      );

      observer.unobserve(target);
    }
  });
};

// Testimonials slider
const slideElement = e => {
  const target = e.keyCode || e.target;

  if (
    target !== elements.sliderBtnRight &&
    target !== elements.sliderBtnLeft &&
    target !== 37 &&
    target !== 39
  )
    return;

  // right button click
  if (target === elements.sliderBtnRight) {
    if (curSlide === 2) curSlide = 0;
    else curSlide++;

    goToSlide();
  }
  // left button click
  else if (target === elements.sliderBtnLeft) {
    if (curSlide === 0) curSlide = 2;
    else curSlide--;

    goToSlide();
  } else if (target === 37) {
    elements.sliderBtnLeft.click();
  } else {
    elements.sliderBtnRight.click();
  }

  // time to highlight the appropriate dot
  highlightDot(elements.dots[curSlide]);
};

const slideElementWithDots = e => {
  const target = e.target;

  if (!target.classList.contains('dots__dot')) return;

  highlightDot(target);

  curSlide = parseInt(target.dataset.slide);

  goToSlide();
};

// helper function for slider function
const goToSlide = () => {
  elements.slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  });
};

// Highlights the appropriate dot
const highlightDot = dot => {
  elements.dots.forEach(dot => dot.classList.remove('dots__dot--active'));
  dot.classList.add('dots__dot--active');
};

//////////////////////// Event Listeners \\\\\\\\\\\\\\\\\\\\\\\\\
// Navigation links on hover handlers
elements.navLinks.forEach(link =>
  link.addEventListener('mouseenter', navHoverEffect)
);
elements.navLinks.forEach(link =>
  link.addEventListener('mouseleave', navHoverEffect.bind(null, true))
);

// Operations tab switch handlers
elements.tabsContainer.addEventListener('click', switchTab);

// Sticky navigation handler
const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0.8,
});
observer.observe(elements.header);

// Reaviling Sections on scroll handler
const sectionsObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.2,
});
elements.sections.forEach(section => sectionsObserver.observe(section));

// Lazy loading of images handler
const imagesObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '150px',
});
elements.secImages.forEach(img => imagesObserver.observe(img));

// Testimonials slider handler
elements.slider.addEventListener('click', slideElement);

// Sliding the sliders with arrow keys
document.addEventListener('keydown', slideElement);

// Sliding the sliders on dots click
elements.dotsContainer.addEventListener('click', slideElementWithDots);
