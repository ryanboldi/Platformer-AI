class Ground {
    /**
     * 
     * @param {number} x X Coord of top left of ground
     * @param {number} y y Coord of top left of ground
     * @param {number} w width of the ground
     */
    constructor(x, y, w) {
        this.pos = createVector(x, y);//top left position
        this.width = w;

        this.isNext = false;
    }

    Show() {
        if (this.isNext) fill(0, 30, 150);
        else fill(50, 155, 0);//ground
        stroke(0);
        strokeWeight(1);
        rect(this.pos.x, this.pos.y, this.width, groundHeight);
    }

    Update() {
        //move to the left at x speed
        this.pos.x -= groundSpeed;
    }

    Move() {

    }
}