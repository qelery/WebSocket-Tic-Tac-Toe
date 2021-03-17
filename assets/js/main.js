const gridDiv = document.querySelector('.grid');
const squaresDivs = gridDiv.children;
const singlePlayerButton = document.querySelector('#left-button');
const twoPlayerButton = document.querySelector('#right-button');
const statsDiv = document.querySelector('.stats');
let isTwoPlayer;
let grid;


singlePlayerButton.addEventListener('click', singlePlayerSetup);
twoPlayerButton.addEventListener('click', twoPlayerSetup);


function singlePlayerSetup() {
    isTwoPlayer = false;

    gridDiv.classList.remove('opaque');
    statsDiv.classList.remove('opaque');

    grid = new Grid([...squaresDivs]);
    grid.reset();
}

function twoPlayerSetup() {
    isTwoPlayer = true;
}

