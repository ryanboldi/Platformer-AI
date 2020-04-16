class History {
    //class that stores the representation of a connection innovation
    constructor(in_node, out_node, inum) {
        this.in_node = in_node; //Which node this connection comes from
        this.out_node = out_node; // where this connection goes
        this.inno_num = inum; // innvation number of this innovation\
    }

    //checks if a connection represents the same structure as this inovation
    equals(connection, out_node) {
        //either in_node, out_node, or the connection
        if (!isNaN(out_node)) {
            if (connection == this.in_node && out_node == this.out_node) return true
        }
        else if (connection instanceof Connection) {
            if (connection.in_node == this.in_node && connection.out_node == this.out_node) {
                return true
            }
        }
        return false
    }
}
