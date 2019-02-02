class Cursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.follower');
        this.posX = 0;
        this.posY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.initEvents();
    }
    cb() {
        this.posX += (this.mouseX - this.posX) / 9;
        this.posY += (this.mouseY - this.posY) / 9;
        TweenMax.set(this.follower, {
            css: {
                left: this.posX - 12,
                top: this.posY - 12
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
        TweenMax.to({}, 0.01 , {
            repeat: -1,
            onRepeat: () => this.cb()
        });
    }
    initEvents() {
        this.tween();
        document.addEventListener("mousemove", (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });

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

export default Cursor ; 