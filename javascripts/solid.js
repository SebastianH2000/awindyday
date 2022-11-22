class Solid {
    constructor(id,position,width,height,locked) {
        this.position = new Vector (Math.round(position.x),Math.round(position.y));
        //this.remainder = position.sub(this.position);
        this.remainder = new Vector (position.x - this.position.x, position.y - this.position.y);
        this.width = width;
        this.height = height;
        this.topEdge = this.position.y + this.height/2;
        this.bottomEdge = this.position.y - this.height/2;
        this.leftEdge = this.position.x - this.width/2;
        this.rightEdge = this.position.x + this.width/2;
        if (locked !== undefined && locked) {
            this.locked = true;
            this.isSet = true;
        }
        else {
            this.locked = false;
            this.isSet = false;
        }
        this.warningTimer = 1.5;
        this.fallSpeed = 1;
        this.speed = 0;
        this.dimensions = '1x1';
        this.image = document.getElementById(this.dimensions + "block" + (Math.floor(this.position.x * randomSeed * 1000) % 4 + 1));
        this.id = id;
    }

    CollidePlayers(motion) {
        if (motion === 'y-') {
            for (let i = 0; i < playerArr.length; i++) {
                let bottomEdge = this.position.y - this.height/2;
                let topEdge = this.position.y + this.height/2;
                let leftEdge = this.position.x - this.width/2;
                let rightEdge = this.position.x + this.width/2;
                if (bottomEdge < playerArr[i].position.y + 16 && topEdge > playerArr[i].position.y - 8) {
                    if ((playerArr[i].position.x - 8 < rightEdge) && (playerArr[i].position.x + 8 > leftEdge) ) {
                        if (playerArr[i].isGrounded) {
                            playerArr[i].kill(i+1);
                        }
                        else {
                            playerArr[i].bump(this.position.y - this.height/2 - 8,0-this.speed/2*gameSpeed);
                        }
                    }
                }
            }
        }
    }

    CollideOtherSolids(xChange, yChange) {
        let colliding = false;
        let xPos = xChange + this.position.x;
        let yPos = yChange + this.position.y;
        for (let i = 0; i < solidArr.length; i++) {
            //if (i !== this.id && solidArr[i].isSet && isCollide(solidArr[i],this,{x: 0,y: 0},{x: xChange, y: yChange},true)) {
            if (i !== this.id && solidArr[i].isSet && rectCollider({x: xPos, y: yPos, width: this.width, height: this.height}, {x: solidArr[i].position.x, y: solidArr[i].position.y, width: solidArr[i].width, height: solidArr[i].height})) {
                colliding = true;
            }
        }
        return colliding;
    }

    Move(amount) {
        this.remainder.add(amount);

        let move = new Vector(Math.round(this.remainder.x),Math.round(this.remainder.y));

        this.remainder.sub(move);

        if (move.x !== 0 || move.y !== 0) {
            if (move.x !== 0) {
                /*this.remainders.x -= move.x;
                this.position.x += move.x;*/
            }
            if (move.y !== 0) {
                if (move.y > 0) {
                    while (move.y > 0) {
                        this.position.y++;
                        this.CollidePlayers('y+');
                        move.y--;
                    }
                }
                if (move.y < 0) {
                    while (move.y < 0) {
                        this.CollidePlayers('y-');
                        if (!this.CollideOtherSolids(0, -1)) {
                            this.position.y--;
                            move.y++;
                        }
                        else {
                            move.y = 0;
                            this.isSet = true;
                            score++;
                            this.speed = 0;
                        }
                    }
                }
            }
        }
        this.topEdge = this.position.y + this.height/2;
        this.bottomEdge = this.position.y - this.height/2;
    }

    Highlight(color) {
        ctx.drawImage(document.getElementById('1x1block1'),this.position.x - this.width/2 - camera.position.x, (-this.position.y) - this.height/2 + camera.position.y,this.width,this.height);
    }
}

solidArr = new Array(1);
solidArr[0] = new Solid(0,new Vector(0,-16),400,16,true);


//generate new boxes to fall from the sky
function createNewBox() {
    let testPos = (Math.floor(Math.random()*25)*16-192);
    let yPos = Math.floor(camera.position.y/16)*16+128;
    let isColliding = true;
    let testCount = 0;
    //check to make sure that box isn't generating on collision with anything else
    while (isColliding && testCount < 25) {
        testPos = (Math.floor(Math.random()*25)*16-192);
        isColliding = false;
        for (let i = 0; i < playerNum; i++) {
            if (rectCollider({x: playerArr[i].position.x, y: playerArr[i].position.y, width: playerArr[i].width, height: playerArr[i].height}, {x: testPos, y: yPos, width: 16, height: 16})) {
                isColliding = true;
            }
        }
        for (let i = 0; i < solidArr.length; i++) {
            if (rectCollider({x: solidArr[i].position.x, y: solidArr[i].position.y, width: solidArr[i].width, height: solidArr[i].height}, {x: testPos, y: yPos, width: 16, height: 16})) {
                isColliding = true;
            }
        }
        testCount++;
    }
    if (testCount < 25) {
        let yPos = Math.floor(camera.position.y/16)*16+128;
        solidArr.push(new Solid(solidArr.length,new Vector(testPos,yPos),16,16));
    }
}
