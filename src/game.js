let WIDTH = HEIGHT = 800;
const gravity = 0.5; //downward acceleration

//PLAYER SETTINGS
const player_x = 50;
const player_y = HEIGHT - 400;
const player_r = 20;

const jumpStrength = 40;


//ground settings
const groundSpeed = 10; //(x speed);
const groundHeight = 20; //how tall each platform should be

let p;

//array of ground pieces
let grounds = [];

//neat
let best_fitness = 1;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(230);

    p = new Player();


    let x = 0;
    let lasty = 600;//start block
    let y = lasty;
    for (let i = 0; i < 5; i++) {
        grounds.push(new Ground(x, y, 600));
        y = random(lasty - 200, lasty + 200);
        if (y < 100) y = random(lasty, lasty + 200);
        if (y > HEIGHT - 100) y = random(lasty, lasty - 200);
        lasty = y;
        x += WIDTH;
    }
}

function draw() {
    background(230);
    p.Show();
    p.Update();
    //p.Move();

    grounds.forEach(g => {
        g.Show();
        g.Update();
    })

    noStroke();
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        if (p.onFloor) {
            p.vel.y -= jumpStrength;
        }
    }
}