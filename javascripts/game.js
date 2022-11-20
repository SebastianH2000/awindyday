var fps = 60;
gameSpeed = 60/fps*gameSpeedMult;
//gameSpeed = 1;
var fpsInv = 1000/fps;
var lastPage = new Vector(0,0);

var blockTimer = -2;

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
        //ctx.drawImage(document.getElementById("title"),-128,-128,256,64);
    }

    else if (gameStates.playing) {
        ctx.drawImage(document.getElementById("groundCanvas"),-200,camera.roundPosition.y+solidArr[0].height/2,400,16);

        for (let i = 0; i < playerArr.length; i++) {
            playerArr[i].move();
            playerArr[i].physics();
        }

        ctx.fillStyle = 'white';
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
            if (i !== 0) {
                solidArr[i].Highlight('red');
                /*if (solidArr[i].isSet) {
                    solidArr[i].Highlight('red');
                }
                else {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(solidArr[i].position.x - solidArr[i].width/2, (-solidArr[i].position.y) - solidArr[i].height/2+8,solidArr[i].width,solidArr[i].height);
                }*/
            }
        }
        for (let i = 0; i < playerNum; i++) {
            if (playerArr[i].facing === 'left') {
                ctx.drawImage(document.getElementById("player"),playerArr[i].position.x-(playerArr[i].width/2),(-playerArr[i].position.y)-(playerArr[i].height/2),playerArr[i].width,playerArr[i].height);
            }
            else {
                ctx.scale(-1,1);
                ctx.drawImage(document.getElementById("player"),0-playerArr[i].position.x-(playerArr[i].width/2),(-playerArr[i].position.y)-(playerArr[i].height/2),playerArr[i].width,playerArr[i].height);
                ctx.scale(-1,1);
            }
        }

        //create blocks
        if (blockTimer > 1.5) {
            createNewBox();
            blockTimer = 0;
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
