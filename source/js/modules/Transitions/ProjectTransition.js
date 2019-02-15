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
let ProjectTransition = Barba.BaseTransition.extend({
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
      tl.to(this.oldContainer, 0.8, { opacity: 0 }, 'start');
      tl.add('next');
      tl.to(this.newContainer, 0.4, { opacity: 1 }, 'next');
      tl.add('after');
      tl.to(bannerImg, 1.5, { scale: 1, ease: Circ.easeOut }, 'after');
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
    valid : function(){
      let nextPage =   Barba.HistoryManager.currentStatus().url.split('/').pop();
      let prevPage = Barba.HistoryManager.prevStatus();
      return nextPage.includes('project') && prevPage !== 'project-page' ;
    }
  });

  export default ProjectTransition ; 