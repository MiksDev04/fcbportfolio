// Varibles - storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;
let highestScore = [];
let clickRestartestart = false;
const gameOverMessage = document.querySelector('.game-over');


// check if you already won
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0;
let startY = 0;


// callable programmed tasks
function setGame() { 

    // Initializes the 4by4 game board with all tiles set to 0
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
        
    ];
    // board = [
    //     [2, 4, 2, 4],
    //     [4, 2, 4, 2],
    //     [2, 4, 2, 1024],
    //     [4, 2, 4, 1024]
        
    // ];

    

    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {

            // create tile through creating div element
            let tile = document.createElement("div");

            // each tile will have an id based on its row position and column position
            tile.id = r.toString() + "-" + c.toString();

            // get the number of a tile from backend board
            let num = board[r][c];

            // update the tile appearance
            updateTile(tile, num);

            // Sdd the created tile with id to the frontend game board container
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    let maxScore = [];
    // own scoring way
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            maxScore.push(board[r][c]);
        }
    }
    // console.log(Math.max(...maxScore));
    score = Math.max(...maxScore);

    highestScore.push(score);

    tile.classList.add("tile");

    if(num > 0) {
        // display the number of a tile
        tile.innerText = num.toString();

        if(num <= 4096) {
            tile.classList.add("x" + num.toString());
        }
        else {
            tile.classList.add("x8192");
        }
    }

}
window.onload = function() {
    setGame();
}

function handleSlide(event) { // e - means event
    console.log(event.code); // prints out the key being press
    // code to know the keys you press
    // code is only available when using keydown

    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        if(event.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        }
        else if(event.code == "ArrowRight") {
            slideRight();
            setTwo();
        }
        else if(event.code == "ArrowUp") {
            slideUp();
            setTwo();
        }
        else if(event.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;
    document.getElementById("high-score").innerText = Math.max(...highestScore);

    setTimeout(() => {
    checkWin();
    }, 100);
    
    if (hasLost() == true) {
        gameOverMessage.style.display = "block";

        while(clickRestart = false) {
            restartGameButton();
        }

 

    }
    
}
function restartGameButton() {
    gameOverMessage.style.display = "none";
    clickRestart = true;
    restartGame();
    
    // for(let r = 0; r < rows; r++) {
        //     for(let c = 0; c < columns; c++) {
            //         tile = document.getElementById(r.toString() + "-" + c.toString());
            //     }
            // }
            // let num = board[r][c];
            
            // update the tile appearance
            
    updateTile(tile, num);
}


document.addEventListener("keydown", handleSlide);


// Removes the zero from the row / column
function filterZero(row) {
    return row.filter(num => num != 0); 
}

// merging the tiles or adjacent tiles
function slide(row) {
    row = filterZero(row);

    for(let i = 0; i < row.length -1; i++) {
        if (row[i] == row[i+1]) { // check if there's a tile that the same
            row[i] *= 2; // double the tile that merges
            row[i+1] = 0; // become 0

            //adds the merge tile value to the score
            // score += row[i];
        }
    }
    row = filterZero(row);

    while(row.length < columns) {
        row.push(0);
    }
    return row;

}


function slideLeft() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];

        // line for animation
        let originalRow = row.slice();

        row = slide(row);
        board[r] = row;

        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            // if original tile is not equal to current tile, animation will be appplied
            if(originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-right 0.3s";

                //remove the animation class after the animation
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
}
function slideRight() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];

        // line for animation
        let originalRow = row.slice();

        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-left 0.3s";

                //remove the animation class after the animation
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }
    }
}
function slideUp() {
    for(let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        
        // line for animation
        let originalCol = col.slice();

        col = slide(col); // merge

        let changedIndices = [];
        for(let r = 0; r < rows; r++) {
            if(originalCol[r] !== col[r]) {
                changedIndices.push(r);
            } 
        }

        for(let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            
            if(changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";

                //remove the animation class after the animation
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }

    }
}
function slideDown() {
    for(let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // line for animation
        let originalCol = col.slice();
        col.reverse();
        col = slide(col);
        col.reverse();

        
        let changedIndices = [];
        for(let r = 0; r < rows; r++) {
            if(originalCol[r] !== col[r]) {
                changedIndices.push(r);
            } 
        }


        for(let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";

                //remove the animation class after the animation
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }

    }
}
function hasEmptyTile() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if(hasEmptyTile() == false) {
        return;
    }

    let found = false;

    while(found == false) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
    

        if(board[r][c] == 0) {
            // generate new tile
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

// Check if you have aalready won (2048, 4092, 8192)
function checkWin() {
    const winContainer = document.querySelector('.win-message-container');
    const won2048 = document.querySelector('.win-message');
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] == 2048 && is2048Exist == false) {
                winContainer.style.top = "50px";
                won2048.textContent = "You got the 2048, GREAT!!";
                is2048Exist = true;
                setTimeout(() => {
                    winContainer.style.top = "-200px";
                }, 5000);
            }
            else if(board[r][c] == 4096 && is4096Exist == false) {
                // alert("LEGENDARY, You got the 4096");

                winContainer.style.top = "50px";
                won2048.textContent = "You got the 4096, LEGENDARY!!";
                is4096Exist = true;
                setTimeout(() => {
                    winContainer.style.top = "-200px";
                }, 5000);
            }
            else if(board[r][c] == 8192 && is8192Exist == false) {
                // alert("GOAT, You're the GOAT, Insane, ADIIIKKKK");

                winContainer.style.top = "50px";
                won2048.textContent = "You got the 8192, DIVINE!!";
                is8192Exist = true;
                setTimeout(() => {
                    winContainer.style.top = "-200px";
                }, 5000);
            }
        }
    }
}

function hasLost() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];
            if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                console.log("haha")
                return false;
            } 
        }
    }
    return true; // no possible movements
}

function restartGame() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            board[r][c]= 0;
        }
    }
    score = 0;

    // console.log("haha")
    setTwo();
}


// for touch screen
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

});

document.addEventListener('touchmove', (e) => {
    if(!e.target.className.includes("tile")) {
        return;
    }
    // disable scrolling feature
    e.preventDefault();
}, {passive: false});

document.addEventListener('touchend', (e) => {
    if(!e.target.className.includes("tile")) {
        return;
    }

    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe 
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe 
        if (diffX > 0) {
            slideLeft(); 
            setTwo(); 
        }else { 
            slideRight();
            setTwo();
        }
    } 
    else {
        if (diffY > 0) { 
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
            } else { 
            slideDown();
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;
    document.getElementById("high-score").innerText = Math.max(...highestScore);

    setTimeout(() => {
    checkWin();
    }, 100);
    if (hasLost() == true) {
        gameOverMessage.style.display = "block";

        while(clickRestart = false) {
            restartGameButton();
        }

 
        

    }
});

