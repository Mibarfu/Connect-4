let avatars = [];



const getToken1 = document.querySelector(".sets-player-1");
const getToken2 = document.querySelector(".sets-player-2");
const elementGameBoard = document.querySelector("#front-board");
const elementbackGameBoard = document.querySelector(".back-game-board");
const elementMovableToken = document.querySelector("#movable-token");  
const elementModal = document.querySelector(".modal");
const elementWinnerModalContent = document.querySelector(".winner-modal-content");
const elementWinnerNameModal = document.querySelector(".winner-name");
const elementWinnerAvatar12Modal = document.querySelector(".winner-avatar-player-12");
const elementWinnerAvatar2Modal = document.querySelector(".winner-avatar-player-2");
let elementFallToken = document.querySelector("#fall-token");



window.addEventListener('resize', () => {resizeFreeFallToken()});


document.querySelector(".enabled-sound-button").addEventListener("click", eventElementSoundControlButton,true);
document.querySelector(".restart-game-button").addEventListener("click", eventResetarBoardButton, true);
document.querySelector(".button-apply-changes").addEventListener("click", eventApplyConfigChange, true);


document.querySelector(".menu-play").addEventListener("click", () => {playGame()}, true);

document.querySelector(".button-next-round").addEventListener("click", 
    function() {
        buttonNextRound();
    }
    , true
);

document.querySelector(".button-finish-round").addEventListener("click", 
    function() {
        buttonFinishRound();
    }
    , true
);

document.querySelector(".menu-exit").addEventListener("click", 
    function() {
        buttonExit();
    }
    , true
);

document.querySelector(".menu-dropdown-configuration").addEventListener("transitionstart", () => {
    setConfigPanel(configValues)
}, 
true);

document.querySelector("#one-player-config").addEventListener("click", () => {
    setConfigPlayer2ToCPU(true);
}, true);

document.querySelector("#two-players-config").addEventListener("click", () => {
    if (configValues.numberPlayers === 1)
        setConfigPlayer2ToCPU(false);
    else
        setConfigPanel(configValues);
}, true);

document.querySelector(".config-rounds").addEventListener("keypress", (event) => {
    if (event.keyCode < 45 || event.keyCode > 57) {
        return  event.preventDefault();
    }
})

document.querySelectorAll(".button-select-avatar-config").
    forEach(element => {
        element.addEventListener("click", eventAvatarChange, true)
    });

document.querySelector(".movement-back-button").addEventListener("click", () => {historyBack()}, true);







function eventResetarBoardButton () {
    boardElementsRemove();
    arrayBoardClear();
    historyTurns = [];

    enabledBackTurnButton(false);
    enabledRestartGameButton(false);
}

function eventAvatarChange (evn)  {
    avatar1InitialIndex = avatars.findIndex(avatar => avatar.src === document.querySelector("#avatar-config-1").src);
    avatar2InitialIndex = avatars.findIndex(avatar => avatar.src === document.querySelector("#avatar-config-2").src);

    if (evn.srcElement.id === "previous-config-button-avatar-1") {
        if (avatar1InitialIndex === 1)
            avatar1InitialIndex = 12
        else
            avatar1InitialIndex--;
    };

    if (evn.srcElement.id === "next-config-button-avatar-1") {
        if (avatar1InitialIndex === 12)
            avatar1InitialIndex = 1
        else
            avatar1InitialIndex++;
    };

    if (evn.srcElement.id === "previous-config-button-avatar-2") {
        if (avatar2InitialIndex === 1)
            avatar2InitialIndex = 12
        else
            avatar2InitialIndex--;
    };

    if (evn.srcElement.id === "next-config-button-avatar-2") {
        if (avatar2InitialIndex === 12)
            avatar2InitialIndex = 1
        else
            avatar2InitialIndex++;
    };

    document.querySelector("#avatar-config-1").src = avatars[avatar1InitialIndex].src;
    document.querySelector("#avatar-config-2").src = avatars[avatar2InitialIndex].src;
}

