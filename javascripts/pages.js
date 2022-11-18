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

switchMenu('start');
