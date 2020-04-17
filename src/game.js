let WIDTH = HEIGHT = 800;
const gravity = 1; //downward acceleration

//PLAYER SETTINGS
const player_x = 100;
const player_y = HEIGHT - 400;
const player_r = 20;

const jumpStrength = 20;

let p;

//neat
let best_fitness = 1;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(230);

    p = new Player();
}

function draw() {
    background(230);
    p.Show();
    p.Update();
    //p.Move();

    noStroke();
    fill(50, 155, 0);//ground
    rect(0, HEIGHT - 100, WIDTH, 100);
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        if (p.onFloor) {
            p.vel.y -= jumpStrength;
        }
    }
}