function eventApplyConfigChange () {

    let isOk = true;

    document.querySelector("#user-name1-config").style.border = "none";
    document.querySelector("#user-name2-config").style.border = "none";
    document.querySelector(".config-rounds").style.border = "none";

    if (document.querySelector(".config-rounds").value < 1 || 
        document.querySelector(".config-rounds").value > 6 ||
        document.querySelector(".config-rounds").value === "") {
            document.querySelector(".config-rounds").style.border = "3px solid red"; 
            isOk = false;
    }

    if (document.querySelector("#user-name1-config").value === "") {
        document.querySelector("#user-name1-config").style.border = "3px solid red";
        isOk = false;
    }
    
    if (document.querySelector("#user-name2-config").value === "") {
        document.querySelector("#user-name2-config").style.border = "3px solid red";
        isOk = false;
    }

        
    if (!isOk) {
        return;
    }
    
    getConfigPanel(configValues);
    updateSetsPanel (configValues, sets);
    createRoundsIndicator(configValues.rounds);


    document.querySelector(".menu-dropdown-configuration").classList.add("hidden-menu-dropdown-configuration");

    setTimeout(() => {
        document.querySelector(".menu-dropdown-configuration").classList.remove("hidden-menu-dropdown-configuration");
    },100)

}

function eventElementSoundControlButton() {
    if (configValues.isSound) {
        document.querySelector(".sound-on-button").style.display = "none";
        document.querySelector(".sound-off-button").style.display = "block";
        configValues.isSound = false;
    } else {
        document.querySelector(".sound-off-button").style.display = "none";
        document.querySelector(".sound-on-button").style.display = "block";
        configValues.isSound = true;
    }
}



function eventStartDragElementToken(evn) {
    window.addEventListener("mousemove", eventDragElementToken, false);
    window.addEventListener("mouseup", eventDropElementToken, false)
    
    elementMovableToken.classList.remove("movable-token-animation");

    elementMovableToken.style.left = evn.pageX + "px";
    elementMovableToken.style.top = evn.pageY +"px";
    elementMovableToken.style.transform = "translate(-50%,-50%)";
}

function eventDragElementToken(evn) {
    elementMovableToken.style.left = evn.pageX + "px";
    elementMovableToken.style.top = evn.pageY + "px";
}

function eventDropElementToken() {
    
    const referenceX = elementbackGameBoard.getBoundingClientRect().left;
    const referenceWidth = elementbackGameBoard.getBoundingClientRect().width;
    const positionX = parseInt(window.getComputedStyle(elementMovableToken).left);
    
    window.removeEventListener("mousemove", eventDragElementToken, false);
    window.removeEventListener("mouseup", eventDropElementToken, false);
    elementMovableToken.removeEventListener("mousedown", eventStartDragElementToken, false);
 
           const column = Math.floor((positionX - referenceX) / (referenceWidth / 7)) + 1;
    
    if (positionX > referenceX && positionX < (referenceX + referenceWidth) && whereWillItFall(column) > 0) {
   
        elementMovableToken.style.visibility = "hidden";

        freeFallToken(column, whereWillItFall(column), elementGameBoard, tokenFallEnd);
    } else {
        prepareTokenPlayer();
    }

}



function resizeFreeFallToken() {
    
    const heightElemetGameBoard = parseInt(
        window.getComputedStyle(
            document.querySelector(".front-game-board")).
            getPropertyValue('height')
    );

    const tokenBoardFactor = (heightElemetGameBoard / 6) * 0.57;

    document.querySelectorAll(".token").forEach(element => {
        element.style.width = tokenBoardFactor.toString() + "px";
    });
  
}



const loadAvatars = (path) => {
    const images = [];

    for (i = 0; i <= 12; i++) {
        images.push(new Image());
        images[i].src = path + 'avatar_' + i + '.png';
    }

    return images;
}

const updateSetsPanel = (configValues, sets) => {
        document.querySelector('.sets-player-1 img').src = avatars[configValues.player1.avatarIndex].src;
        document.querySelector('.sets-player-2 img').src = avatars[configValues.player2.avatarIndex].src;

        document.querySelector('.sets-player-1 .player-name').innerText = configValues.player1.name;
        document.querySelector('.sets-player-2 .player-name').innerText = configValues.player2.name;

        if (configValues.player2.avatarIndex === 0){
            document.querySelector("#token-avatar-2").classList.replace("token-2", "token-black");
            algorithmatorSound.play();
        }
        else {
            document.querySelector("#token-avatar-2").classList.replace("token-black", "token-2");
        }

        setPunctuation(sets.hitsPlayer1, sets.hitsPlayer2);
        createRoundsIndicator(configValues.rounds);
}

