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
let CommonTransition = Barba.BaseTransition.extend({
    start: function () {
      isAnimating = true;
      Promise
        .all([this.newContainerLoading, Transitions.scrollTop()])
        .then(this.display.bind(this));
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
      // hide old container 
      tl.to(this.oldContainer, 0.8, {  opacity: 0 }, 'start');
      tl.add('next');
      // show new Container
      tl.to(this.newContainer, 0.4, {  opacity: 1 }, 'next');
    }
  }); 

  export default CommonTransition ; 