import {
    runInThisContext
} from "vm";

class Cursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.follower');
        this.clientX = -100;
        this.clienty = -100;
        this.posX = 0;
        this.posY = 0;
        this.mouseX = -100;
        this.mouseY = -100;
        this.initEvents();
    }
    reRender() {
        this.posX += (this.mouseX - this.posX) / 9;
        this.posY += (this.mouseY - this.posY) / 9;
        TweenMax.set(this.follower, {
            css: {
                left: this.posX - 15,
                top: this.posY - 15
            }
        });
        TweenMax.set(this.cursor, {
            css: {
                left: this.mouseX,
                top: this.mouseY
            }
        });
    }
    tween() {
        TweenMax.to({}, 0.01, {
            repeat: -1,
            onRepeat: () => this.reRender()
        });
    }
    initEvents() {
        this.tween();
        document.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    getLinks(){
        [...document.querySelectorAll('a[href]')].forEach((link) => {
            link.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
                this.follower.classList.add('active')
            });
            link.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
                this.follower.classList.remove('active')
            });
        });
    }
}


export default Cursor;