const sets = {
    roundOnGame: 1,
    hitsPlayer1: 0,
    hitsPlayer2: 0
}

let configValues = {
    numberPlayers: 2,
    rounds: 3,
    isSound: true,

    player1: {
        name: 'Jugador 1',
        avatarIndex: 1
    },
    player2: {
        name: 'Jugador 2',
        avatarIndex: 7
    }    
}

let historyTurns = [];

let playerOnGame = 1;


let arrayBoard = [];



const soundTick = new Audio('sounds/golpe.mp3');
const soundLinea = new Audio('sounds/linea.mp3');
const soundVictory = new Audio('sounds/victory.mp3');
const tie = new Audio('sounds/empate.mp3');
const algorithmatorSound = new Audio('sounds/algorithmator.mp3');



const initializeGame  = () => {
    playerOnGame = 1;

    historyTurns = [];
    arrayBoardClear();

    boardElementsRemove();

    withoutPlayersOnGame();

    enabledHelpConfigurationButtons(true);
    enableButtonPlay(true);
    enableButtonExit(false);

    enabledRestartGameButton(false);
    enabledBackTurnButton(false);

    soundTick.load();
    soundLinea.load();
    soundVictory.load();
} 

const playGame = () => {
    sets.hitsPlayer1 = 0;
    sets.hitsPlayer2 = 0;
    setPunctuation(sets.hitsPlayer1, sets.hitsPlayer2);
    createRoundsIndicator(configValues.rounds);

    enabledHelpConfigurationButtons(false);
    enableButtonPlay(false);
    enableButtonExit(true);

    prepareTokenPlayer();

}





const arrayBoardCreate = () => {
    for (let i = 0; i < 7; i++) {
        arrayBoard.push([]);
        for (let j = 0; j < 6; j++)
            arrayBoard[i].push(0);
    };
}

const arrayBoardClear = () => {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 6; j++)
            arrayBoard[i][j] = 0;
    };
}

const whereWillItFall = (column) => {

    column--;

    const row = arrayBoard[column].findIndex(value => value !== 0);

    if (row === -1) {
        return 6;
    }
    
    return row;
}

const setMark = (column, row, playerOnGame) => {
    arrayBoard[column][row] = playerOnGame;

} 

const pushHistory = (column, row, playerOnGame) => {
    historyTurns.push({
        player: playerOnGame,
        column,
        row
    })

    if (historyTurns.length > 0) {
        if (configValues.player2.avatarIndex !== 0) {
            enabledBackTurnButton(true);
            enabledRestartGameButton(true);
        }
    }


}

const historyBack = () => {
    removeTokenOfBoard = historyTurns.pop();

    tokenRemoveOfBoard(
        removeTokenOfBoard.player,
        removeTokenOfBoard.column,
        removeTokenOfBoard.row 
    )

    arrayBoard[removeTokenOfBoard.column - 1][removeTokenOfBoard.row - 1] = 0

    playerOnGame = removeTokenOfBoard.player;

    prepareTokenPlayer()

    if (historyTurns.length === 0) {
        enabledBackTurnButton(false);
        enabledRestartGameButton(false);
    }
}

function tokenFallfloor() {
    if (configValues.isSound) soundTick.play();
}

function tokenFallEnd(column, row) {
    putTokenOnGameBoard(column, row, elementGameBoard,elementMovableToken);
    tokenIsSet();
}

const checkLines = () => {
 
    let result = 0;
    
    // Itera bloque vertical
    for (let k = 0; k < 3; k++) {

        // Itera bloque horizontal
        for (let j = 0; j < 4; j++) {

            // Test columnas
            for (let i = 0; i < 4; i++) {
                result = 
                    arrayBoard[i + j][k] *
                    arrayBoard[i + j][k + 1] *
                    arrayBoard[i + j][k + 2] *
                    arrayBoard[i + j][k + 3];

                if (result === 1 || result === 16) {
                    return ["c", j + i, k, result];
                }
            }

            // Test filas
            for (let i = 0; i < 4; i++) {
                result = 
                    arrayBoard[j][i + k] *
                    arrayBoard[1 + j][i + k] *
                    arrayBoard[2 + j][i + k] *
                    arrayBoard[3 + j][i + k] ;

                if (result === 1 || result === 16) {
                    return ["r", j, k + i, result];
                }
            }

            // Test diagonal derecha
            result =
                arrayBoard [3 + j][k] *
                arrayBoard [2 + j][k + 1] *
                arrayBoard [1 + j][k + 2] *
                arrayBoard [j][k + 3];

            if (result === 1 || result === 16) {
                return ["dr", j, k + 3, result];
            }

            // Test diagonal izquierda
            result =
                arrayBoard [j][k] *
                arrayBoard [1 + j][k + 1] *
                arrayBoard [2 + j][k + 2] *
                arrayBoard [3 + j][k + 3];

            if (result === 1 || result === 16) {
                return ["dl", j, k, result];
            }
        
        }

    }

}

function tokenIsSet() {
     if (checkLines() !== undefined) {
        
        if (playerOnGame === 1)
            sets.hitsPlayer1++;
        else   
            sets.hitsPlayer2++;

        gotFile(checkLines());

        if (sets.hitsPlayer1 !== configValues.rounds &&
            sets.hitsPlayer2 !== configValues.rounds){
        
            if (configValues.isSound)  soundLinea.play();

        }

        showTurnWinner();
        
    } else {   

        if (playerOnGame === 1){
            playerOnGame = 2;
        }
        else {
            playerOnGame = 1;
        }
        prepareTokenPlayer();

        if (historyTurns.length === 42) {
                tie.play();
                showWinnerModal(
                    true, 1,
                    avatars[configValues.player1.avatarIndex].src,
                    configValues.player1.name
                )
        }
    
    }



}

const showTurnWinner = () => {
    let typeWinner = 0;

    setPunctuation(sets.hitsPlayer1, sets.hitsPlayer2)
    updateSetsRoundIndicator(sets);

    if (sets.hitsPlayer1 === configValues.rounds ||
        sets.hitsPlayer2 === configValues.rounds) {
            typeWinner = 2;
 
            if  (configValues.isSound) soundVictory.play();
    }

    setTimeout( () => {
        if (playerOnGame === 1) {
            showWinnerModal(
                true, typeWinner, 
                avatars[configValues.player1.avatarIndex].src,
                configValues.player1.name
            )
        } else {
            showWinnerModal(
                true, typeWinner,
                avatars[configValues.player2.avatarIndex].src,
                configValues.player2.name
            )
        }
    }, 600)
}

const buttonNextRound = () => {
    historyTurns = [];
    arrayBoardClear();

    showWinnerModal(false);

    boardElementsRemove();

    prepareTokenPlayer();

    enabledRestartGameButton(false);
    enabledBackTurnButton(false);

    soundTick.load();
}

const buttonFinishRound = () => {
    showWinnerModal(false);

    initializeGame();
}

const buttonExit = () => {
    showWinnerModal(false);

    initializeGame();
}

const algorithmator = () => {
    // ... //
    
    let selectedColumn;
    do {
        selectedColumn = Math.floor(Math.random() * (8 - 1) + 1)
    }while(whereWillItFall(selectedColumn) === 0)
    
    setTimeout(()=> {
        ghostlyMovement(selectedColumn);
    }, 1500);
}


arrayBoardCreate();
avatars = loadAvatars('images/avatars/');