const setConfigPanel = (configValues) => {
    document.querySelector("#user-name1-config").style.border = "none";
    document.querySelector("#user-name2-config").style.border = "none";
    document.querySelector(".config-rounds").style.border = "none";
    
    if (configValues.numberPlayers === 1) {
        document.querySelector("#one-player-config").checked = true;
        setConfigPlayer2ToCPU(true);
    } else {
        document.querySelector("#two-players-config").checked = true;
        setConfigPlayer2ToCPU(false);
    }

    document.querySelector(".config-rounds").value = configValues.rounds;

    document.querySelector("#avatar-config-1").src = avatars[configValues.player1.avatarIndex].src;
    document.querySelector("#avatar-config-2").src = avatars[configValues.player2.avatarIndex].src;
        
    document.querySelector("#user-name1-config").value = configValues.player1.name;
    document.querySelector("#user-name2-config").value = configValues.player2.name;

    
}

const getConfigPanel = (config) => {
 
    if (document.querySelector("#one-player-config").checked === true) 
        config.numberPlayers = 1;
    else
        config.numberPlayers = 2;

    config.rounds = +document.querySelector(".config-rounds").value;
        
    config.player1.avatarIndex = avatars.findIndex(avatar => avatar.src === document.querySelector("#avatar-config-1").src);
    config.player2.avatarIndex = avatars.findIndex(avatar => avatar.src === document.querySelector("#avatar-config-2").src);

    config.player1.name = document.querySelector("#user-name1-config").value.trim();
    config.player2.name = document.querySelector("#user-name2-config").value.trim();

}

const setConfigPlayer2ToCPU = (isOnePlayer) => {
 
    if (isOnePlayer) {
        document.querySelector("#avatar-config-2").src = avatars[0].src;
        document.querySelector("#previous-config-button-avatar-2").style.visibility = "hidden";
        document.querySelector("#next-config-button-avatar-2").style.visibility = "hidden";
        document.querySelector("#user-name2-config").disabled = true;
        document.querySelector("#user-name2-config").value = "Algorithmator";
        document.querySelector("#user-name2-config").style.border = "none";
    } else {
        document.querySelector("#avatar-config-2").src = avatars[1].src;
        document.querySelector("#previous-config-button-avatar-2").style.visibility = "visible";
        document.querySelector("#next-config-button-avatar-2").style.visibility = "visible";
        document.querySelector("#user-name2-config").disabled = false;
        document.querySelector("#user-name2-config").value = "Jugador 1";

    }

}



const prepareTokenPlayer = () => {

    let 
        referenceX, 
        referenceY,
        referenceWidth, 
        referenceHeight;

    borderPaintTurnSetsPanel();

    elementMovableToken.style.visibility = "visible";

    elementMovableToken.classList.remove("token-player-1");
    elementMovableToken.classList.remove("token-player-2");
    elementMovableToken.classList.remove("token-algorithmator-black");
   
    elementMovableToken.classList.add("movable-token-animation");

    if (playerOnGame === 1) {
        elementMovableToken.classList.add("token-player-1");

        referenceX = getToken1.getBoundingClientRect().left;
        referenceY = getToken1.getBoundingClientRect().top;
        referenceWidth = getToken1.getBoundingClientRect().width;
        referenceHeight = getToken1.getBoundingClientRect().height;
    } else {
        if (configValues.player2.avatarIndex === 0) {
            elementMovableToken.classList.add("token-algorithmator-black");
        }
        else
            elementMovableToken.classList.add("token-player-2");

        referenceX = getToken2.getBoundingClientRect().left;
        referenceY = getToken2.getBoundingClientRect().top;
        referenceWidth = getToken2.getBoundingClientRect().width;
        referenceHeight = getToken2.getBoundingClientRect().height;
    }


    elementMovableToken.style.left = `${referenceX + referenceWidth}px`;
    elementMovableToken.style.top = `${referenceY + (referenceHeight / 2)}px`;

    if (playerOnGame === 1 ||
        (configValues.player2.avatarIndex !== 0 && playerOnGame === 2))
        elementMovableToken.addEventListener("mousedown", eventStartDragElementToken, false);
    else    
        algorithmator();    

      
}

const borderPaintTurnSetsPanel = () => {

    document.querySelector('.sets-player-1').style.boxShadow = 'none';
    document.querySelector('.sets-player-2').style.boxShadow = 'none';

    if (playerOnGame === 1)
        document.querySelector('.sets-player-1').style.boxShadow = 'inset 0 0 0 5px #3cb5f2';
    
    if (playerOnGame === 2) {
        if (configValues.player2.avatarIndex === 0) {
            document.querySelector('.sets-player-2').style.boxShadow = 'inset 0 0 0 5px #101010';    
        }
        else
            document.querySelector('.sets-player-2').style.boxShadow = 'inset 0 0 0 5px #a92e2b';
    }
        

}

