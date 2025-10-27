export class TypeWriter {
    constructor(element, text, speed = 50, delay = 0) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.delay = delay;
        this.currentIndex = 0;
    }

    start() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.type(resolve);
            }, this.delay);
        });
    }

    type(callback) {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(callback), this.speed);
        } else {
            if (callback) callback();
        }
    }
}
