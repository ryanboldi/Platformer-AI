class Population {
    constructor(genomes) {
        if (genomes instanceof Array) {
            for (let i = 0; i < genomes.length; i++) {
                let wrong = false;
                if (!genomes[i] instanceof Genome) { //check that all genomes are valid instances of the genome class
                    wrong = true;
                } if (wrong) {
                    this.genomes = [];
                    console.error("error in population instantiation: one of the genomes in the array isnt a valid instance of the genome class")
                } else this.genomes = genomes
            }
        }
        else {
            this.genomes = []
            console.error("error in population instantiation: genomes not instance of array");
        }
        this.species = []


        this.bestFitness = 0;
        this.bestCreature;
        this.averageFitness = 0;
    }

    /**speciates the entire population's genomes and stores them in the population's species */
    speciate() {
        this.species = []; //reset species
        //if species is empty, add first dude to new species
        this.species.push(new Species(this.genomes[0]));

        //check if distance from any species is less than the threshold for every other
        for (let i = 1; i < this.genomes.length; i++) {
            let found = false;
            for (let j = 0; j < this.species.length; j++) {
                if (this.species[j].isComp(this.genomes[i])) {
                    found = true;
                    this.species[j].genomes.push(this.genomes[i]);
                    break;
                }
            }
            //if we didnt find a species for little jimmy
            if (!found) {
                //make new species for jimmy, and make him the representative
                this.species.push(new Species(this.genomes[i]))
            }
        }
        //console.log(this.species);
    }

    //assigns every genomes .fitness value to thef itness function
    fitness() {
        let tot = 0;
        for (let i = 0; i < this.genomes.length; i++) {
            this.genomes[i].fitness = getFitXOR(this.genomes[i]);
            tot += this.genomes[i].fitness
            if (getFitXOR(this.genomes[i]) > this.bestFitness) {
                this.bestFitness = getFitXOR(this.genomes[i]);
                this.bestCreature = this.genomes[i];
            }
        }
        this.averageFitness = (tot / this.genomes.length);
    }

    //makes next generation's population based on fitness
    makeNext() {
        this.speciate();
        this.fitness();
        //console.log(`fitness : ${this.genomes[0].fitness}`);
        //FITNESS SHARING Offspring = (AverageSpeciesFitness / Total_of_AverageSpeciesFitnesss) * PopulationSize
        let newPop = [];
        let interspecies = []; //genomes that have been selected to mate with other species. they will be inserted into a random species' mating pool

        let tot_avg_fitness = 0;
        for (let i = 0; i < this.species.length; i++) {
            tot_avg_fitness += this.species[i].getAveFit();
            this.species[i].getBestFit();
        }

        //console.log(this.species);

        for (let i = 0; i < this.species.length; i++) {
            //IF THE SPEICES HASN'T IMPROVED IN 15 GENERATIONS, IT WON'T BE ALLOWED TO REPRODUCE
            let denied = ((this.species.last_improved + not_improve_cutoff) > generation);

            if (denied) {
                break;
                //SKIP THIS SPECIES 
            }

            let matingPool;//pool of parents to mate from (25% wont be mated but purly mutated and put into the next generation)
            
            if (this.species[i].genomes.length > 4) {
                //if species has atleast 5 creatures, the champion will automatically be put into the next generation
                newPop.push(this.species[i].champ.clone());
            }

            //use fitness proportionate selection to select 20% of the species to be put into the mating pool. 
            //which creatures have been selected to be part of the mating pool
            //console.log(`species size = ${this.species[i].genomes.length}, matingpoolSize = ${this.species[i].genomes.length * survivalThreshold}, offspring = ${offspring}`);
            // console.log(this.species[i].genomes);
            matingPool = roulette(this.species[i].genomes, this.species[i].genomes.length * survivalThreshold);
            //console.log(matingPool);

            //get rid of the dudes that wanna mate outside of thier species.
            for (let j = 0; j < matingPool.length; j++) {
                if (Math.random() < interspecies_mate_rate) {
                    interspecies.push(matingPool[j]);
                    //remove from this species' mating pool
                    matingPool.splice(j, 1);
                }
            }
            this.species[i].matingPool = matingPool;
        }

        let pools = [];//array of species that the interspecies will go to respectivly

        for (let i = 0; i < interspecies.length; i++) {
            pools.push(Math.floor(Math.random() * this.species.length))
        };

        //console.log(interspecies);

        for (let i = 0; i < this.species.length; i++) {
            //IF THE SPEICES HASN'T IMPROVED IN 15 GENERATIONS, IT WON'T BE ALLOWED TO REPRODUCE
            let denied = ((this.species.last_improved + not_improve_cutoff) > generation);

            if (denied) {
                break;
                //SKIP THIS SPECIES 
            }

            let offspring = Math.round((this.species[i].averageFitness / tot_avg_fitness) * (population - interspecies.length - this.species.length)); //how many offspring this species is allowed. 
            //use mating pool to create offspring------------------------
            let matingPool = this.species[i].matingPool;

            for (let j = 0; j < pools.length; j++) {
                if (pools[j] == i) {
                    //add to mating pool
                    matingPool.push(interspecies[j])
                }
            }

            let mutaters = []; //genomes to be mutated but not crossed over
            let parents = []; //genomes to be crossed over and then mutated

            //assigns the genomes to either the mating pool or the mutation pool
            for (let i = 0; i < matingPool.length; i++) {
                if (Math.random() < no_cross) {
                    mutaters.push(matingPool[i]);
                } else {
                    parents.push(matingPool[i]);
                }
            }

            //mutators should get {(mutaters.length/matingpool.length) * offspring} children 
            let mutChildren = Math.round((mutaters.length / matingPool.length) * offspring);
            let crossChildren = Math.round((parents.length / matingPool.length) * offspring);
            //check that rounding hasnt removed an offspring (if 1.5 and 1.5 rounding would take total it to 4);
            if (mutChildren + crossChildren > offspring) {
                if (Math.random() < no_cross) {
                    crossChildren -= 1;
                } else {
                    mutChildren -= 1;
                }
            }

            //children made via mutation only
            let muts = [];
            //children made via crossing
            let crosses = [];
            while (muts.length < mutChildren) {
                //make new child via mutation and add it to muts
                //choose random parent
                let parent = mutaters[Math.floor(Math.random() * mutaters.length)]//random from mutators
                let child = parent.clone();
                child.Mutate();
                muts.push(child);
            }
            //console.log(muts);
            muts.forEach(m => {
                newPop.push(m);
            });

            while (crosses.length < crossChildren) {
                //make new child via crossover
                //chose two parents
                let parent1 = parents[Math.floor(Math.random() * parents.length)];
                let parent2 = parents[Math.floor(Math.random() * parents.length)];
                let child;

                if (parent1.fitness >= parent2.fitness) {
                    child = crossover(parent1, parent2);
                    //console.log(parent1, parent2, child);
                } else {
                    child = crossover(parent2, parent1);
                    //console.log(parent1, parent2, child);
                }

                child.Mutate();
                crosses.push(child);
            }
            //console.log(crosses);
            crosses.forEach(c => {
                newPop.push(c);
            });

            //children made via mutation only
            //console.log(muts);
            //children made via crossing
            //console.log(crosses);
        }

        //console.log(newPop);
        return new Population(newPop);
    }
}
