import {TweenLite} from 'gsap' ; 
class LazyScroll {
    constructor(element){
        this.el = element ; 
        this.scroller = { 
            target: this.el,
            ease: 0.05, // <= scroll speed
            endY: 0,
            y: 0,
            resizeRequest: 1,
            scrollRequest: 0,
        };
        this.requestId = null ; 
        this.html = document.documentElement;
        this.body = document.body;
        this.init();
    }
    init(){
        TweenLite.set(this.scroller.target, {
            rotation: 0.01,
            force3D: true
        });
        this.onLoad();
        this.bindEvents();
    }
    onLoad() {
        this.updateScroller();
        window.focus();  
    }
    bindEvents(){
        window.addEventListener("resize", () => this.onResize());
        document.addEventListener("scroll", () => this.onScroll());
    }
     updateScroller() {

        var resized = this.scroller.resizeRequest > 0;
  
        if (resized) {
          var height = this.scroller.target.clientHeight;
          this.body.style.height = height + "px";
          this.scroller.resizeRequest = 0;
        }
  
        var scrollY = window.pageYOffset || this.html.scrollTop || this.body.scrollTop || 0;
  
        this.scroller.endY = scrollY;
        this.scroller.y += (scrollY - this.scroller.y) * this.scroller.ease;
  
        if (Math.abs(scrollY - this.scroller.y) < 0.05 || resized) {
          this.scroller.y = scrollY;
          this.scroller.scrollRequest = 0;
        }
  
        TweenLite.set(this.scroller.target, {
          y: -this.scroller.y
        });
  
        this.requestId = this.scroller.scrollRequest > 0 ? requestAnimationFrame(this.updateScroller()) : null;
      }
       onScroll() {
        this.scroller.scrollRequest++;
        if (!this.requestId) {
          this.requestId = requestAnimationFrame(() => this.updateScroller ());
        }
      }
  
       onResize() {
        this.scroller.resizeRequest++;
        if (!this.requestId) {
          this.requestId = requestAnimationFrame(() => this.updateScroller());
        }
      }
}

export default LazyScroll ; 