const freeFallToken = (column, row, elemetGameBoard, nextFuntion) => {

    const heightElemetBoard = parseInt(window.getComputedStyle(
        elemetGameBoard).getPropertyValue('height'));
  
    elementFallToken.classList.remove("token-player-1");
    elementFallToken.classList.remove("token-player-2");
    elementFallToken.classList.remove("token-algorithmator-black");

    if (playerOnGame === 1) {
        elementFallToken.classList.add("token-player-1");
    }
    if (playerOnGame === 2) {
        if (configValues.player2.avatarIndex === 0)
            elementFallToken.classList.add("token-algorithmator-black");
        else
            elementFallToken.classList.add("token-player-2");
    }
    
    const tokenSize = parseInt(window.getComputedStyle(
        elementFallToken).getPropertyValue('width'));

    elementFallToken.style.visibility = "visible";

    const leftTokenElement = ((column - 1) * (heightElemetBoard / 6)) + (heightElemetBoard / 12) - (tokenSize / 2) - 6; 
    elementFallToken.style.left = (leftTokenElement).toString() + "px";

    const posRowFloor = ((row - 1) * (heightElemetBoard / 6)) + (heightElemetBoard / 12) - (tokenSize / 2) - 6; 
    const posRowFloorpx = (posRowFloor ).toString() + "px";

    const reboundPosRowPX = (posRowFloor - (heightElemetBoard / 20)).toString() + "px";
    
    const cbMoveToken = (row, accelerationMode) => {
        elementFallToken.style.transition= accelerationMode;
        elementFallToken.style.top = row;
    }

    elementFallToken.addEventListener("transitionend", () => {
        tokenFallfloor();

        cbMoveToken(reboundPosRowPX, "top ease-out .1s");

        elementFallToken.addEventListener("transitionend", () => {
            cbMoveToken(posRowFloorpx, "top ease-out .1s");

            elementFallToken.addEventListener("transitionend", () => {

                const clon = elementFallToken.cloneNode(false);

                elementFallToken.replaceWith(clon);

                elementFallToken = document.querySelector("#fall-token");
                
                setTimeout(()=> {
                    nextFuntion(column, row);
                },0)

            }, true);
        
        }, true);

    }, true);

    cbMoveToken(posRowFloorpx, "top ease-in ." + row + "s");
}

const putTokenOnGameBoard = (column, row, elementGameBoard, tokenElementToCopy) => {
 
    heightElemetBoard = parseInt(window.getComputedStyle(elementGameBoard).getPropertyValue('height'));
    
    const tokenSize = parseInt(tokenElementToCopy.style.width); 

    const cloneToken = tokenElementToCopy.cloneNode(false);
    
    cloneToken.removeAttribute("style");

    cloneToken.style.width = tokenSize + "px";
    cloneToken.style.height = tokenSize + "px";

    cloneToken.style.visibility = "visible";

    cloneToken.className = "";

    if (playerOnGame === 1) {
        cloneToken.className = "copied-token token fall-token token-player-1";  
    } else {
        if (configValues.player2.avatarIndex === 0)
        cloneToken.className ="copied-token token fall-token token-algorithmator-black";
    else
        cloneToken.className ="copied-token token fall-token token-player-2";
    }

    cloneToken.style.left = 
        ((column - 1) * (heightElemetBoard / 6)) + (heightElemetBoard / 12) - (tokenSize / 2) - 5 + "px"; 
    
    const posRowFloor = ((row - 1) * (heightElemetBoard / 6)) + (heightElemetBoard / 12) - (tokenSize / 2) - 7; 
    
    cloneToken.style.top = posRowFloor.toString() + "px";

    cloneToken.id = "token-" + playerOnGame + "-" + column + "-" + row;

    elementbackGameBoard.insertBefore(cloneToken, elementGameBoard);

    elementFallToken.style.top = "0";
    elementFallToken.style.left = "0";
    elementFallToken.style.visibility = "hidden";

    setMark(column -1, row -1, playerOnGame);

    pushHistory(column, row, playerOnGame);

}

