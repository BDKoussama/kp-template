import {
  TimelineMax,
  TweenMax,
  SlowMo,
  TweenLite,
  Power3,
  Circ
} from 'gsap';
import Barba from 'barba.js';
import SlideShow from './modules/SlideShow';
import Cursor from './modules/Cursor';
import Carousel from './modules/Carousel';
document.addEventListener("DOMContentLoaded", function (event) {

  // Barbajs Initialisation ***********************//
  Barba.Pjax.Cache.reset()
  Barba.Pjax.init();
  Barba.Prefetch.init();
  Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container) {
    //const slideShow = container.querySelector('.viewport').getAttribute('data-page') === 'index-page' ? new SlideShow(container.querySelector('.main-content')) : null;
    //const carousel = container.querySelector('.viewport').getAttribute('data-page') === 'works-page' ? new Carousel(container.querySelector('.carousel-holder')) : null ; 
    //const cursor = new Cursor()
  });

  // *********************************************// 
  let links = document.querySelectorAll('a[href]');
  let isAnimating = false;

  window.addEventListener('scroll', () => {
    let servicesPosition = Math.round($(window).scrollTop() / $(window).height() * 25);
    TweenMax.to('.services', 3, {
      xPercent: servicesPosition,
      ease: Circ.easeOut
    })
  })

  let getNewPageFile = function () {
    // returns the link File or page ex 2.html
    return Barba.HistoryManager.currentStatus();
  }

  let cbk = function (e) {
    if (e.currentTarget.href === window.location.href & isAnimating) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  links.forEach(link => link.addEventListener('click ', cbk))

// Barbajs Transitions ************************* //

var CommonTransition = Barba.BaseTransition.extend({
  start: function () {
      isAnimating = true;
      Promise
          .all([this.newContainerLoading, this.scrollTop()])
          .then(this.display.bind(this));
  },
  
  // scrollTop returns a promise so the before toggling next animation it waits until promise is resolved and scrolltop = 0 
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
  },

  display: function () {
      var _this = this;
      var tl = new TimelineMax({
          onComplete: function () {
              _this.newContainer.style.position = 'static';
               isAnimating = false;
              _this.done();
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
      tl.add('start');
      tl.to(this.oldContainer, 1.2, {
          opacity: 0
      }, 'start');
      //tl.add('start');
      tl.to(this.newContainer, 1, {
          opacity: 1
      }, '+=start');
  }
});

var ContactTransition = Barba.BaseTransition.extend({
  start: function () {
      isAnimating = true;
      Promise
          .all([this.newContainerLoading, this.scrollTop()])
          .then(this.display.bind(this));
  },
  // scrollTop returns a promise so the before toggling next animation it waits until promise is resolved and scrolltop = 0 
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
  },

  display: function () {
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
          position: 'fixed',
          visibility: 'visible',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
      });
      TweenLite.set(sectionTitle, {
          yPercent: 120
      })
      TweenLite.set(contactInfo, {
          yPercent: 150
      })

      tl.add('start');
      tl.to(this.oldContainer, 1.2, {
          autoAlpha: 0
      }, 'start');
      tl.add('next');
      tl.to(this.newContainer, 1, {
          opacity: 1
      }, 'next');
      tl.add('after')
      tl.to(sectionTitle, 1.5, {
          yPercent: 0,
          ease: Circ.easeOut,
          force3D: false
      }, "after");
      tl.to(contactInfo, 1.5, {
          yPercent: 0,
          ease: Circ.easeOut,
          force3D: false
      }, "after");

  }

});
  var html = document.documentElement;
  var body = document.body;

  var scroller = {
    target: document.querySelector("#scroll-container"),
    ease: 0.05, // <= scroll speed
    endY: 0,
    y: 0,
    resizeRequest: 1,
    scrollRequest: 0,
  };

  var requestId = null;

  TweenLite.set(scroller.target, {
    rotation: 0.01,
    force3D: true
  });

  window.addEventListener("load", onLoad);

  function onLoad() {
    updateScroller();
    window.focus();
    window.addEventListener("resize", onResize);
    document.addEventListener("scroll", onScroll);
  }

  function updateScroller() {

    var resized = scroller.resizeRequest > 0;

    if (resized) {
      var height = scroller.target.clientHeight;
      body.style.height = height + "px";
      scroller.resizeRequest = 0;
    }

    var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

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

});