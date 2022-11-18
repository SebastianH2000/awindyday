var camera = {
    position: new Vector(0,0),
    roundPosition: new Vector(0,0)
}

var gameStates = {
    menu: 'start',
    playing: false,
    waterLevel: 0,
    score: 0,
};

var playerNum = 1;
var playerArr = new Array(playerNum);
var gameMode = 'versus';
var colorNum = 4;
var colorArr = [{name: "White", color: "#FFFFFF"},{name: "Cyan", color: "#00FFFF"},{name: "Pink", color: "#FF00FF"},{name: "Blue", color: "#0000FF"}];
var platform = 'computer';

var gameSpeedMult = 1;
var gameSpeed = 1;

var spriteNum = 1;
var spriteNameArr = ['frank'];
var spriteArr = {frank: []};

var sheetNum = 1;
for (let i = 0; i < spriteNum; i++) {
    spriteArr[spriteNameArr[i]] = new Array(sheetNum);
}

//standing
//name system like spriteName-stance-number
spriteArr['frank'] = [{id: 'player', element: document.getElementById('player')}];

function collideSolids(xPos, yPos, shouldBeSet) {
    let colliding = false;
    for (let i = 0; i < solidArr.length; i++) {
        if (shouldBeSet !== undefined) {
            if (shouldBeSet && solidArr[i].isSet) {
                let topEdge = solidArr[i].topEdge;
                let bottomEdge = solidArr[i].bottomEdge;
                if (topEdge > yPos && bottomEdge < yPos + 16) {
                    let leftEdge = solidArr[i].position.x - solidArr[i].width/2;
                    let rightEdge = solidArr[i].position.x + solidArr[i].width/2;
                    if ((xPos - 8 < rightEdge) && (xPos + 8 > leftEdge) ) {
                        colliding = true;
                    }
                }
            }
        }
        else {
            let topEdge = solidArr[i].topEdge;
            let bottomEdge = solidArr[i].bottomEdge;
            if (topEdge > yPos && bottomEdge < yPos + 16) {
                let leftEdge = solidArr[i].position.x - solidArr[i].width/2;
                let rightEdge = solidArr[i].position.x + solidArr[i].width/2;
                if ((xPos - 8 < rightEdge) && (xPos + 8 > leftEdge) ) {
                    colliding = true;
                }
            }
        }
    }
    return colliding;
}

class Player {
    constructor (playerID,xPos,controls) {
        this.remainder = new Vector(0,0);
        this.position = new Vector(xPos,0);
        this.velocity = new Vector(0,0);
        this.width = 16;
        this.height = 16;
        this.isGrounded = true;
        this.alive = true;
        this.id = playerID;
        this.facing = 'left';
        this.controls = controls;
        this.upBuffer = 4;
        this.groundBuffer = 4;
        this.jumpBuffer = 4;
        this.animationType = 'standing';
        this.animationTimer = 1;
        this.sprite = 'frank';
        if (playerID === 1) {
            this.color = "#FFFFFF";
        }
        else if (playerID === 2) {
            this.color = "#00FFFF";
        }
        else if (playerID === 3) {
            this.color = "#FF00FF";
        }
        else if (playerID === 4) {
            this.color = "#0000FF";
        }
    }

    drawCanvases () {
        for (let i = 0; i < sheetNum; i++) {
            if (document.getElementById('spriteGen').contains(spriteArr[this.sprite][i].element)) {
                spriteArr[this.sprite][i].element.remove();
            }
            else {
                //newCanvas('1-frank-Idle-1','spriteGen',16,16);
                newCanvas(this.playerID + '-' + this.sprite + '-' + 'Idle-1','spriteGen',16,16);
                //document.getElementById(this.playerID + '-' + this.sprite + '-' + 'Idle-1').putImageData(drawSprite(document.getElementById(this.playerID + '-' + this.sprite + '-' + 'Idle-1'),this.color),0,0)
                document.getElementById(this.playerID + '-' + this.sprite + '-' + 'Idle-1').putImageData(drawSprite(document.getElementById('player'),this.color),0,0)
            }
        }
    }

    kill () {
        if (playerNum === 1) {
            switchMenu('player');
            gameStates.playing = false;
        }
    }

    bump (pos) {
        this.position.y = pos-1;
        this.velocity.y = 0;
        if (collideSolids(this.position.x,this.position.y - 1,true)) {
            this.kill();
        }
    }

