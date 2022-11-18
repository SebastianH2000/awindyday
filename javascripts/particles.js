var effectCan = document.getElementById("effects");
var effectCtx = effectCan.getContext('2d');

effectCan.width = 512;
effectCan.height = 288;

var particleNum = 200;

var particleArr = new Array(particleNum);

effectCtx.translate(effectCan.width/2,effectCan.height/2);

effectCtx.fillStyle = 'white';

class Particle {
    constructor (life, position, velocity, acceleration) {
        this.life = life;
        this.lifeType = life.type;
        this.position = new Vector (position.x, position.y);
        this.velocity = new Vector (velocity.x, velocity.y);
        this.acceleration = new Vector (acceleration.x, acceleration.y);
        if (life.type === 'timer') {
            this.timer = 0;
            this.lifetime = life;
        }
    };

    move () {
        let tempVelocity = this.velocity.copy();
        tempVelocity.mult(gameSpeed);
        this.position.add(tempVelocity);
        this.velocity.add(this.acceleration);
        if (this.lifeType === 'timer') {
            this.timer += fpsInv;
        }
        if (this.position.x < -258) {
            this.position.x = 257;
        }
        else if (this.position.x > 258) {
            this.position.x = -257;
        }
        if (this.position.y < -146) {
            this.position.y = 145;
        }
        else if (this.position.y > 146) {
            this.position.y = -145;
        }
    }

    draw () {
        effectCtx.fillRect(Math.round(this.position.x),Math.round(this.position.y),1,1);
    }
}

for (let i = 0; i < particleArr.length; i++) {
    particleArr[i] = new Particle ({type: 'immortal'},new Vector(Math.floor(Math.random()*512)-256,Math.floor(Math.random()*288)-144),new Vector(-1.5-(Math.random()/3),0.4-(Math.random()/6)),new Vector(0,0));
}

//var part = new Particle ({type: 'timer'},new Vector(0,0),new Vector(2,0),new Vector(-0.1,0));
