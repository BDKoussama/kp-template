class Modal {
    constructor(element){
        this.el = element;
        this.menuIcon = document.querySelector('.menu-icon');
        this.menuList = this.el.querySelector('.menu-list');
        this.menuItems = this.menuList.querySelectorAll('.menu-item a[href]');
        console.log(this.menuItems)
        this.isHidden = true ;
        this.overlayAnimation =  new TimelineMax();
        this.init();
    }
    init(){
        this.bindEvents();
    }
    bindEvents(){
        this.menuIcon.addEventListener('click', () => this.toggle());
        this.menuItems.forEach(element => {
            element.addEventListener('click' , () => { 
                    this.toggle();
            });
        });
        
    }
    show(){
        this.el.classList.add('overlay-visible');
        this.overlayAnimation.to(this.el , 0.5 , { autoAlpha : 1  , ease: Power0.easeNone}); 
        this.isHidden = false ;
    }
    hide(){
        this.overlayAnimation.to(this.el , 0.5 , { autoAlpha : 0  , ease: Power0.easeNone}); 
        this.isHidden = true ;
    }
    toggle(){
        this.menuIcon.classList.toggle('clicked');
        this.isHidden ? this.show() : this.hide()
    }   


}

export default Modal ; 
