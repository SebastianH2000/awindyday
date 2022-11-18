var can = document.getElementById("myCanvas");
var ctx = can.getContext("2d");

var canX = 512;
var canY = 288;
can.width = canX;
can.height = canY;


var screenScale = 1;




function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    if (r !== undefined && g == undefined && b == undefined) {
        return "#" + componentToHex(r) + componentToHex(r) + componentToHex(r);
    }
    else {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
}

function clearCanvas(color, id, x, y) {
    let ctxId = id || ctx;
    if (ctxId !== ctx) {
        ctxId.fillStyle = color;
        ctxId.fillRect(0, 0, x, y);
    }
    else {
        ctxId.fillStyle = color;
        ctxId.fillRect(0 - (canX / 2) / screenScale, 0 - (canY / 2) / screenScale, canX / screenScale, canY / screenScale);
    }
}

function drawSquare(x1, y1, size, ctxObj) {
    if (ctxObj === undefined) {
        ctx.beginPath();
        ctx.fillRect(x1, y1, size, size);
        ctx.closePath();
    }
    else {
        ctxObj.beginPath();
        ctxObj.fillRect(x1, y1, size, size);
        ctxObj.closePath();
    }
}

function drawCircle(x, y, r, ctxObj) {
    ctxObj.beginPath();
    ctxObj.arc(x, y, r, 0, 360);
    ctxObj.fill();
    ctxObj.closePath();
}

function newCanvas(id, divId, width, height) {
    let canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    document.getElementById(divId).appendChild(canvas);
};

//rotates [a] degrees from a point at ([x],[y])
function rotate(tempCtx, x, y, a) {
    tempCtx.save();
    tempCtx.translate(x, y);
    tempCtx.rotate(a * Math.PI / 180);
    tempCtx.translate(0 - x, 0 - y);
}

//rotates [a] degrees from a point at the center of a rectangle defined by 2 corners - upper-left at ([x1],[y1]) and bottom-right at ([x2],[y2])
function rotateByCoords(tempCtx, x1, y1, x2, y2, a) {
    let pointX = (x1 + x2) / 2;
    let pointY = (y1 + y2) / 2;
    tempCtx.save();
    tempCtx.translate(pointX, pointY);
    tempCtx.rotate(a * Math.PI / 180);
    tempCtx.translate(0 - pointX, 0 - pointY);
}

//rotates [a] degrees from a point at the center of a rectangle defined by an upper-left corner ([x],[y]), and [width] and [height] values
function rotateByCorner(tempCtx, x, y, width, height, a) {
    let pointX = (x + (x + width)) / 2;
    let pointY = (y + (y + height)) / 2;
    tempCtx.save();
    tempCtx.translate(pointX, pointY);
    tempCtx.rotate(a * Math.PI / 180);
    tempCtx.translate(0 - pointX, 0 - pointY);
}

//a combination of rotateByCorner() and ctx.drawImage()
//rotates [a] degrees from a point at the center of a rectangle defined by an upper-left corner ([x],[y]), and [width] and [height] values
//draws an image from a source variable [src] with the image's upper-left corner at ([x],[y]) and [width] and [height] values that determine the size of the image to be drawn
//[ratioKeep] is an optional parameter that preserves the image's aspect ratio based on width
//[ratioFromHeight] is an optional boolean parameter that overrides ratioKeep and instead defines the aspect ratio based on height if [ratioFromHeight]'s value equals true
function rotateByImage(tempCtx, src, x, y, width, height, a, ratioKeep, ratioFromHeight) {
    if (src !== "none") {
        if (ratioKeep === undefined || ratioKeep === false) {
            tempCtx.beginPath();
            rotateByCorner(tempCtx, x, y, width, height, a);
            tempCtx.drawImage(src, x, y, width, height);
            tempCtx.restore();
        }
        if (ratioKeep) {
            if (ratioFromHeight === true) {
                let aspectRatio = src.width / src.height;
                let newWidth = height * aspectRatio;
                tempCtx.beginPath();
                rotateByCorner(tempCtx, x, y, newWidth, height, a);
                tempCtx.drawImage(src, x, y, newWidth, height);
                ctempCtx.restore();
            }
            else {
                let aspectRatio = src.height / src.width;
                let newHeight = width * aspectRatio;
                tempCtx.beginPath();
                rotateByCorner(tempCtx, x, y, width, newHeight, a);
                tempCtx.drawImage(src, x, y, width, newHeight);
                tempCtx.restore();
            }
        }
    }
}
