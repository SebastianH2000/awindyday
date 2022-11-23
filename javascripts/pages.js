function hideElement(id) {
    document.getElementById(id).style.display = 'none';
}

function flexElement(id) {
    document.getElementById(id).style.display = 'flex';
}

function switchMenu(menu) {
    if (menu === 'start') {
        flexElement('startMenu');
        hideElement('myCanvas');
        hideElement('playerMenu');
    }
    else if (menu === 'game') {
        hideElement('startMenu');
        flexElement('myCanvas');
        hideElement('playerMenu');
    }
    else if (menu === 'player') {
        hideElement('startMenu');
        hideElement('myCanvas');
        flexElement('playerMenu');
        hideElement('player1Select');
        hideElement('player2Select');
        hideElement('player3Select');
        hideElement('player4Select');
        for (let i = 0; i < playerNum; i++) {
            flexElement('player' + (i + 1) + 'Select');
        }
    }
}

function togglePlatform() {
    if (platform === 'computer') {
        platform = 'mobile';
        document.getElementById("platformDisplay").textContent = "Platform: Mobile";
        flexElement('mobileNote');
        flexElement('mobileNote2');
        if (playerNum > 2) {
            playerNum = 2;
            document.getElementById("playerNumDisplay").textContent = "Number of Players: " + playerNum;
        }
    }
    else {
        platform = 'computer';
        document.getElementById("platformDisplay").textContent = "Platform: Computer/PC";
        hideElement('mobileNote');
        hideElement('mobileNote2');
    }
}

hideElement('mobileNote');
hideElement('mobileNote2');
//hideElement('effects');

function togglePlayerNum() {
    let maxPlayers = 4;
    if (platform === 'mobile') {
        maxPlayers = 2;
    }
    if (playerNum >= maxPlayers) {
        playerNum = 1;
    }
    else {
        playerNum++;
    }
    document.getElementById("playerNumDisplay").textContent = "Number of Players: " + playerNum;

    //show game mode toggle
    if (playerNum > 1) {
        document.getElementById("gameModeDisplay").style.display = "";
        hideElement("mainMenuSpacer");
    }
    else {
        hideElement("gameModeDisplay");
        flexElement("mainMenuSpacer");
    }
}

hideElement("gameModeDisplay");
flexElement("mainMenuSpacer");

function toggleGameMode() {
    if (gameMode === 'versus') {
        document.getElementById("gameModeDisplay").textContent = "Game Mode: Co-op";
        gameMode = 'co-op';
    }
    else {
        document.getElementById("gameModeDisplay").textContent = "Game Mode: Versus";
        gameMode = 'versus';
    }
}

function togglePlayerControls(playerID) {
    if (document.getElementById('player' + playerID + 'Controls').innerHTML === 'Controls: Arrow Keys') {
        document.getElementById('player' + playerID + 'Controls').innerHTML = 'Controls: WASD';
    }
    else if (document.getElementById('player' + playerID + 'Controls').innerHTML === 'Controls: WASD') {
        document.getElementById('player' + playerID + 'Controls').innerHTML = 'Controls: IJKL';
    }
    else if (document.getElementById('player' + playerID + 'Controls').innerHTML === 'Controls: IJKL') {
        document.getElementById('player' + playerID + 'Controls').innerHTML = 'Controls: Arrow Keys';
    }
    //test var for the loop
    let controlValid = true;

    //stop underlining toggles
    for (let i = 0; i < playerNum; i++) {
        document.getElementById('player' + (i+1) + 'Controls').style.textDecoration = "none";
    }
    document.getElementById('playerMenuStartBtn').style.textDecoration = "underline white";

    //re-underline toggles if needed and check if the controls are valid
    for (let i = 0; i < playerNum; i++) {
        for (let j = 0; j < playerNum; j++) {
            if (i !== j && document.getElementById('player' + (i+1) + 'Controls').innerHTML === document.getElementById('player' + (j+1) + 'Controls').innerHTML) {
                controlValid = false;
                document.getElementById('player' + (i+1) + 'Controls').style.textDecoration = "underline red";
                document.getElementById('player' + (j+1) + 'Controls').style.textDecoration = "underline red";
                document.getElementById('playerMenuStartBtn').style.textDecoration = "underline red";
            }
        }
    }
    //set the global variable to the test one
    validControls = controlValid;
}

function getPlayerColor(color) {
    let searchingFor = 'name';
    if (color.substring(0,1) === '#') {
        searchingFor = 'color';
    }
    for (let i = 0; i < colorNum; i++) {
        if (color === colorArr[i][searchingFor]) {
            return i;
        }
    }
}

function togglePlayerColor(playerID) {
    let currentColor = getPlayerColor(document.getElementById('player' + (playerID) + 'Color').innerHTML.substring(7))
    let nextColor = currentColor + 1;
    if (nextColor >= colorNum) {
        nextColor = 0;
    }
    console.log(nextColor)
    document.getElementById('player' + (playerID) + 'Color').innerHTML = "Color: " + colorArr[nextColor].name;
}

switchMenu('start');
