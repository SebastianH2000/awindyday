var bigSide = 'x';
var sideOffset = 0;
var scaleFactor = 0;

function scaleWindow() {
    document.body.style.transform = "scale(1)";
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    document.body.style.transform = "scale(" + Math.min(x / canX, y / canY) + ")";
    document.body.style.height = y + "px";
    scaleFactor = Math.min(x / canX, y / canY);

    /*if (x/canX < y/canY) {
      document.body.style.margin = (((y - (canY*scaleFactor))/2) + "px 0px 0px 0px");
    }
    else {
      document.body.style.margin = (((y - (canY*scaleFactor))/2) + "px 0px 0px 0px");
    }*/
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(can.width / 2, can.height / 2);
    ctx.scale(1 * screenScale, 1 * screenScale);
    canObj = can.getBoundingClientRect();
    if (x / canX > y / canY) {
        bigSide = 'x';
        //sideOffset = ((x*scaleFactor) - canX * scaleFactor)*scaleFactor;
        sideOffset = canObj.left / scaleFactor;
        //sideOffset = x-((canX/2)*scaleFactor);
        //sideOffset = 178;
    }
    else {
        bigSide = 'y';
        //sideOffset = y-(canY*scaleFactor);
        sideOffset = canObj.top / scaleFactor;
    }
}
window.onload = function () {
    scaleWindow();
}




var mousePos = new Vector(0,0);
//mouse input
(function () {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        if (bigSide === 'x') {
            mousePos.x = (event.pageX / screenScale) / scaleFactor - ((canX / 2)/screenScale) - (sideOffset/screenScale);
            mousePos.y = (event.pageY / screenScale) / scaleFactor - ((canY / 2)/screenScale);
            /*mouseX = (event.pageX * screenScale) / scaleFactor - (canX / 2) - sideOffset;
            mouseY = (event.pageY * screenScale) / scaleFactor - (canY / 2);*/
        }
        else {
            mousePos.x = (event.pageX / screenScale) / scaleFactor - ((canX / 2)/screenScale);
            mousePos.y = (event.pageY / screenScale) / scaleFactor - ((canY / 2)/screenScale) - (sideOffset/screenScale);
            /*mouseX = (event.pageX / screenScale) / scaleFactor - (canX / 2);
            mouseY = ((event.pageY / screenScale) / scaleFactor - (canY / 2)) - sideOffset;*/
        }
    }
})();

//keyboard input
var map = {}; // You could also use an array
//wsad
map[87] = false;
map[83] = false;
map[65] = false;
map[68] = false;

//^v<>
map[38] = false;
map[40] = false;
map[37] = false;
map[39] = false;

//ikjl
map[73] = false;
map[75] = false;
map[74] = false;
map[76] = false;

//spacebar
map[32] = false;

onkeydown = onkeyup = function(e){
  e = e || event; // to deal with IE
  map[e.keyCode] = e.type == 'keydown';
  /* insert conditional here */
}

function toBijective(x) {
    if (x > 0) {
        return x * 2 - 1;
    }
    else {
        return Math.abs(x) * 2;
    }
}

function fromBijective(x) {
    if (x % 2 === 1) {
        return (x + 1) / 2;
    }
    else {
        return x / -2;
    }
}

function isCollide(box1, box2, aChange, bChange, isBox) {
    let a = {position: box1.position.copy(),width: box1.width,height: box1.height};
    let b = {position: box2.position.copy(),width: box2.width,height: box2.height};

    //check if adjacent, if so return false
    let distanceX = a.position.x - b.position.x;
    let distanceY = a.position.y - b.position.y;
    let widthAvg = (a.width + b.width)/2;
    let heightAvg = (a.height + b.height)/2;
    if (Math.abs(distanceX) === widthAvg || Math.abs(distanceY) === heightAvg) {
        return false;
    }

    //check collision
    a.position.sub(box1.width/2,box1.height/2);
    b.position.sub(box2.width/2,box2.height/2);
    if (aChange !== undefined && bChange !== undefined) {
        a.position.x += aChange.x;
        a.position.y += aChange.y;
        b.position.x += bChange.x;
        b.position.y += bChange.y;
    }
    if (isBox) {
        a.width--;
        b.width--;
    }
    return !(
        ((a.position.y + a.height) < (b.position.y)) ||
        (a.position.y > (b.position.y + b.height)) ||
        ((a.position.x + a.width) < b.position.x) ||
        (a.position.x > (b.position.x + b.width))
    );
}

/*function rectCollider(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}*/

function rectCollider(a, b) {
    return !(
        (a.y + a.height/2) <= (b.y - b.height/2) ||
        (a.y - a.height/2) >= (b.y + b.height/2) ||
        (a.x + a.width/2) <= (b.x - b.width/2) ||
        (a.x - a.width/2) >= (b.x + b.width/2)
    )
}

newCanvas('tempCan','spriteGen',16,16);
function drawSprite(referenceElement, color) {
    //generate color string
    let colorString = color.substring(1);

    //draw temporary image in new color and return its data
    tempCan.getContext('2d').clearRect(0,0,16,16);
    tempCan.getContext('2d').drawImage(document.getElementById(referenceElement),0,0,16,16);
    let imgArr = tempCan.getContext('2d').getImageData(0,0,16,16);
    let returnArr = new Uint8ClampedArray(1024);
    for (let i = 0; i < imgArr.data.length; i += 4) {
        if (imgArr.data[i] === 255 && imgArr.data[i+3] > 0) {
            returnArr[i + 0] = Number('0x' + colorString.slice(0, 2));
            returnArr[i + 1] = Number('0x' + colorString.slice(2, 4));
            returnArr[i + 2] = Number('0x' + colorString.slice(4, 6));
            returnArr[i + 3] = 255;
        }
        else if (imgArr.data[i] === 0) {
            returnArr[i + 0] = 0;
            returnArr[i + 1] = 0;
            returnArr[i + 2] = 0;
            returnArr[i + 3] = 0;
        }
    }
    let data = new ImageData(returnArr, 16, 16);
    return data;
}
