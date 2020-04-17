class Player {
    constructor(genome) {
        this.pos = createVector(player_x, player_y); //position vector of this player
        this.vel = createVector(0, 0)// WE ONLY CARE ABOUT Y VELOCITY AS PLAYER WON'T BE MOVING ON X.

        this.r = player_r;
        //HITBOX will be a rectangle of height 4*r, and length 2*r

        this.fitness = 0;
        this.dead = false;

        this.onFloor = false;

        if (genome) {
            this.brain = genome;
        } else {
            this.brain = new Genome(4, 1);
        }

    }

    //draw the player to canvas
    Show() {
        if (this.dead == false) {
            fill(255, 195, 177);
            stroke(0);
            strokeWeight(0.5);

            //we want two ellipses, one on top and one on bottom, with some lines connecting them to make a player shape
            //so if x,y is center, the ellipses will start at y-r and y+r
            noStroke();
            //BOTTOM ELLIPSE
            ellipse(this.pos.x, this.pos.y + this.r, this.r * 1.8, this.r * 2);
            //LINES CONNECTING COULD BE DONE WITH A RECTANGLE
            rect(this.pos.x - this.r + (this.r * 0.1), this.pos.y - this.r, this.r * 1.8, this.r * 2);
            //TOP ELLIPSE -> we want a smiley face 
            stroke(0);
            //face
            ellipse(this.pos.x, this.pos.y - this.r, this.r * 2, this.r * 2);
            //eye (he's facing the right so only one eye visible)
            noStroke();
            fill(255);
            ellipse(this.pos.x + (this.r / 2.5), this.pos.y - (this.r * 1.2), this.r / 3, this.r / 3); //eye white
            fill(0, 0, 100);
            ellipse(this.pos.x + (this.r / 2.5) + (this.r / 15), this.pos.y - (this.r * 1.2), this.r / 8, this.r / 8);
            //ellipse(this.pos.x - (this.r / 2.5), this.pos.y - (this.r * 1.2), this.r / 4, this.r / 4);
            //mouth
            stroke(0);
            strokeWeight(0.7);
            noFill();
            //we want him to smile more based on how good his fitness is!
            let happiness = 0;
            //proportional fitness
            let prop = this.fitness / best_fitness;
            if (prop < 0.5) {
                //we want him unhappy -0.3 ---> -1 
                happiness = map(prop, 0, 0.5, -0.3, -1);
            } else {
                //happy 0.3 --> 1
                happiness = map(prop, 0.5, 1, 1, 0.3);
            }
            curve(this.pos.x + this.r, this.pos.y - (this.r / 2), this.pos.x + this.r, this.pos.y - (this.r / 1.5), this.pos.x, this.pos.y - (this.r / 1.3), this.pos.x, this.pos.y - (this.r / happiness));
        }
    }

    //updates the physics of this player, checking for collisions, and checking for death
    Update() {
        console.log(this.vel);
        if (this.dead == false) {
            //apply movement to player
            this.pos.y += this.vel.y

            //check collisions with ground//
            if (collideRectRect(this.pos.x - this.r, this.pos.y - (2 * this.r), this.r * 2, this.r * 4, 0, HEIGHT - 100, WIDTH, 100)) {
                //fix some of the glitchiness with collisions
                this.pos.y = (HEIGHT - 100) - (this.r * 2);
                this.vel.y = 0;
                //colliding with floor
                this.onFloor = true;
            } else {
                this.onFloor = false;
                //apply gravity
                this.vel.y += gravity;
            }
        }
    }

    //compute the genomes move, and make that move (jump or no jump) based on inputs
    Move() {
        if (this.dead == false) {
            if (this.onFloor) {
                if (keyIsPressed && keyCode == UP_ARROW) {
                    this.vel.y -= jumpStrength;
                }
            }
        }
    }
}