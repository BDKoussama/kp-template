import {
    TimelineMax,
    TweenMax,
    SlowMo,
    TweenLite,
    Power1,
    Elastic,
    Power3,
    Circ
} from 'gsap' ;
 class Slide {
    constructor(element){
        this.el = element ; 
        this.DOM = {};
        this.DOM.img = this.el.querySelector('.slide-content');
        this.DOM.title = this.el.querySelectorAll('.slide-title');
        this.DOM.index = this.el.querySelectorAll('.slide-index');
        this.options = { movement: { img: { translation: { x: -30, y: -30 } } } } ;
        this._initEvents();
    }
    _initEvents() {
        this.mouseenterFn = (ev) => {
            //TweenMax.killTweensOf(this.DOM.img);
        };

        this.mousemoveFn = (ev) => {
            requestAnimationFrame(() => this._layout(ev));
        };

        this.mouseleaveFn = (ev) => {
            requestAnimationFrame(() => {
                TweenMax.to(this.DOM.img , 1 , { x : 0 , y : 0 , ease: Elastic.easeOut.config(1.75, 0.3) })
            });
        };

        this.el.addEventListener('mousemove', this.mousemoveFn);
        this.el.addEventListener('mouseleave', this.mouseleaveFn);
        this.el.addEventListener('mouseenter', this.mouseenterFn);
    }
    // from http://www.quirksmode.org/js/events_properties.html#position
    getMousePos(ev) {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        } else if (ev.clientX || ev.clientY) {
            posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {
            x: posx,
            y: posy
        };
    };

    _layout(ev) {
        // Mouse position relative to the document.
        const mousepos = this.getMousePos(ev);
        // Document scrolls.
        const docScrolls = {
            left: document.body.scrollLeft + document.documentElement.scrollLeft,
            top: document.body.scrollTop + document.documentElement.scrollTop
        };
        const bounds = this.el.getBoundingClientRect();
        // Mouse position relative to the main element (this.DOM.el).
        const relmousepos = {
            x: mousepos.x - bounds.left - docScrolls.left,
            y: mousepos.y - bounds.top - docScrolls.top
        };
        // Movement settings for the animatable elements.
        const t = {
            img: this.options.movement.img.translation,
        };
        
        const transforms = {
            img: {
                x: (-1 * t.img.x - t.img.x) / bounds.width * relmousepos.x + t.img.x,
                y: (-1 * t.img.y - t.img.y) / bounds.height * relmousepos.y + t.img.y
            },
        };
        this.DOM.img.style.WebkitTransform = this.DOM.img.style.transform = 'translateX(' + transforms.img.x + 'px) translateY(' + transforms.img.y + 'px)';
    };
   
    hide(){
        return this.toggle('hide');
    }
    show(){ 
        return this.toggle('show');
    }
    toggle(action) {
        return new Promise((resolve, reject) => { 
            TweenMax.to(this.DOM.img , 0.5 , { opacity: action === 'hide' ? 0 : 1 , ease: Circ.easeOut  });
            TweenMax.fromTo(this.DOM.title , 1 , { yPercent: action === 'hide' ? 0 : '150%'} ,{ yPercent: action === 'hide' ? '-150%' : 0 , ease:  Power1.easeInOut });
            TweenMax.fromTo(this.DOM.index , 1, { yPercent: action === 'hide' ? 0 : '150%'} ,{ yPercent: action === 'hide' ? '-150%' : 0 , ease:  Power1.easeInOut , onComplete: resolve});
        }); 
    }
}


export default Slide ; 