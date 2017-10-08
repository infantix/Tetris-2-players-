class Player
{
    constructor(arena) {
        this.arena = arena;
        this.pieceFactory = new PieceFactory();

        this.dropCounter = 0;
        this.dropInterval = 1; //drop every second.
        this.position = { x: 0, y: 0 };
        this.matrix = [];
        this.score = 0;

        this.reset(); // init position and matrix.
    }

    moveLeft() {
        this.position.x--;
    
        if (this.arena.collide(this)) {
            this.position.x++;
        }
    }
    
    moveRight() {
        this.position.x++;
    
        if (this.arena.collide(this)) {
            this.position.x--;
        }
    }

    rotateClockWise() {
        rotate(this, rotateClockWise, rotateAntiClockWise);
    }

    rotateAntiClockWise() {
        rotate(this, rotateAntiClockWise, rotateClockWise);
    }

    drop() {
        this.position.y++;

        if (this.arena.collide(this)) {
            this.position.y--;
            this.arena.merge(this);
            let deletedRows = this.arena.deleteFullRows();
            this.increaseScore(deletedRows);
            this.reset();
        
            if (this.arena.collide(this)) { //game over
                this.arena.resetArena();
                this.score = 0;
            }
        }
    }
    
    update(time = 0) {
    
        this.dropCounter += time;
    
        if (this.dropCounter >= this.dropInterval) {
            this.drop();
            this.dropCounter = 0;
        }
        tetris.resetCanvas();
        tetris.draw();
        updateScore();
    }

    reset() {
        this.matrix = this.pieceFactory.createPiece();
        this.position.y = 0;
        this.position.x = (this.arena.matrix[0].length / 2 | 0) - (this.matrix.length / 2 | 0);
    }

    increaseScore(num) {
        this.score += num * 10;
    }
}


let rotate = function (player, rotateMatrix, rotationRollback) {

    let playerPosition = player.position.x;
    rotateMatrix(player.matrix);

    if (player.arena.collide(player)) {
        player.position.x = playerPosition;
        rotationRollback(player.matrix);
    }
}

let rotateClockWise = function (matrix) {
    traspose(matrix);
    reverseRows(matrix);
}

let rotateAntiClockWise = function (matrix) {
    reverseRows(matrix);
    traspose(matrix);
}

let traspose = function (matrix) {
    // swap the symmetric elements
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < i; j++) {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
}

let reverseRows = function (matrix) {
    matrix = matrix.map(function (row) {
        return row.reverse();
    });
}
    