const gotFile = (data) => {
    let player = 1;

    if (data[3] === 16)
        player = 2

    if (data[0] === "c") {
        document.querySelector(
            `#token-${player}-${data[1] + 1}-${data[2] + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${data[1] + 1}-${(data[2] + 1) + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${data[1] + 1}-${(data[2] + 1) + 2}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${data[1] + 1}-${(data[2] + 1) + 3}`
        ).classList.add("token-got");
    }

    if (data[0] === "r") {

        document.querySelector(
            `#token-${player}-${data[1] + 1}-${data[2] + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 1}-${data[2] + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 2}-${data[2] + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 3}-${data[2] + 1}`
        ).classList.add("token-got");

    }

    if (data[0] === "dl") {

        document.querySelector(
            `#token-${player}-${data[1] + 1}-${data[2] + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 1}-${(data[2] + 1) + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 2}-${(data[2] + 1) + 2}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 3}-${(data[2] + 1) + 3}`
        ).classList.add("token-got");

    }

    if (data[0] === "dr") {

        document.querySelector(
            `#token-${player}-${data[1] + 1}-${data[2] + 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 1}-${(data[2] + 1) - 1}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 2}-${(data[2] + 1) - 2}`
        ).classList.add("token-got");

        document.querySelector(
            `#token-${player}-${(data[1] + 1) + 3}-${(data[2] + 1) - 3}`
        ).classList.add("token-got");

    }

}

const boardElementsRemove = () => {
    const elementsToClear = document.querySelectorAll(".back-game-board .copied-token");

    elementsToClear.forEach(
        elementToClear => 
            elementbackGameBoard.removeChild(elementToClear)
        );

}

const enabledHelpConfigurationButtons = (state) => {
    if (state) {
        document.querySelector(".menu-help").classList.remove("disabled-header-element");
        document.querySelector(".menu-configuration").classList.remove("disabled-header-element");
    }
    else {
        document.querySelector(".menu-help").classList.add("disabled-header-element");
        document.querySelector(".menu-configuration").classList.add("disabled-header-element");
    }
}

const enableButtonPlay = (state) => {
    if (state) {
        document.querySelector(".menu-play").classList.remove("disabled-header-element"); 
        document.querySelector(".menu-play").classList.add("menu-animation");
    }
    else {
        document.querySelector(".menu-play").classList.add("disabled-header-element");
        document.querySelector(".menu-play").classList.remove("menu-animation"); 
    }
}

const enableButtonExit = (state) => {
    if (state) {
        document.querySelector(".menu-exit").classList.remove("disabled-header-element");
    }
    else {
        document.querySelector(".menu-exit").classList.add("disabled-header-element");
    }
}

const visibilityMovableToken = (state) => {
    if (state) {
        document.querySelector("#movable-token").style.visibility = "visible";
    } else {
        document.querySelector("#movable-token").style.visibility = "hidden";
    }

}

const showWinnerModal = (state, type, avatarWinner, nameWinner) => {

    if (state) {
        elementModal.classList.replace("modal-hidden", "modal-visible");
        elementWinnerModalContent.classList.replace("modal-hidden", "modal-visible");

        elementWinnerAvatar12Modal.src = avatarWinner;

        elementWinnerAvatar2Modal.src = avatars[configValues.player2.avatarIndex].src;
        elementWinnerAvatar2Modal.classList.add("winner-avatar-player-2-hidden");

        if (type === 0) {
            document.querySelector(".trophy-left").classList.add("trofhy-left-righ-hidden");
            document.querySelector(".trophy-right").classList.add("trofhy-left-righ-hidden");

            document.querySelector(".winner-message").innerText = "PUNTO";

            document.querySelector(".button-next-round").style.display = "inline";
        }

        if (type === 1) {

            elementWinnerNameModal.innerHTML = nameWinner;

            document.querySelector(".trophy-left").classList.add("trofhy-left-righ-hidden");
            document.querySelector(".trophy-right").classList.add("trofhy-left-righ-hidden");

            document.querySelector(".winner-message").innerText = "¡EMPATE!";

            document.querySelector(".button-next-round").style.display = "inline";

            nameWinner = "";
        }

        if (type === 2) {
            document.querySelector(".trophy-left").classList.remove("trofhy-left-righ-hidden");
            document.querySelector(".trophy-right").classList.remove("trofhy-left-righ-hidden");

            document.querySelector(".winner-message").innerText = "¡GANA!";

            document.querySelector(".button-next-round").style.display = "none";
        }

        elementWinnerNameModal.innerHTML = nameWinner;

    } else {
        elementModal.classList.replace("modal-visible", "modal-hidden");
        elementWinnerModalContent.classList.replace("modal-visible", "modal-hidden");
    }
}

