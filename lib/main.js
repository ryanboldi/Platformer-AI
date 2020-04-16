let pop;
let best;
let bestfitness = 0;

function setup() {
    createCanvas(400, 400);

    let genomes = [];
    for (let i = 0; i < population; i++) {
        genomes.push(new Genome(2, 1))
    }
    p = new Population(genomes);


    p = new Population(genomes);
    for (let i = 0; i < 800; i++) {
        p = p.makeNext();
        p.fitness();
        if (p.bestFitness > 3.8) {
            console.log(`DONE in ${i} generations`);
            break;
        }
        console.log(p.averageFitness);
        console.log(p.genomes.length);
        innovations = [];
    }
    p.fitness();
    getOutputs(p.bestCreature);
    console.log(p);
}

function draw() {

}


//returns fitness of a creature trained on XOR dataset
function getFitXOR(genome) {
    //0,0 -> 0
    //1,0 -> 1
    //0,1 -> 1
    //1,1 -> 0

    let zz = genome.feedforward([0, 0]);//0
    let oz = genome.feedforward([1, 0]);//1
    let zo = genome.feedforward([0, 1]);//1
    let oo = genome.feedforward([1, 1]);//0

    return (4 - (Math.abs(zz - 0) + Math.abs(oz - 1) + Math.abs(zo - 1) + Math.abs(oo - 0))) - ((genome.connections.length + genome.nodes.length) * 0.001);
}

function getOutputs(genome) {
    let zz = genome.feedforward([0, 0]);//0
    let oz = genome.feedforward([1, 0]);//1
    let zo = genome.feedforward([0, 1]);//1
    let oo = genome.feedforward([1, 1]);//0

    console.log(`[0, 0] -> ${zz}`);
    console.log(`[1, 0] -> ${oz}`);
    console.log(`[0, 1] -> ${zo}`);
    console.log(`[1, 1] -> ${oo}`);
}