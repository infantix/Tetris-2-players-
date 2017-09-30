class Player
{
    constructor() {
        this.dropCounter = 0;
        this.dropInterval = 1; //drop every second.
        this.position = { x: 0, y: 0 };
        this.matrix = createPiece();
        this.score = 0;
    }

    moveLeft() {
        this.position.x--;
    
        if (collide(this, arena)) {
            this.position.x++;
        }
    }
    
    moveRight() {
        this.position.x++;
    
        if (collide(this, arena)) {
            this.position.x--;
        }
    }

    rotateClockWise() {
        rotate(this, rotateClockWise, rotateAntiClockWise);
    }

    rotateAntiClockWise() {
        rotate(this, rotateAntiClockWise, rotateAntiClockWise);
    }

    drop() {
        this.position.y++;

        if (collide(this, arena)) {
            this.position.y--;
            merge(arena, this);
            let deletedRows = deleteFullRows();
            this.increaseScore(deletedRows);
            this.reset();
        
            if (collide(this, arena)) { //game over
                resetArena();
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
        resetCanvas();
        draw();
        updateScore();
    }

    reset() {
        this.matrix = createPiece();
        this.position.y = 0;
        this.position.x = (arena[0].length / 2 | 0) - (this.matrix.length / 2 | 0);
    }

    increaseScore(num) {
        this.score += num * 10;
    }
}


let rotate = function (player, rotateMatrix, rotationRollback) {

    let playerPosition = player.position.x;
    rotateMatrix(player.matrix);

    if (collide(player, arena)) {
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
    

