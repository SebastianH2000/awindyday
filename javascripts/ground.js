var groundCan = document.getElementById("groundCanvas");
var groundCtx = groundCan.getContext("2d");

var groundCanX = 400;
var groundCanY = 16;
groundCan.width = groundCanX;
groundCan.height = groundCanY;

var randomSeed = Math.random();

groundCtx.msImageSmoothingEnabled = false;
groundCtx.mozImageSmoothingEnabled = false;
groundCtx.webkitImageSmoothingEnabled = false;
groundCtx.imageSmoothingEnabled = false;

for (let i = 0; i < 25; i++) {
    groundCtx.drawImage(document.getElementById("ground" + (Math.floor(i * randomSeed * 1000) % 4 + 1)),i*16,0,16,16);
}
groundCtx.fillRect(399,0,1,1);
groundCtx.fillRect(398,0,1,1);
groundCtx.fillRect(399,1,1,1);
groundCtx.fillStyle = 'white';
groundCtx.fillRect(398,1,1,1);
groundCtx.fillRect(399,2,1,12);
