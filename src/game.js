let WIDTH = HEIGHT = 800;
let gravity = 0.5; //downward acceleration

let generation = 0;

//PLAYER SETTINGS
const player_x = 50;
const player_y = HEIGHT - 400;
const player_r = 20;

const jumpStrength = 70;

let popSize = 100;

//ground settings
let groundSpeed = 10; //(x speed);
const groundHeight = 50; //how tall each platform should be
let groundGapX = 150; //MAX X GAP BETWEEN PLATFORMS
let groundGapY = 270; //MAX VERTICAL GAP BETWEEN PLATFORMS
const groundWidthMin = 100;
const groundWidthMax = 400;

let nextGround; //STORES THE NEXT GROUND THAT THE PLAYER WILL BE ON
let currGround; //STORES CURRENT GROUND HE'S ON

//array of ground pieces
let grounds = [];

//neat
let best_fitness = 1;

let pop; //population of brains of the creatures
let players = []; //population of players

let scoreCount = 0;

// BUTTONS AND SLIDERS
let ApplyButton;
let groundSpeedSlider;
let groundSpeedText;
let popSizeSlider;
let popSizeText;
let gravitySlider;
let gravityText;
let variationSlider;
let variationText;
let gapSlider;
let gapText;




function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(230);

    //------------------------------------------------------------
    ApplyButton = createButton("Reset & Apply Changes");
    ApplyButton.mousePressed(ApplyChanges);
    ApplyButton.position(WIDTH + 50, 400);

    groundSpeedSlider = createSlider(1, 20, groundSpeed);
    groundSpeedSlider.position(WIDTH + 50, 50);

    groundSpeedText = createP("Speed");
    groundSpeedText.position(groundSpeedSlider.x + 150, groundSpeedSlider.y - 15);

    popSizeSlider = createSlider(1, 200, popSize);
    popSizeSlider.position(WIDTH + 50, groundSpeedText.y + 40);

    popSizeText = createP("Population");
    popSizeText.position(popSizeSlider.x + 150, popSizeSlider.y - 15);

    gravitySlider = createSlider(0, 10, gravity * 10);
    gravitySlider.position(WIDTH + 50, popSizeText.y + 40);

    gravityText = createP("Gravity");
    gravityText.position(gravitySlider.x + 150, gravitySlider.y - 15);

    variationSlider = createSlider(0, HEIGHT / 2, groundGapY);
    variationSlider.position(WIDTH + 50, gravityText.y + 40);

    variationText = createP("Ground Height Variation");
    variationText.position(variationSlider.x + 150, variationSlider.y - 15);

    gapSlider = createSlider(0, 300, groundGapX);
    gapSlider.position(WIDTH + 50, variationText.y + 40);

    gapText = createP("Ground Gap");
    gapText.position(gapSlider.x + 150, gapSlider.y - 15);

    ApplyChanges();
}

function draw() {
    //UPDATE TEXT ON SLIDERS
    groundSpeedText.html(`Speed: ${groundSpeedSlider.value()}`);
    popSizeText.html(`Population: ${popSizeSlider.value()}`);
    gravityText.html(`Gravity: ${gravitySlider.value()}`);
    variationText.html(`Ground Height Variation: ${variationSlider.value()}`);
    gapText.html(`Ground Gap: ${gapSlider.value()}`);



    scoreCount++; // count of frames for score
    background(230);
    checkGround();

    if (checkDead()) {
        console.log(pop.averageFitness)
        nextGen();
        //console.log("NEW GENERATION");
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
            break;
        } else if (grounds[i].pos.x < player_x && ((grounds[i].pos.x + grounds[i].width) > player_x)) {
            currGround = grounds[i];
        }
    }
}

function nextGen() {
    scoreCount = 0;
    generation += 1;
    //makes new generatoin
    pop.makeNext();
    let newPlayers = [];

    //make new population from this brain array;
    for (let i = 0; i < pop.genomes.length; i++) {
        newPlayers.push(new Player(pop.genomes[i]));
    }

    players = newPlayers;

    grounds = [];
    currGround = new Ground(0, 600, WIDTH * 2);
    grounds.push(currGround);//START PLATFORM
    for (let i = 0; i < 10; i++) {
        createGround(); //we want about 10 grounds as a start
    }
}

function checkDead() {
    //check if all players are dead
    let allDead = true;
    for (let i = 0; i < players.length; i++) {
        if (players[i].dead == false) {
            allDead = false;
        }
    }
    return allDead
}

function ApplyChanges() {
    grounds = [];
    players = [];

    popSize = popSizeSlider.value();
    groundSpeed = groundSpeedSlider.value();
    gravity = gravitySlider.value() / 10;
    groundGapY = variationSlider.value();
    groundGapX = gapSlider.value();

    let popTemp = [];

    for (let i = 0; i < popSize; i++) {
        let b = new Genome(5, 1);
        let p = new Player(b);

        players.push(p);
        popTemp.push(b);
    }

    //console.log(popTemp);

    pop = new Population(popTemp);

    currGround = new Ground(0, 600, WIDTH * 2);
    grounds.push(currGround);//START PLATFORM
    for (let i = 0; i < 10; i++) {
        createGround(); //we want about 10 grounds as a start
    }
}