const enabledRestartGameButton = (state) => {
    if (state) {
        document.querySelector(".restart-game-button").classList.remove("disabled-header-element");
    }
    else {
        document.querySelector(".restart-game-button").classList.add("disabled-header-element");
    }
}

const enabledBackTurnButton = (state) => {
    if (state) {
        document.querySelector(".movement-back-button").classList.remove("disabled-header-element");
    }
    else {
        document.querySelector(".movement-back-button").classList.add("disabled-header-element");
    }
}

const tokenRemoveOfBoard = (player, column, row) => {
    elementbackGameBoard.removeChild(
        document.querySelector(`#token-${player}-${column}-${row}`));
}

const setPunctuation = (player1, player2) => {
    document.querySelector("#points-player1 span").innerText = player1;
    document.querySelector("#points-player2 span").innerText = player2;
}

const withoutPlayersOnGame = () => {
    visibilityMovableToken(false);

    document.querySelector('.sets-player-1').style.boxShadow = 'none';
    document.querySelector('.sets-player-2').style.boxShadow = 'none';
}

const createRoundsIndicator = (number) => {
 
    const elementsToRemove = document.querySelectorAll(".round-number-indicator");

    elementsToRemove.forEach (elementToRemove => {
        if (elementToRemove.id === "player1-round-indicator-1" ||
            elementToRemove.id === "player2-round-indicator-1") {
            
            elementToRemove.classList.remove("round-number-indicator-set");
        }else {
            elementToRemove.remove();
        };
    });
    
 
    for (let i = 1; i <= number - 1; i++) {
        const elementClone1 = document.querySelector("#player1-round-indicator-1").cloneNode(false);
        const elementClone2 = document.querySelector("#player2-round-indicator-1").cloneNode(false);
        
        elementClone1.classList.remove("round-number-indicator-set");
        elementClone2.classList.remove("round-number-indicator-set");
        
        elementClone1.removeAttribute("id");
        elementClone2.removeAttribute("id");
        elementClone1.setAttribute("id", "player1-round-indicator-" + (i + 1));
        elementClone2.setAttribute("id", "player2-round-indicator-" + (i + 1));
        elementClone1.innerText = i + 1;
        elementClone2.innerText = i + 1;

        document.querySelector(".rounds-indicators-player1").appendChild(elementClone1);
        document.querySelector(".rounds-indicators-player2").appendChild(elementClone2);
    }
}

const updateSetsRoundIndicator = (sets) => {
    if (sets.hitsPlayer1 > 0)
        document.querySelector("#player1-round-indicator-" + sets.hitsPlayer1).classList.add("round-number-indicator-set");
    
    if (sets.hitsPlayer2 > 0)
        document.querySelector("#player2-round-indicator-" + sets.hitsPlayer2).classList.add("round-number-indicator-set");
}

const ghostlyMovement = (column) => {
    
    const refXBlackToken = parseInt(elementGameBoard.getBoundingClientRect().left);
    const refYBlackToken = parseInt(elementGameBoard.getBoundingClientRect().top);
    const heightElemetBoard = parseInt(window.getComputedStyle(
        elementGameBoard).getPropertyValue('height'));
    
    const tokenSize = parseInt(window.getComputedStyle(
        elementFallToken).getPropertyValue('width'));
      

    let posYBlackToken = refYBlackToken - (tokenSize / 2);
    let posXBlackToken = refXBlackToken + ((column - 1) * (heightElemetBoard / 6)) + (heightElemetBoard / 12) - (tokenSize / 2) - 5; 
    
    elementMovableToken.classList.remove("movable-token-animation");
    elementMovableToken.style.transform = "none";  
    elementMovableToken.style.transition = "top 1.2s, left 1.2s";
    
    elementMovableToken.style.left = Math.floor(posXBlackToken).toString() + "px";
    elementMovableToken.style.top = posYBlackToken + "px";
    
    elementMovableToken.addEventListener("transitionend", endTransitionBlackToken);

    function endTransitionBlackToken () {
        elementMovableToken.style.visibility = "hidden";
        elementMovableToken.style.transition = "none";
        freeFallToken (column, whereWillItFall(column), elementGameBoard, tokenFallEnd);

        elementMovableToken.removeEventListener("transitionend", endTransitionBlackToken);
    }
}






