const canvas = document.getElementById('tetris');
const tetris = new Tetris(canvas);

document.addEventListener('keydown', event => {
	const player = tetris.player;
	
	switch (event.keyCode) {
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

		case 38: //up
		case 83: //s
			if(event.repeat) return;
			player.rotateClockWise();
			break;

		case 65: //a
			if(event.repeat) return;
			player.rotateAntiClockWise();
			break;
	}
});

document.addEventListener('keyup', event => {
	const player = tetris.player;
	
	switch (event.keyCode) {

	}
});


function updateScore() {
	document.getElementById('score').innerText = tetris.player.score;
}
