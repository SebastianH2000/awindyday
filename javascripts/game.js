var fps = 60;
gameSpeed = 60/fps*gameSpeedMult;
//gameSpeed = 1;
var fpsInv = 1000/fps;
var lastPage = new Vector(0,0);

var blockTimer = -2;

var totalFrames = 0;

var isLocal = true;

function mainLoop() {
    window.scroll(0,0)
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        pageX = win.innerWidth || docElem.clientWidth || body.clientWidth,
        pageY = win.innerHeight || docElem.clientHeight || body.clientHeight;
    if (lastPage.x !== pageX || lastPage.y !== pageY) {
        scaleWindow();
    }

    let cornerX = 0-(canX/screenScale)/2;
    let cornerY = 0-(canY/screenScale)/2;

    ctx.fillStyle = "black";
    ctx.fillRect(cornerX, cornerY, canX/screenScale, canY/screenScale);

    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    if (gameStates.mainMenu) {

    }

    //if the game is in play mode
    else if (gameStates.playing) {
        frameCount++;
        //player physics
        for (let i = 0; i < playerArr.length; i++) {
            playerArr[i].move();
            playerArr[i].physics();
        }

        //solid physics
        for (let i = 0; i < solidArr.length; i++) {
            if (!solidArr[i].isSet) {
                if (solidArr[i].warningTimer > 0) {
                    //ctx.fillRect(solidArr[i].position.x-8,200,16,1)
                    solidArr[i].warningTimer -= 1/fps;
                }
                else {
                    solidArr[i].Move(new Vector(0,0-solidArr[i].speed/2*gameSpeed));
                    solidArr[i].speed += solidArr[i].fallSpeed/4;
                }
            }
        }
        
        //calculate camera position
        if (playerNum !== undefined && playerNum === 1 && playerArr[0] !== undefined && playerArr[0].isGrounded) {
            if (playerArr[0].position.y > camera.targetPosition.y) {
                camera.targetPosition.y = playerArr[0].position.y;
            }
        }
        else if (playerNum !== undefined && playerNum > 1 && playerArr[0] !== undefined) {
            let sumYPos = 0;
            let deadCount = 0;
            for (let i = 0; i < playerNum; i++) {
                if (playerArr[i].isAlive) {
                    if (playerArr[i].isGrounded && playerArr[i].position.y > playerArr[i].lowestYPos) {
                        playerArr[i].lowestYPos = playerArr[i].position.y;
                    }
                    sumYPos += playerArr[i].lowestYPos;
                }
                else deadCount++;
            }
            camera.targetPosition.y = Math.floor(sumYPos/(16*(playerNum-deadCount)))*16;
            //camera.position.y = Math.floor(lerp(camera.position.y,camera.targetPosition.y,0.10));
            for (let i = 0; i < playerNum; i++) {
                if (playerArr[i].position.y < (camera.position.y-160)) {
                    playerArr[i].kill(i+1);
                }
            }
        }
        camera.position.y = Math.floor(lerp(camera.position.y,camera.targetPosition.y,0.10));

        //draw ground solid
        ctx.drawImage(document.getElementById("groundCanvas"),-200,camera.position.y+solidArr[0].height/2,400,16);

        //draw solids
        for (let i = 0; i < solidArr.length; i++) {
            if (i !== 0) {
                solidArr[i].Highlight('red');
            }
        }

        //draw players
        for (let i = 0; i < playerNum; i++) {
            if (playerArr[i].isAlive || Math.floor(frameCount / fps*3) % 2 === 0) {
                let playerImg = document.getElementById("player");
                if (!isLocal) {
                    if (!isLocal && document.getElementById((i+1) + "-frank-Idle-1") !== null) {
                        playerImg = document.getElementById((i+1) + "-frank-Idle-1");
                    }
                    else {
                        playerArr[i].drawCanvases();
                    }
                }
                if (playerArr[i].facing === 'left') {
                    ctx.drawImage(playerImg,playerArr[i].position.x-(playerArr[i].width/2),(-playerArr[i].position.y)-(playerArr[i].height/2) + camera.position.y,playerArr[i].width,playerArr[i].height);
                }
                else {
                    ctx.scale(-1,1);
                    ctx.drawImage(playerImg,0-playerArr[i].position.x-(playerArr[i].width/2),(-playerArr[i].position.y)-(playerArr[i].height/2) + camera.position.y,playerArr[i].width,playerArr[i].height);
                    ctx.scale(-1,1);
                }
            }
        }

        //create blocks
        if (blockTimer > (1/(Math.sqrt(frameCount/300)))) {
            createNewBox();
            blockTimer = 0; //highschore of 718
        }
        else {
            blockTimer += 1/fps;
        }
    }

    effectCtx.clearRect(-256,-144,512,288);
    effectCtx.fillStyle = 'white';
    for (let i = 0; i < particleArr.length; i++) {
        particleArr[i].move();
        particleArr[i].draw();
    }

    lastPage.x = pageX;
    lastPage.y = pageY;
}

setInterval("mainLoop()",fpsInv);
