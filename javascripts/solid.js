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
                            playerArr[i].kill();
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
        ctx.drawImage(document.getElementById('1x1block1'),this.position.x - this.width/2, (-this.position.y) - this.height/2,this.width,this.height);
    }
}

solidArr = new Array(1);
solidArr[0] = new Solid(0,new Vector(0,-16),400,16,true);
//solidArr[1] = new Solid(1,new Vector(0,40),80,48,true);
//solidArr[2] = new Solid(2,new Vector(48,24),80,16,true);
//solidArr[3] = new Solid(3,new Vector(-104,72),64,16,true);
//solidArr[4] = new Solid(4,new Vector(-104,104),64,16);
//solidArr[5] = new Solid(5,new Vector(0,104),64,32);

function createNewBox() {
    solidArr.push(new Solid(solidArr.length,new Vector((Math.floor(Math.random()*25)*16-192),128),16,16));
}
