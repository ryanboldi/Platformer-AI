class Player {
    constructor(genome) {
        this.pos = createVector(player_x, player_y); //position vector of this player
        this.vel = createVector(0, 0)// WE ONLY CARE ABOUT Y VELOCITY AS PLAYER WON'T BE MOVING ON X.

        this.r = player_r;
        //HITBOX will be a rectangle of height 4*r, and length 2*r

        this.fitness = 0;
        this.dead = false;

        this.onFloor = false;

        this.sight = [];

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
        if (this.dead == false) {
            //apply movement to player
            this.pos.y += this.vel.y

            //CHECK FOR DEATHS
            //if we collided with any of the floors, but we arn't ontop of the floor, its a death.
            for (let i = 0; i < grounds.length; i++) {
                if (collideRectRect(this.pos.x - this.r, this.pos.y - (2 * this.r), this.r * 2, this.r * 4, grounds[i].pos.x, grounds[i].pos.y, grounds[i].width, groundHeight)) {
                    if (((this.pos.x + this.r) <= (grounds[i].pos.x)) || ((this.pos.x - this.r) > (grounds[i].pos.x + grounds[i].width))) {
                        this.dead = true;
                        console.log("DIE");
                    }
                }
            }


            if (this.pos.y > HEIGHT) {
                this.dead = true;
                console.log("DIE");
            }

            let onFloor = false;
            //check collisions with ground//
            for (let i = 0; i < grounds.length; i++) {
                if (collideRectRect(this.pos.x - this.r, this.pos.y - (2 * this.r), this.r * 2, this.r * 4, grounds[i].pos.x, grounds[i].pos.y, grounds[i].width, groundHeight)) {
                    //fix some of the glitchiness with collisions
                    this.pos.y = (grounds[i].pos.y) - (this.r * 2);
                    this.vel.y = 0;
                    //colliding with floor
                    onFloor = true;
                    this.onFloor = true;
                } else {
                    //apply gravity
                    this.vel.y += gravity;
                }
            }
            if (onFloor == false) this.onFloor = false; //checks that it isnt touching any floors
        }
    }

    //compute the genomes move, and make that move (jump or no jump) based on inputs
    Move() {
        if (this.dead == false) {
            if (this.onFloor) {
                if ((this.brain.feedforward(this.sight)) > 0.5) {
                    this.vel.y -= jumpStrength;
                }
            }
        }
    }

    Think() {
        //update vision
        //distance to next block
        let dist1 = Math.abs(nextGround.pos.x - player_x);
        let dist2 = Math.abs(this.pos.y - nextGround.pos.y);
        let dist3 = Math.abs(this.pos.y - currGround.pos.y);
        let dist4 = Math.abs(nextGround.pos.y - currGround.pos.y);

        let _dist1 = map(dist1, 0, WIDTH, 0, 1);
        let _dist2 = map(dist2, 0, HEIGHT, 0, 1);
        let _dist3 = map(dist3, 0, HEIGHT, 0, 1);
        let _dist4 = map(dist4, 0, WIDTH / 2, 0, 1);

        this.sight = [_dist1, _dist2, dist3, _dist4]
    }

    UpdateFitness() {
        if (this.dead == false) {
            this.fitness = frameCount();
        }
        this.brain.fitness = this.fitness;
    }
}