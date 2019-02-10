
   import Slide from './Slide';
   class SlideShow {
       constructor(el) {
           this.el = el;
           this.DOM = {}
           this.DOM.slideShow = this.el.querySelector('.slideshow')
           this.DOM.loadBar = this.el.querySelector('.load-bar')
           this.DOM.slides = Array.from(this.el.querySelectorAll('.slide-item'), el => new Slide(el));
           this.currentPosition = 0;
           this.isAnimating = false;
           this.totalSlides = this.DOM.slides.length;
           this.init();
       }
       init() {
           this.timer();
       }
       timer() {
           let height = 0;
           let interval = setInterval(() => {
               if (height == 100) {
                   clearInterval(interval);
                   this.getPosition();
                   height = 0;
                   this.DOM.loadBar.style.height = height + '%';
                   this.timer();
               } else {
                   height++;
                   this.DOM.loadBar.style.height = height + '%';
               }
           }, 50);
       }
       // get Slide position
       getPosition(direction = 'next') {
           this.currentSlide = this.DOM.slides[this.currentPosition];
           let newPosition = this.currentPosition = direction === 'next' ?
               this.currentPosition < this.totalSlides - 1 ? this.currentPosition + 1 : 0 :
               this.currentPosition = this.currentPosition > 0 ? this.currentPosition - 1 : this.totalSlides - 1;
           let newPost = this.DOM.slides[newPosition];
           this.changePost(newPost, newPosition);
       }
       // change new slide 
       changePost(newPost, newPosition) {
           newPost.el.classList.add('active');
           Promise.all([this.currentSlide.hide(), newPost.show()]).then(() => {
               this.currentSlide.el.classList.remove('active');
               this.currentSlide = newPost;
               this.isAnimating = false;
           });
       }
   }
   
   export default SlideShow ;