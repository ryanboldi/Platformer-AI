class Ground {
    /**
     * 
     * @param {number} x X Coord of top left of ground
     * @param {number} y y Coord of top left of ground
     * @param {number} width width of the ground
     */
    constructor(x, y) {
        this.pos = createVector(x, y, width);//top left position
        this.width = width;
    }

    Show() {
        fill(50, 155, 0);//ground
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