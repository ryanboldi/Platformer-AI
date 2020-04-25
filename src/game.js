let WIDTH = HEIGHT = 800;
const gravity = 0.5; //downward acceleration

let generation = 0;

//PLAYER SETTINGS
const player_x = 50;
const player_y = HEIGHT - 400;
const player_r = 20;

const jumpStrength = 70;

const popSize = population;

//ground settings
const groundSpeed = 10; //(x speed);
const groundHeight = 50; //how tall each platform should be
const groundGapX = 170; //MAX X GAP BETWEEN PLATFORMS
const groundGapY = 300; //MAX VERTICAL GAP BETWEEN PLATFORMS
const groundWidthMin = 200;
const groundWidthMax = 500;

let nextGround; //STORES THE NEXT GROUND THAT THE PLAYER WILL BE ON
let currGround; //STORES CURRENT GROUND HE'S ON

//array of ground pieces
let grounds = [];

//neat
let best_fitness = 1;

let pop; //population of brains of the creatures
let players = []; //population of players

function setup() {
    console.error();
    createCanvas(WIDTH, HEIGHT);
    background(230);

    let popTemp = [];

    for (let i = 0; i < popSize; i++) {
        console.log(i);
        let p = new Player();
        let b = p.brain;
        players.push(p);
        popTemp.push(b);
    }

    pop = new Population(popTemp);

    currGround = new Ground(0, 600, WIDTH * 2);
    grounds.push(currGround);//START PLATFORM
    for (let i = 0; i < 10; i++) {
        createGround(); //we want about 10 grounds as a start
    }
}

function draw() {
    background(230);
    checkGround();

    if (checkDead) {
        nextGen();
        console.log("NEW GENERATION");
    }

    players.forEach(p => {
        p.Show();
        p.Update();
        p.Think();
        p.Move();
        p.UpdateFitness();
    });

    grounds.forEach(g => {
        g.Show();
        g.Update();
    });


    noStroke();
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        if (p.onFloor) {
            p.vel.y -= jumpStrength;
        }
    }
}

//makes a new ground and appends it to the end of the ground array
function createGround() {
    //get x value of the last ground, add width of the ground + jump gap.
    let last_x = (grounds[grounds.length - 1].pos.x) + grounds[grounds.length - 1].width;
    let new_x = last_x + groundGapX;
    let last_y = (grounds[grounds.length - 1].pos.y);
    let y = random(last_y - groundGapY, last_y + groundGapY);
    if (y < 100) y = random(last_y, last_y + groundGapY);
    if (y > HEIGHT - 100) y = random(last_y, last_y - groundGapY);

    grounds.push(new Ground(new_x, y, random(groundWidthMin, groundWidthMax)));
}

function checkGround() {
    //check if first ground is completely off the page, if so, add new ground and delete this one
    if ((grounds[0].pos.x + grounds[0].width) < 0) {
        createGround();
        grounds.splice(0, 1);
    }

    //what ground is COMPLETELY RIGHT OF THE PLAYER?
    for (let i = 0; i < grounds.length; i++) {
        //check if ground is COMPLETELY RIGHT (so left and right corners are right of the player)
        if (grounds[i].pos.x > player_x) {
            nextGround = grounds[i];
            grounds[i].isNext = true;
            currGround = grounds[i - 1];
            break;
        }
    }
}

function nextGen() {
    generation++;
    //makes new generatoin
    let oldPlayers = players;
    let newPop = pop.makeNext();
    let newPlayers = [];

    //make new population from this brain array;
    for (let i = 0; i < newPop.genomes.length; i++) {
        newPlayers.push(new Player(newPop.genomes[i]));
    }

    players = newPlayers;
    pop = newPop;
}

function checkDead() {
    //check if all players are dead
    let allDead = true;
    for (let i = 0; i < players.length; i++) {
        if (player[i].dead == false) {
            allDead = false;
        }
    }
    return allDead
}