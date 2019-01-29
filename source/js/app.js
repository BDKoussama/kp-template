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
  var html = document.documentElement;
  var body = document.body;
  // Barbajs Initialisation ***********************//
  Barba.Pjax.Cache.reset()
  Barba.Pjax.init();
  Barba.Prefetch.init();
  Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container) {
    const slideShow = container.querySelector('.viewport').getAttribute('data-page') === 'index-page' ? new SlideShow(container.querySelector('.main-content')) : null;
    //const carousel = container.querySelector('.viewport').getAttribute('data-page') === 'works-page' ? new Carousel(container.querySelector('.carousel-holder')) : null ; 
    const cursor = new Cursor();
    

    var scroller = {
      target: container.querySelector("#scroll-container"),
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

    //window.addEventListener("load", onLoad);
    onLoad() 
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
      tl.add('next');
      tl.to(this.newContainer, 1, {
        opacity: 1
      }, 'next');
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
        position: 'static',
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
  var AboutTransition = Barba.BaseTransition.extend({
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
      TweenLite.set(sectionTitle, {
        yPercent: 120
      })
      TweenLite.set(aboutText, {
        yPercent: 100
      })
      TweenLite.set(hLayer, {
        xPercent: -101,
        opacity: 1
      })
      TweenLite.set(heroName, {
        opacity: 0
      })
      tl.add('start');
      tl.to(this.oldContainer, 1, {
        autoAlpha: 0
      }, 'start');
      tl.add('next');
      tl.to(this.newContainer, 1, {
        autoAlpha: 1
      }, 'next');
      tl.add('after')
      tl.to(sectionTitle, 1.5, {
        yPercent: 0,
        ease: Circ.easeOut,
        force3D: false
      }, "after");
      tl.to(aboutText, 1.5, {
        yPercent: 0,
        ease: Circ.easeOut,
        force3D: false
      }, "after")
      tl.to(hLayer, 1.5, {
        xPercent: 110,
        ease: Circ.easeOut,
        force3D: false
      }, "after")
      tl.to(heroName, 1, {
        opacity: 1
      }, "after")
    }

  });

  var ProjectTransition = Barba.BaseTransition.extend({
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
      TweenLite.set(bannerImg, {
        scale: 1.5
      });
      console.log(bannerImg)
      tl.add('start');
      tl.to(this.oldContainer, 1.2, {
        opacity: 0
      }, 'start');
      tl.add('next');
      tl.to(this.newContainer, 1, {
        opacity: 1
      }, 'next');
      tl.add('after');
      tl.to(bannerImg, 1.5, {
        scale: 1,
        ease: Circ.easeOut
      }, 'after');
    }
  });

  Barba.Pjax.getTransition = function () {
    let coverTimeline = new TimelineMax();
    TweenLite.set('.cover', {
      x: '-120%'
    })
    coverTimeline.add('start');
    coverTimeline.to('.cover', 2, {
      x: '120%',
      ease: SlowMo.ease.config(0.2, 0.5, false),
      force3D: false
    });
    let nextPage = getNewPageFile().url.split('/').pop();
    if (nextPage === 'about.html') {
      return AboutTransition;
    } else if (nextPage === 'contact.html') {
      return ContactTransition;
    } else if (nextPage.includes('project')) {
      return ProjectTransition;
    }
    return CommonTransition;
  };


  Barba.Pjax.start();
});