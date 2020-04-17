class Player {
    constructor(genome) {
        this.x = player_x;
        this.y = player_y;
        this.r = player_r;

        this.fitness = 0;
        this.dead = false;

        if (genome) {
            this.brain = genome;
        } else {
            this.brain = new Genome(4, 1);
        }

    }

    //draw the player to canvas
    Show() {
        if (this.dead == false) {
            //we want two ellipses, one on top and one on bottom, with some lines connecting them to make a player shape

        }
    }

    //updates the physics of this player, checking for collisions, and checking for death
    Update() {
        if (this.dead == false){

        }
    }

    //compute the genomes move, and make that move (jump or no jump) based on inputs
    Move() {
        if (this.dead == false){

        }
    }
}