class Species {
    /**
     * 
     * @param {Genome} g genome to be the initial genome in this species
     */
    constructor(g) {
        this.genomes = [];
        this.champ;
        this.representative;
        this.bestFitness = 0;
        this.averageFitness = 0;
        this.matingPool;
        this.last_improved; //generation that this species last improved in.

        //if g given
        if (g) {
            this.genomes = [];
            this.genomes.push(g);
            this.champ = g.clone();
            this.representative = g.clone(); // = g.copy
            this.bestFitness = g.fitness;
        }
    }

    /**
     * gets distance from this species' representative to genome
     * @param {Genome} genome genome we want to get distance of
     */
    getDist(genome) {
        return distance(this.representative, genome);
    }
    /**
     * Returns if this genome could be part of this species based on distance from representative
     * @param {Genome} genome Genome we want to test compatability of
     */
    isComp(genome) {
        return (this.getDist(genome) <= distance_threshold);
    }

    getAveFit() {
        let totFit = 0;
        this.genomes.forEach(g => {
            totFit += g.fitness
        });
        this.averageFitness = totFit / (this.genomes.length);
        return this.averageFitness;
    }
    
    getBestFit() {
        let max = 0;
        this.genomes.forEach(g => {
            if (g.fitness > max) {
                max = g.fitness;
                this.champ = g;
                this.last_improved = generation;
            };
        });
        this.bestFitness = max;
        return this.bestFitness;
    }
}