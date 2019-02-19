import {
  TimelineMax,
  TweenMax,
  SlowMo,
  TweenLite,
  Power3,
  Power0,
  Circ
} from 'gsap';
import Barba from 'barba.js';
import SlideShow from './modules/SlideShow';
import Cursor from './modules/Cursor';
import Swiper from 'swiper';
import LazyLoad from "vanilla-lazyload";
import Modal from './modules/Modal';

// onDom content load event 
document.addEventListener("DOMContentLoaded", function (event) {
  // Barbajs Initialisation -----------------------------//
  Barba.Pjax.Cache.reset()
  Barba.Pjax.init();
  Barba.Prefetch.init();
  // Image Lazy Load Configuration ----------------------//
  let lazyLoadConfig = { elements_selector: ".lazy" } ;
  // Swiper js Configuration ----------------------------//
  let swiperConfig = {
    loop: true,
    slidesPerView: 2,
    spaceBetween: 40,
    speed: 1000,
    centeredSlides: true,
    breakpoints: {
      500: {
        slidesPerView: 1,
      },
      mousewheel: {
        invert: true,
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function () {
        this.mousewheel.enable();
      }
    }
  };
  let html = document.documentElement;
  let body = document.body;
  // init Custom cursor ---------------------------------//
  const cursor = new Cursor();
  // init modal -----------------------------------------//
  const modal = new Modal(document.querySelector('.overlay'));
  // on new page ready barba.Js Event -------------------//
  Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container) {
    // update all links for the hover effect 
    cursor.getLinks();
    // init home page slide show 
    const slideShow = container.getAttribute('data-namespace') === 'home-page' ? new SlideShow(container.querySelector('.main-content')) : null;
    // init lazy load images  
    let myLazyLoad = new LazyLoad(lazyLoadConfig);
    // init Swiper js 
    let swiper = container.getAttribute('data-namespace') === 'work-page' ? new Swiper(container.querySelector('.swiper-container'), swiperConfig ) : null;
    // Smooth Scroll Configuration -------------------- // 
    let scroller = {
      target: container.querySelector("#scroll-container"), // scroll container 
      ease: 0.05, // <= scroll speed
      endY: 0,
      y: 0,
      resizeRequest: 1,
      scrollRequest: 0,
    };
    let requestId = null;

    TweenLite.set(scroller.target, {
      rotation: 0.01,
      force3D: true
    });

    function onLoad() {
      setTimeout(() => onResize(), 100);
      updateScroller();
      window.focus();
      window.addEventListener("resize", onResize);
      document.addEventListener("scroll", onScroll);
    }

    onLoad();

    function updateScroller() {

      let resized = scroller.resizeRequest > 0;

      if (resized) {
        let height = scroller.target.clientHeight;
        body.style.height = height + "px";
        scroller.resizeRequest = 0;
      }

      let scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

      scroller.endY = scrollY;
      scroller.y += (scrollY - scroller.y) * scroller.ease;

      if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
        scroller.y = scrollY;
        scroller.scrollRequest = 0;
      }

      TweenLite.set(scroller.target, {
        y: -scroller.y
      });

      requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
    }

    function onScroll() {
      scroller.scrollRequest++;
      if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
      }
    }

    function onResize() {
      scroller.resizeRequest++;
      if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
      }
    }

    function onClickLinkCheck() {
      let allLinks = Array.from(document.querySelectorAll('a[href]'));
      let preventSameLinkClick = function (e) {
        if (e.currentTarget.href === window.location.href || isAnimating) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      for (var i = 0; i < allLinks.length; i++) {
        allLinks[i].addEventListener('click', preventSameLinkClick);
      }
    }
  
    onClickLinkCheck();

  });
  // boolean for page Transitions Animation 
  let isAnimating = false;
  // Services Horizontal scroll ( About section )
  let servicesSection = () => {
    window.addEventListener('scroll', () => {
      let servicesPosition = Math.round(window.scrollY / window.innerHeight * 30);
      TweenMax.to('.services', 1, {
        xPercent: servicesPosition,
        ease: Power0.easeNone,
        force3D: false
      })
    })
  }
  // init serviceSection
  servicesSection();
  // function to get the New URL
  let getNewUrl = function () {
    // returns the link File or page ex 2.html
    return Barba.HistoryManager.currentStatus();
  }
  // get Previous URL
  let getPrevUrl = function () {
    // returns the link File or page ex 2.html
    return Barba.HistoryManager.prevStatus();
  }
  // show Preloader between Transitions 
  let preLoader = function(){
    let coverTimeline = new TimelineMax();
    function init(){
      TweenLite.set('.cover', { x: '-120%' });
    }
    function show(deferred){ 
      coverTimeline.to('.cover', 1 , {
        x: '0%',
        ease: Power0.easeNone,
        force3D: false,
        onComplete: function () {
          deferred.resolve();
        }
      });
    }
    function remove(){
        coverTimeline.to('.cover', 1 , {
          x: '120%',
          ease: Power0.easeNone,
          force3D: false
        });
    }
      return{
        init : init,
        show: show,
        remove : remove
      }
  }();

  // Barbajs Transitions --------------------------//

  let Transitions = {
    CommonTransition: Barba.BaseTransition.extend({
      start: function () {
        isAnimating = true;
        Promise
          .all([this.newContainerLoading, this.showPreloader()])
          .then(this.hidePreloader.bind(this));
      },
      showPreloader: function(){
        var deferred = Barba.Utils.deferred();
          preLoader.init();
          preLoader.show(deferred);
          return deferred.promise;
      },
      hidePreloader: function(){
        var _this = this;
        var tl = new TimelineMax({
          onComplete: function () {
            _this.newContainer.style.position = 'static';
            isAnimating = false;
            _this.done();
          }
        });
        TweenLite.set(this.newContainer, {
          visibility: 'visible',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
        });
        tl.add('start');
        // hide old container 
        tl.to(this.oldContainer, 0.2, {  autoAlpha: 0 }, 'start');
        preLoader.remove();
        tl.add('next');
        // show new Container
        tl.to(this.newContainer, 0.8, {  autoAlpha: 1 }, 'next');
      }
    }),
    ToContact: Barba.BaseTransition.extend({
      start: function () {
        isAnimating = true;
        Promise
          .all([this.newContainerLoading, this.showPreloader()])
          .then(this.hidePreloader.bind(this));
      },
      showPreloader: function(){
        var deferred = Barba.Utils.deferred();
          preLoader.init();
          preLoader.show(deferred);
          return deferred.promise;
      },
      hidePreloader: function(){
        var _this = this;
        var tl = new TimelineMax({
          onComplete: function () {
            _this.newContainer.style.position = 'static';
            _this.done();
            isAnimating = false;
          }
        });
        let sectionTitle = this.newContainer.querySelector('.section-title h1');
        let contactInfo = this.newContainer.querySelector('.contact-info');
        TweenLite.set(this.newContainer, {
          position: 'static',
          visibility: 'visible',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
        });
        TweenLite.set(sectionTitle, { yPercent: 120 });
        TweenLite.set(contactInfo, { yPercent: 150 })
        tl.add('start');
        tl.to(this.oldContainer, 0.2, { autoAlpha: 0 }, 'start');
        preLoader.remove();
        tl.add('next');
        tl.to(this.newContainer, 0.4, { opacity: 1 }, 'next');
        tl.add('after')
        tl.to(sectionTitle, 1.5, { yPercent: 0, ease: Circ.easeOut, force3D: false }, "after");
        tl.to(contactInfo, 1.5, { yPercent: 0, ease: Circ.easeOut, force3D: false }, "after");
      },
      isValid : function(){
        let nextPage =   getNewUrl().url.split('/').pop();
        return nextPage === 'contact.html';
      }
    }),
    ToAbout: Barba.BaseTransition.extend({
      start: function () {
        isAnimating = true;
        Promise
          .all([this.newContainerLoading, this.showPreloader()])
          .then(this.hidePreloader.bind(this));
      },
      showPreloader: function(){
        var deferred = Barba.Utils.deferred();
          preLoader.init();
          preLoader.show(deferred);
          return deferred.promise;
      },
      hidePreloader: function () {
        var _this = this;
        var tl = new TimelineMax({
          onComplete: function () {
            _this.newContainer.style.position = 'static';
            _this.done();
            isAnimating = false;
          }
        });
        let sectionTitle = this.newContainer.querySelector('.section-title h1');
        let hLayer = this.newContainer.querySelector('.h-layer');
        let aboutText = this.newContainer.querySelector('.about-text');
        let heroName = this.newContainer.querySelector('.h-name h1');
        TweenLite.set(this.newContainer, {
          position: 'fixed',
          visibility: 'visible',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
        });
        TweenLite.set(sectionTitle, { yPercent: 120 });
        TweenLite.set(aboutText, { yPercent: 100 });
        TweenLite.set(hLayer, { xPercent: -101, opacity: 1 });
        TweenLite.set(heroName, { opacity: 0 });
        tl.add('start');
        tl.to(this.oldContainer, 0.2, { autoAlpha: 0 }, 'start');
        preLoader.remove();
        tl.add('next');
        tl.to(this.newContainer, 0.4, { autoAlpha: 1 }, 'next');
        tl.add('after');
        tl.to(sectionTitle, 1.5, { yPercent: 0, ease: Circ.easeOut, force3D: false }, "after");
        tl.to(aboutText, 1.5, { yPercent: 0,  ease: Circ.easeOut, force3D: false }, "after");
        tl.to(hLayer, 1.5, { xPercent: 110, ease: Circ.easeOut, force3D: false }, "after");
        tl.to(heroName, 1, { opacity: 1 }, "after");
      },
      isValid : function(){
        let nextPage =  getNewUrl().url.split('/').pop();
        return nextPage === 'about.html';
      }
    }),
    HomeToProject: Barba.BaseTransition.extend({
      start: function () {
        isAnimating = true;
        Promise
          .all([this.newContainerLoading, this.showPreloader()])
          .then(this.hidePreloader.bind(this));
      },
      showPreloader: function(){
        var deferred = Barba.Utils.deferred();
          preLoader.init();
          preLoader.show(deferred);
          return deferred.promise;
      },
      hidePreloader: function () {
        var _this = this;
        var tl = new TimelineMax({
          onComplete: function () {
            _this.newContainer.style.position = 'static';
            _this.done();
            isAnimating = false;
          }
        });
        TweenLite.set(this.newContainer, {
          position: 'fixed',
          visibility: 'visible',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
        });
        let bannerImg = this.newContainer.querySelector('.banner-img');
        TweenLite.set(bannerImg, { scale: 1.5 });
        tl.add('start');
        tl.to(this.oldContainer, 0.2, { opacity: 0 }, 'start');
        preLoader.remove();
        tl.add('next');
        tl.to(this.newContainer, 0.4, { opacity: 1 }, 'next');
        tl.add('after');
        tl.to(bannerImg, 1.5, { scale: 1, ease: Circ.easeOut }, 'after');
      },
      isValid : function(){
        let nextPage =   getNewUrl().url.split('/').pop();
        let prevPage = getPrevUrl();
        return nextPage.includes('project') && prevPage !== 'project-page' ;
      }
    }),
    NextProject: Barba.BaseTransition.extend({
      start : function(){
        isAnimating = true;
        Promise
          .all([this.newContainerLoading, this.scrollTop()])
          .then(this.display.bind(this));
      },
      display: function(){
        var _this = this;
        var tl = new TimelineMax({
          onComplete: function () {
            _this.newContainer.style.position = 'static';
            _this.done();
            isAnimating = false;
          }
        });
        TweenLite.set(this.newContainer, {
          position: 'fixed',
          visibility: 'visible',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
        });
        let bannerImg = this.newContainer.querySelector('.banner-img');
        TweenLite.set(bannerImg, { scale: 1.5 });
        tl.add('start');
        tl.to(this.oldContainer, 0.2, { opacity: 0 }, 'start');
        tl.add('next');
        tl.to(this.newContainer, 0.4, { opacity: 1 }, 'next');
        tl.add('after');
        tl.to(bannerImg, 1.5, { scale: 1, ease: Circ.easeOut }, 'after');
      },
      isValid: function(){
        let nextPage =   getNewUrl().url.split('/').pop();
        let prevPage = getPrevUrl();
        return nextPage.includes('project') && prevPage.namespace === 'project-page' ;
      },
      scrollTop: function () {
        var deferred = Barba.Utils.deferred();
        var obj = {
          y: window.pageYOffset
        };
  
        TweenLite.to(obj, 0.4, {
          y: 0,
          onUpdate: function () {
            if (obj.y === 0) {
              deferred.resolve();
            }
            window.scroll(0, obj.y);
          },
          onComplete: function () {
            deferred.resolve();
          }
        });
  
        return deferred.promise;
      }
    })
  }

  // Return valid Transition ----------------- //
  Barba.Pjax.getTransition = function () { 
    if (Transitions.ToAbout.isValid()) {  
      return Transitions.ToAbout;
    } 
    if (Transitions.NextProject.isValid()) {  
      return Transitions.NextProject;
    } 
    if (Transitions.ToContact.isValid()) {
      return Transitions.ToContact;
    } 
    if (Transitions.HomeToProject.isValid()) {
      return Transitions.HomeToProject;
    }
    return Transitions.CommonTransition;
  };
  // start Barbajs 
  Barba.Pjax.start();
});