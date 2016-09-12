/* JS파일 분리하여 사용 : AMD, Common JS */

/*
requirejs(["test"], function(test) {
    test();
});*/


/* Board */
var boardArray;     /* double array for the board */

var STATUS_BLANK = 0;
var STATUS_BRICK = 1;
var STATUS_DEAD_BRICK = 2;
var STATUS_WALL = 3;

var BOARD_WIDTH = 16;
var BOARD_HEIGHT = 20;

var basePositionLeft;
var basePositionTop;

/* Moving brick */
var BRICK_WIDTH = 30;
var BRICK_HEIGHT = 30;

var currentBlock;      // Which block type is selected
var currentBlockTransType; // Which block formation type is selected within the selected block type
var blockTransforms = [
    [
         [0,0, 1,0, 2,0, 0,1],
         [0,-2, 0,-1, 0,0, 1,0],
         [-2,0, -1,0, 0,0, 0,-1],
         [-1,0, 0,0, 0,1, 0,2],
    ],
    [
         [0,0, 1,0, 0,1, 1,1],
    ],
    [
        [0,-1, 0,0, 0,1, 0,2],
        [-1,0, 0,0, 1,0, 2,0],
    ],
    [
        [0,-1, 0,0, 1,0, 2,0],
        [0,0, 1,0, 0,1, 0,2],
        [-2,0, -1,0, 0,0, 0,1],
        [0,-2, 0,-1, 0,0, -1,0],
    ],
    [
        [0,-1, 0,0, -1,0, -1,1],
        [-1,-1, 0,-1, 0,0, 1,0],
    ],
    [
        [-1,0, 0,0, 0,-1, 1,-1],
        [-1,-1, -1,0, 0,0, 0,1],
    ],
];
var blockColors = ["yellow", "pink", "purple", "green", "blue", "orange"];


window.onload = function() {
    initBoard();
    initBlock();
    var timeOut = setInterval(timerEvent, 500);
    console.log("window loaded");
}

function Brick( element, value, left, width, top, height ) {    
    this.element = element;
    
    this.element.style.position = "fixed";
    
    this.element.style.left = left + "px";
    this.element.style.width = width + "px";
    this.element.style.top = top + "px";
    this.element.style.height = height + "px";
    this.element.style.float = "left";
    
    if( value === STATUS_WALL) 
        this.element.style.backgroundColor = "red";
    else 
        this.element.style.backgroundColor = "white";
    
    this.blockStatus = value;
}


function initBoard() {
    var board = document.getElementById('board');
    //basePostionLeft = Number(window.getComputedStyle(board, null).getPropertyValue('left').replace(/px/g, ""));
    //basePostionTop = Number(window.getComputedStyle(board, null).getPropertyValue('top').replace(/px/g, ""));
    
    basePositionLeft = (window.screen.width / 2)-(BOARD_WIDTH*BRICK_WIDTH/2);
    basePositionTop = (window.screen.height / 2) - (BOARD_HEIGHT*BRICK_HEIGHT/2);
    
    boardArray = new Array(BOARD_HEIGHT);
    
    for( var i=0 ; i < BOARD_HEIGHT ; i++ ) {
        
        for( var j=0 ; j < BOARD_WIDTH ; j++ ) {
            var tempElement = document.createElement('div');
            var tempValue;
            
            if( j === 0 )
                boardArray[i] = new Array();
            
            if( j===0 || j===BOARD_WIDTH-1 || i===BOARD_HEIGHT-1) {
                tempValue = STATUS_WALL;
                tempElement.className = "brick_wall";
            } else {
                tempValue = STATUS_BLANK;
                tempElement.className = "brick_blank";
            }
            
            // Block 객체 삭제
            var tempBrick = new Brick( tempElement,  
                                         tempValue, 
                                         basePositionLeft+BRICK_WIDTH*j, 
                                         BRICK_WIDTH, 
                                         basePositionTop+BRICK_HEIGHT*i, 
                                         BRICK_HEIGHT );
            //boardArray[i][j] = tempBrick;
            boardArray[i].push(tempBrick);
            
            board.appendChild(tempElement);
        }
    }    
}


function initBlock() {
    brickOnBoard_X = BOARD_WIDTH / 2 -1 ;
    brickOnBoard_Y = 2;
    
    currentBlock = Math.floor(Math.random() * blockTransforms.length);  /* 블록 ID(random)를 구한다 */
    currentBlockTransType = 0;
    
    drawBlock(blockColors[currentBlock]);
    
}

function drawBlock(color) {
    var x, y;
    
    for( var j=0 ; j < blockTransforms[currentBlock][currentBlockTransType].length ; j++ ) {
        if( j%2 == 0 ) // j가 짝수(x 상대좌표) 
            x = blockTransforms[currentBlock][currentBlockTransType][j];
        else {
            y = blockTransforms[currentBlock][currentBlockTransType][j];
            boardArray[brickOnBoard_Y + y][brickOnBoard_X + x].element.style.backgroundColor = color;
            if(color === "grey")
                boardArray[brickOnBoard_Y + y][brickOnBoard_X + x].blockStatus = STATUS_DEAD_BRICK;
            else
                boardArray[brickOnBoard_Y + y][brickOnBoard_X + x].blockStatus = STATUS_BRICK;
        }   
    }
}

function eraseBlock() {
    var x, y;
    
    for( var j=0 ; j < blockTransforms[currentBlock][currentBlockTransType].length ; j++ ) {
        if( j%2 == 0 ) // j가 짝수(x 상대좌표) 
            x = blockTransforms[currentBlock][currentBlockTransType][j];
        else {
            y = blockTransforms[currentBlock][currentBlockTransType][j];
            boardArray[brickOnBoard_Y + y][brickOnBoard_X + x].element.style.backgroundColor = "white";
            boardArray[brickOnBoard_Y + y][brickOnBoard_X + x].blockStatus = STATUS_BLANK;
        }   
    }
}

