class Carousel {
    constructor(element){
        this.el = element ; 
        this.nextTrg = document.querySelector('.trigger-next') ; 
        this.prevTrg = document.querySelector('.trigger-prev'); 
        this.carouselItems = Array.from(this.el.querySelectorAll('.carousel-item'));
        console.log(this.carouselItems);
        this.wScreen = window.innerWidth; 
        this.midScreen = this.wScreen /2 ; 
        this.isAnimating = false ; 
        this.itemsLenght = this.carouselItems.length;
        this.count = 1 ; 
        this.init();
    }
    init(){
        this.bindEvents();
    }
    bindEvents(){
        this.nextTrg.addEventListener('click' , () => { 
            if(this.count < this.itemsLenght   && !this.isAnimating) { 
                this.animate('next');
            }
        });
        this.prevTrg.addEventListener('click' , () =>{
            if(this.count > 1 && !this.isAnimating) { 
                this.animate('previous');
            }
        } );
    }
    notAnimating() {
        this.isAnimating = false ; 
    }
    // Fix Counter after 
    animate(direction){
        this.isAnimating = true;
        TweenMax.to( this.el ,1.8,{x: direction === 'next' ? '-='+this.wScreen  : '+='+this.wScreen , ease: Power3.easeInOut, onComplete: () => this.notAnimating()})
        this.count = direction === 'next' ? this.count + 1 : this.count - 1;
    }

}

export default Carousel ; 