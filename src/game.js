let WIDTH = HEIGHT = 800;
const gravity = 10; //downward acceleration

//PLAYER SETTINGS
const player_x = 100;
const player_y = HEIGHT - 400;
const player_r = 20;

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
}