function rotateBlock() {
    if(currentBlockTransType+1 >= blockTransforms[currentBlock].length)
        currentBlockTransType = 0;
    else
        currentBlockTransType++;
}


/*
function freezeBrick() {    
    var orgBrick = boardArray[brickOnBoard_Y][brickOnBoard_X];
    
    orgBrick.element.style.backgroundColor="Yellow";
    boardArray[brickOnBoard_Y][brickOnBoard_X].blockStatus = STATUS_BRICK;
    
    // init MovingBlock position 
    initBlock();    
}
*/

function checkReachBottom() {
    for( var j=0 ; j < blockTransforms[currentBlock][currentBlockTransType].length ; j++ ) {
        if( j%2 == 1 ) { // j가 홀수 
            if( brickOnBoard_Y + 1 + blockTransforms[currentBlock][currentBlockTransType][j] 
               >= BOARD_HEIGHT-1 )
                return true; // reached bottom
        }
    }
}

function deleteRow(row) {
    for(var x=1 ; x < BOARD_WIDTH-1 ; x++) {
        boardArray[row][x].blockStatus = STATUS_BLANK;
        boardArray[row][x].element.style.backgroundColor = "white";
    }
}

function pullRowDown(row) {
    for( var y=row ; y >= 0 ; y-- ) {
        if( y != 0) {
            for( var x=1 ; x < BOARD_WIDTH-1 ; x++ ) {
                boardArray[y][x].blockStatus = boardArray[y-1][x].blockStatus;
                boardArray[y][x].element.style.backgroundColor = boardArray[y-1][x].element.style.backgroundColor;
            }
        } else {
            board[y][x].blockStatus = STATUS_BLANK;
            board[y][x].element.style.backgroundColor = "white";
        }
    }
}

function checkBoardRowFull() {
    for( var y=BOARD_HEIGHT-2 ; y >= 0 ; y-- ) {
        for( var x=1 ; x < BOARD_WIDTH ; x++ ) {
            if( x == BOARD_WIDTH-1) {
                deleteRow(y);    
                pullRowDown(y);
            }
            else if( boardArray[y][x].blockStatus == STATUS_BLANK )
                break;
        }
    }
    
    return false;
}

function timerEvent() {
    if(checkMoveAvailability(40) == true) {
        eraseBlock();
        brickOnBoard_Y++;
        drawBlock(blockColors[currentBlock]);
    } else { // if the block reached bottom or can't move anymore
        drawBlock("grey");
        if( checkBoardRowFull() == true )
            console.log('check row delete');
        initBlock();   
    }        
}

/*
function checkMoveAvailability(charCode) {
    if(charCode === 37) { // move Left 
        if(boardArray[brickOnBoard_Y][brickOnBoard_X-1].blockStatus > STATUS_BLANK)
            return false;
        else
            brickOnBoard_X--;
    } else if (charCode === 39) { // move Right 
        if(boardArray[brickOnBoard_Y][brickOnBoard_X+1].blockStatus > STATUS_BLANK)
            return false;
        else
            brickOnBoard_X++;        
    } else if (charCode === 40) { // move Down 
        if(boardArray[brickOnBoard_Y+1][brickOnBoard_X].blockStatus > STATUS_BLANK) {
          freezeBrick();
          return false;
        } else
            brickOnBoard_Y++;
    }
}
*/

function checkMoveAvailability(charCode) {
    
    var x, y, tempX=0, tempY=0, tempType=currentBlockTransType;
    
    switch(charCode) {
        case 40 : // down key
            tempY++;
            break;
        case 38 : // up key
            if(tempType + 1 >= blockTransforms[currentBlock].length-1)
               tempType=0;
            else
               tempType++;
            break;
        case 39 : // right key
            tempX++;
            break;
        case 37 : // left key
            tempX--;
            break;
    }
    
    for( var j=0 ; j < blockTransforms[currentBlock][tempType].length ; j++ ) {
        if( j%2 == 0 ) // j가 짝수(x 상대좌표) 
            x = blockTransforms[currentBlock][currentBlockTransType][j];
        else {
            y = blockTransforms[currentBlock][currentBlockTransType][j];
            
            if( brickOnBoard_X+x+tempX <= 0 || brickOnBoard_X+x+tempX >= BOARD_WIDTH-1) { // 인덱스가 배열인덱스보다 크거나 작을 때
                return false;
            } else if( brickOnBoard_Y+y+tempY >= BOARD_HEIGHT-1 ) {
                return false;
            } else if( boardArray[brickOnBoard_Y + y + tempY][brickOnBoard_X + x + tempX].blockStatus >= STATUS_DEAD_BRICK ) {
                return false; // 블록이 겹친다 (더 움직이거나 회전할 수 없다)
            } 
        }   
    }
    
    return true;
}

document.onkeydown = function keyDownHandler(e) {
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    //console.log(charCode);
    
    if( checkMoveAvailability(charCode) == false ) {
        // do nothing
    } else {
        switch(charCode) {
            case 40 : // down key
                eraseBlock();
                brickOnBoard_Y++;
                drawBlock(blockColors[currentBlock]);  
                break;
            case 38 : // up key
                eraseBlock();
                rotateBlock();
                drawBlock(blockColors[currentBlock]);
                break;
            case 39 : // right key
                eraseBlock();
                brickOnBoard_X++;
                drawBlock(blockColors[currentBlock]);
                break;
            case 37 : // left key
                eraseBlock();
                brickOnBoard_X--;
                drawBlock(blockColors[currentBlock]);
                break;
        }
    }    
}