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
let AboutTransition = Barba.BaseTransition.extend({
    start: function () {
      isAnimating = true;
      Promise
        .all([this.newContainerLoading, this.scrollTop()])
        .then(this.display.bind(this));
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
      TweenLite.set(sectionTitle, { yPercent: 120 });
      TweenLite.set(aboutText, { yPercent: 100 });
      TweenLite.set(hLayer, { xPercent: -101, opacity: 1 });
      TweenLite.set(heroName, { opacity: 0 });
      tl.add('start');
      tl.to(this.oldContainer, 0.8, { autoAlpha: 0 }, 'start');
      tl.add('next');
      tl.to(this.newContainer, 0.4, { autoAlpha: 1 }, 'next');
      tl.add('after');
      tl.to(sectionTitle, 1.5, { yPercent: 0, ease: Circ.easeOut, force3D: false }, "after");
      tl.to(aboutText, 1.5, { yPercent: 0,  ease: Circ.easeOut, force3D: false }, "after");
      tl.to(hLayer, 1.5, { xPercent: 110, ease: Circ.easeOut, force3D: false }, "after");
      tl.to(heroName, 1, { opacity: 1 }, "after");
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
    },
    isValid : function(){
      let nextPage =  Barba.HistoryManager.currentStatus().url.split('/').pop();
      return nextPage === 'about.html';
    }
  });

export default AboutTransition ; 