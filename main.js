const canvas = document.getElementById('tetris');
const tetris = new Tetris(canvas);

document.addEventListener('keydown', event => {
	const player = tetris.player;
	
	switch (event.keyCode) {

		case 38: //up
		case 83: //s
			player.rotateClockWise();
			break;

		case 65: //a
			player.rotateAntiClockWise();
			break;

		case 37: //left
			player.moveLeft();
			break;

		case 39: //right
			player.moveRight();
			break;

		case 32: //space bar
		case 40: //down
			player.drop();
			break;
	}
});


function updateScore() {
	document.getElementById('score').innerText = tetris.player.score;
}