    move () {
        if (map[this.controls.up]) {
            this.jumpBuffer = 4;
        }

        if ((map[this.controls.up] || this.jumpBuffer > 0) && (this.isGrounded || (this.groundBuffer > 0 && this.velocity.y < 0))) {
            this.velocity.y = 4;
            this.upBuffer = 4;
            this.jumpBuffer = 0;
        }
        else if (this.jumpBuffer > 0) {
            this.jumpBuffer--;
        }

        if (map[this.controls.left] && !map[this.controls.right]) {
            if (this.velocity.x > -3) {
                this.velocity.x--;
            }
            else {
                this.velocity.x = -3;
            }
        }
        if (map[this.controls.right] && !map[this.controls.left]) {
            if (this.velocity.x < 3) {
                this.velocity.x++;
            }
            else {
                this.velocity.x = 3;
            }
        }
    }

    physics () {
        if (!this.isGrounded) {
            this.velocity.y -= 0.25 * gameSpeed;
        }

        this.remainder.x += (this.velocity.x * gameSpeed);
        this.remainder.y += (this.velocity.y * gameSpeed);
        let velX = Math.round(this.remainder.x);
        let velY = Math.round(this.remainder.y);
        if (velX !== 0 || velY !== 0) {
            //console.log("movement: " + velX + ", " + velY);
            //check x velocity pixel-by-pixel
            if (velX !== 0) {
                //if heading to the right
                if (velX > 0) {
                    this.facing = 'right';
                    this.remainder.x -= velX;
                    while (velX > 0) {
                        if (collideSolids(this.position.x + 1,this.position.y,true)) {
                            velX = 0;
                            this.remainder.x = 0;
                        }
                        else {
                            this.position.x++;
                            velX--;
                            if (this.velocity.x > 0.5) {
                                this.velocity.x *= 0.5;
                            }
                            else {
                                this.velocity.x = 0;
                            }
                        }
                    }
                }

                //if heading to the left
                else {
                    this.facing = 'left';
                    this.remainder.x -= velX;
                    while (velX < 0) {
                        if (collideSolids(this.position.x - 1,this.position.y,true)) {
                            velX = 0;
                            this.remainder.x = 0;
                        }
                        else {
                            this.position.x--;
                            velX++;
                            if (this.velocity.x < -0.5) {
                                this.velocity.x *= 0.5;
                            }
                            else {
                                this.velocity.x = 0;
                            }
                        }
                    }
                }
            }



            //check y velocity pixel-by-pixel
            if (velY !== 0) {
                //if heading up
                if (velY > 0) {
                    this.remainder.y -= velY;
                    while (velY > 0) {
                        if (collideSolids(this.position.x,this.position.y + 1)) {
                            velY = 0;
                            this.remainder.y = 0;
                            if (this.upBuffer > 0) {
                                this.upBuffer--;
                            }
                            else {
                                this.velocity.y = 0;
                            }
                        }
                        else {
                            //console.log('traveled up')
                            this.position.y++;
                            velY--;
                        }
                    }
                }

                //if heading down
                else {
                    this.remainder.y -= velY;
                    while (velY < 0) {
                        if (collideSolids(this.position.x,this.position.y - 1)) {
                            velY = 0;
                            this.remainder.y = 0;
                            this.isGrounded = true;
                            this.groundBuffer = 4;
                        }
                        else {
                            this.position.y--;
                            velY++;
                        }
                    }
                }
            }
        }


        if (!collideSolids(this.position.x,this.position.y - 1,true)) {
            this.isGrounded = false;
            if (this.groundBuffer > 0) {
                this.groundBuffer--;
            }
        }
    }
}

var playerSpawnDist = 400;

//ikjl
map[73] = false;
map[75] = false;
map[74] = false;
map[76] = false;

function startGame() {
    for (let i = 0; i < playerNum; i++) {
        //playerArr[i] = new Player(i, Math.floor(((i+1)/(playerNum+1))*playerSpawnDist-(playerSpawnDist/2)), {type: 'keyboard', up: 38, right: 39, down: 40, left: 37});
        if (platform === 'computer') {
            if (i === 0) {
                playerArr[i] = new Player(i, Math.floor(((i+1)/(playerNum+1))*playerSpawnDist-(playerSpawnDist/2)), {type: 'keyboard', up: 38, right: 39, down: 40, left: 37});
            }
            else if (i === 1) {
                playerArr[i] = new Player(i, Math.floor(((i+1)/(playerNum+1))*playerSpawnDist-(playerSpawnDist/2)), {type: 'keyboard', up: 87, right: 68, down: 83, left: 65});
            }
            else if (i === 2) {
                playerArr[i] = new Player(i, Math.floor(((i+1)/(playerNum+1))*playerSpawnDist-(playerSpawnDist/2)), {type: 'keyboard', up: 73, right: 76, down: 75, left: 74});
            }
        }
    }
    switchMenu('game');
    gameStates.playing = true;
    blockTimer = -2;
    solidArr.length = 1;
}

//function playerMenu() {
//    switchMenu('player');
//}

//hideElement('startMenu');
//startGame();

function killFrank() {
    playerArr = new Array(playerNum);
    startGame();
}
