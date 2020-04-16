class Node {
    /**
     * 
     * @param {String} type type of node this is i=input, o=output, h=hidden, b = bias.
     * @param {Function} activation function used to normalise the nodes value to between -1 and 1;
     */
    constructor(num, type = 'h', activation = sigmoid) {
        this.num = num;
        this.type = type;
        this.activation = activation;
        this.value = (Math.random() * 2) - 1; //all values initilised at random between (-1 and 1)

        this.incomingSignal = 0; //sum before activation

        if (this.type == 'b') {
            this.value = 1;
        }
    }

    //adds up incoming signal, and sets value to the activated value
    engage() {
        this.value = this.activation(this.incomingSignal);
        this.incomingSignal = 0;

        //bias is always 1.
        if (this.type == 'b') {
            this.value = 1;
        }
    }

    clone() {
        let clone = new Node(this.num, this.type);
        return clone;
    }
}