import React, {Component} from "react";
//import {snackbarStatusMessage,snackbarInvalid} from '../../engine/snackBars/snackBar.js';
import "./Game-Container.css";
import DominoLogo from "../../domino.png";
//import DominoBox from "../../‏‏domino-box.JPG";
import Board from "../Board/Board";
import Deck from "../Deck/Deck";

const notificationConst = {
    PRE_GAME_STATUS : 'preGameStatus',
    INVALID_MOVE : 'invalidMove',
    NEW_COLOR : 'newColor'
}

const playerStatusConst = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    FINISHED_CARDS: 'finishedCards',
    SPECTATOR: 'spectator'
};

class GameContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            selectedBrick: { numbers: [],
                             status: "" },
            isActive: false,
            statusMessage: "",
            gameStatus: null,
            gameSummery: null,
            playerStatus: props.playerStatus,
        };

        this.getGameInfo = this.getGameInfo.bind(this);
        this.initGame = this.initGame.bind(this);
        this.getGameStatus = this.getGameStatus.bind(this);
        //this.renderTablePackTop = this.renderTablePackTop.bind(this);
        this.renderMyHand = this.renderMyHand.bind(this);
        this.renderOpponentHand = this.renderOpponentHand.bind(this);
        this.renderStatistics = this.renderStatistics.bind(this);
        this.renderGame = this.renderGame.bind(this);
        this.renderGameBoard = this.renderGameBoard.bind(this);
        this.renderForSpectator = this.renderForSpectator.bind(this);
        this.notificationManager = this.notificationManager.bind(this);
        this.renderEndGamePopUp = this.renderEndGamePopUp.bind(this);
        this.getGameSummery = this.getGameSummery.bind(this);

        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleClickedBrick = this.handleClickedBrick.bind(this);
        this.handleDrawClick = this.handleDrawClick.bind(this);
    }

    componentWillMount(){
        this.getGameInfo();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    render() {
        return (
            <div className={"game-Container"}>
                {<img className={"logo"} src={DominoLogo}></img>}
                {this.state.playerStatus !== playerStatusConst.PLAYING ? 
                <button className={"util btn"} 
                        id={"leaveBtn"}
                        value={this.props.gameName} 
                        onClick={() => this.props.leaveGameHandler(this.props.gameName)}></button> : null}
                {this.state.isActive === true || this.state.gameSummery !== null ? this.renderGame() : null}
            </div>
        )
    }

//----------------------------------------------------RENDERERS---------------------------------------------------------

    renderGame(){
        return(
            <div className={"gameBoard-container"}>
                {/*this.renderStatistics()*/}
                {/*this.renderSpectatorList()*/}
                <div className={"theGame"}>
                    {/*this.renderChooseColorButton()*/}
                    {this.renderGameBoard()}
                    {this.renderTheDeck()}
                    {
                    <div className={"playersContainer"}>
                        {this.state.playerStatus !== playerStatusConst.SPECTATOR ? this.renderMyHand() : null}
                        {this.state.playerStatus !== playerStatusConst.SPECTATOR ? this.state.players.map(this.renderOpponentHand) : null }
                        {/*this.state.playerStatus === playerStatusConst.SPECTATOR ? this.state.players.map(this.renderForSpectator) : null */}
                    </div>}
            </div>
                {this.renderEndGamePopUp()}
            </div>
        )
    }

    renderTheDeck() {
        return (
            <div className="draw-buttons">
                <div className="draw">
                    {this.state.isPileEmpty ? <p>No more bricks!</p> : null}
                    <button className="my-button" 
                            onClick={this.handleDrawClick}
                            status={this.state.isLeftMoves}>Draw
                    </button>
                </div>
                <div>
                    <button className="my-button" 
                            onClick = {this.handleUndoClick}>Undo
                    </button>
                </div>
            </div>
        )
    }

    renderGameBoard() {
        const myBoard = <Board 
                        //isTimerStarted={this.state.isTimerStarted}
                        myBoard={this.state.gameStatus.board}
                        //status2={this.state.isGameEnded}
                        //handleDrop={this.handleDrop}
                        />
        return (
            <div className="domino-game">
                    <div className="body">
                        <div className="board-container">
                            {myBoard}
                        </div>
                        <div className="right-nav">
                            {/*<GameTimer isTimerStarted={this.state.isTimerStarted} />*/}
                            {/*<Control func={this.handleGame}/>*/}
                            {/*<div className="draw">
                                {this.state.isPileEmpty ? <p>No more bricks!</p> : null}
                                <button className="my-button" 
                                    onClick={this.handleDrawClick}
                                    status={this.state.isLeftMoves}>Draw</button>
                            </div>
                            <div>
                                <button className="my-button" onClick = {this.handleUndoClick}>Undo</button>
                            </div>*/}
                            {/* myDeck */}
                            <br></br>
                            {/*this.state.isGameStarted ? myDeck2 : null*/}
                        </div>
                    </div>
                    {this.state.isCheckEndGame ? this.checkEndGame() : null}
                    {this.state.isGameEnded ? myPopup : null}
                </div>
        )
    }

    renderMyHand() {
        const playerIndex = this.state.players.indexOf(this.props.userName);
        const playerHand = this.state.gameStatus.players[playerIndex].Hand;
        const myHand = <Deck 
                        handleClickedBrick={this.handleClickedBrick} 
                        handleMouseOver={this.handleMouseOver}
                        handleMouseOut={this.handleMouseOut}
                        myDeck={playerHand} 
                        selectedBrick={this.state.selectedBrick}
                        />
        return (
            <div className="right-nav">
                {myHand}
            </div>
        )
    }

    renderOpponentHand(playerName, index) {
        if (playerName !== this.props.userName) {
            const playersHand = this.state.gameStatus.players[index].Hand;
            const opponentContainer = this.calcPlayerContainerName(playerName);
            const opponentDisplay = playersHand.map((brick, index) =>
                <img src="https://thumbs.dreamstime.com/z/domino-box-game-13132675.jpg" className={"opponent-brick"} key={brick}/>);
            return (<div className={opponentContainer}>{opponentDisplay}
                        <div className={"userName"}>{playerName}
                        </div>
                    </div>)
        }
        return null;
    }

    renderStatistics() {
        return (
            <div id="statistics-Container">
                <p>Game length: {this.state.gameStatus.currentTimer}</p>
                <p>Current Player: {this.state.gameStatus.currentPlayer}</p>
                {this.state.playerStatus !== playerStatusConst.SPECTATOR ? <p>Average turn time: {this.state.gameStatus.avgTime}</p> : null}
                {this.state.playerStatus !== playerStatusConst.SPECTATOR ? <p>Last card: {this.state.gameStatus.lastCard}</p> : null}
            </div> )
    }


    renderSpectatorList() {
        return(
            <div id = "spectatorList-container">
                <h3>spectators:</h3>
                {this.state.gameStatus.spectators.map((user,index) => <div className={"spectator"} key={index}>{user}</div>)}
            </div>
        )
    }

    renderForSpectator(playerName,index) {
        const playersHand = this.state.gameStatus.playersCards[index];
        const cardsContainer = this.calcPlayerContainerName(playerName);
        const cardsDisplay = playersHand.map((cardId) => {
            const cardIdArr = cardId.split('-');
            return <img src = {`/resources/${cardIdArr[1]}${cardIdArr[0]}.png`} className = {"playerCard"} id = {cardId} key={cardId}/>;
        });
        return (<div className={cardsContainer}>{cardsDisplay}<div className={"userName"}>{playerName}</div></div>)
    }


    renderEndGamePopUp() {
        if(this.state.gameStatus && this.state.isActive === false){
            return (
                <div className = 'animate'>
                    <div className = 'popupContainer endGame'>
                        <h1>Game Summery</h1>
                        <h2>Players Rank</h2>
                        <p>Winner: {this.state.gameSummery.playersRank[0]}</p>
                        {this.state.gameSummery.playersRank.map((player,index)=>(index !== 0 ? <p key={index+1}>{index+1}: {player}</p> : null))}
                        <h2>Statistics</h2>
                        <p>Length: {this.state.gameSummery.totalTime}</p>
                        <p>Turns: {this.state.gameSummery.totalTurns}</p>
                        {this.state.players.map((player,i)=><p>{player} : last card = {this.state.gameSummery.playersLastCard[i]}, avg time = {this.state.gameSummery.playersAvgTime[i]}</p>)}
                    </div>
                </div>)
        } else {
            return null;
        }
    }


//----------------------------------------------------HANDLERS----------------------------------------------------------

    handleClickedBrick(brick) {
        fetch("/games/isLegalMove", {
            method: "POST",
            body: JSON.stringify({gameName: this.props.gameName,
                                  userName: this.props.userName,
                                  brick: brick}),
            credentials: "include"
        })
        .then(response => {
            if (!response.ok) {
                //need to implement:
                //Not valid move/ Not Your Turn/ you're not a player
                console.log(">>>>>>>>> Error: " + response);
                throw response;
            }
            console.log(">>>>>>>> OK! " + response);
            fetch("/games/addBrick", {
                method: "POST",
                body: JSON.stringify({gameName: this.props.gameName,
                                      userName: this.props.userName,
                                      brick: brick}),
                credentials: "include"
            })
            .then(response => {
                console.log("after addBrick: ", response)})
        })
    }

    handleMouseOver(brick) {
        fetch("/games/isLegalMove", {
            method: "POST",
            body: JSON.stringify({gameName: this.props.gameName,
                                  userName: this.props.userName,
                                  brick: brick}),
            credentials: "include"
        })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                this.setState(() => {
                    return {selectedBrick: {numbers: brick,
                                            status: "invalid"}
                    }
                })
            }
            else {
                this.setState(() => {
                    return {selectedBrick: {numbers: brick,
                                            status: "valid"}
                    }
                })
            }
        })
    }
       

    handleMouseOut() { 
        this.setState(() => {
            return {selectedBrick: {numbers: [],
                                    status: "neutral"}
            }
        })
    }

    handleDrawClick() {
        const playerIndex = this.state.players.indexOf(playerName);
        const myHand = this.state.gameStatus.players[playerIndex].Hand;
        if(myHand.length === 0) {
            //no more cards
        }
        else {
            fetch("/games/isLegalDraw", {
                method: "POST",
                body: JSON.stringify({gameName: this.props.gameName,
                                      userName: this.props.userName}),
                credentials: "include"
            })
            .then(response => {
                if(!response.ok) {
                    //error to handle
                }
                else {
                    fetch("/games/executeADraw", {
                        method: "POST",
                        body: JSON.stringify({gameName: this.props.gameName}),
                        credentials: "include"
                    })
                }
            })
        }
    }

//--------------------------------------------------GAME-STATUS---------------------------------------------------------

    getGameInfo() {
        return fetch("/games/gameInfo", {
            method: "POST",
            body: JSON.stringify({gameName: this.props.gameName}),
            credentials: "include"
        })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                throw response;
            }
            return response.json();
        })
        .then(gameInfo => {
            const updatedStatusMessage = this.createStatusMessage(gameInfo);
            if(updatedStatusMessage !== this.state.statusMessage){
                this.notificationManager(updatedStatusMessage,notificationConst.PRE_GAME_STATUS);
            }
            this.setState(() => ({
                players: gameInfo.players,
                statusMessage: updatedStatusMessage
            }));
            if(!gameInfo.isActive){
                this.timeoutId = setTimeout(this.getGameInfo, 200);
            } else {
                this.initGame();
            }
        })
        .catch(err => {
            throw err
        });
    }

    initGame() {
        return fetch("/games/initGame", {
            method: "POST",
            body: JSON.stringify({
                gameName: this.props.gameName,
                players: this.state.players
            }),
            credentials: "include"
        })
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            if(this.state.playerStatus === playerStatusConst.WAITING){
                this.setState(() => ({playerStatus : playerStatusConst.PLAYING}));
            }
            this.getGameStatus();
        })
        .catch(err => {
            throw err
        });
    }

    getGameStatus() {
        return fetch("/games/gameStatus", {
            method: "POST",
            body: JSON.stringify({
                gameName: this.props.gameName,
                userName: this.props.userName
            }),
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(updatedGameStatus => {
                let updatedPlayerStatus;
                //added
                updatedPlayerStatus = this.state.playerStatus;
                if (updatedGameStatus.isActive === true) {
                    this.timeoutId = setTimeout(this.getGameStatus, 1000);
                }
/*
                if(updatedGameStatus.playersRank.includes(this.props.userName) && this.state.playerStatus !== playerStatusConst.SPECTATOR){
                    updatedPlayerStatus = playerStatusConst.FINISHED_CARDS;
                } else {
                    updatedPlayerStatus = this.state.playerStatus;
                }

                if (updatedGameStatus.isActive === true) {
                    this.timeoutId = setTimeout(this.getGameStatus, 1000);
                } else {
                    if(this.state.playerStatus !== playerStatusConst.SPECTATOR){
                        updatedPlayerStatus = playerStatusConst.FINISHED_CARDS;
                    }
                    this.getGameSummery();
                }
*/
                this.setState(() => ({
                    isActive: updatedGameStatus.isActive,
                    gameStatus: updatedGameStatus,
                    playerStatus: updatedPlayerStatus
                }));
            })
            .catch(err => {
                throw err
            });
    }
    getGameSummery() {
        console.log("in get gameSummery");
        fetch("/games/gameSummery", {
            method: "POST",
            body: JSON.stringify({gameName: this.props.gameName}),
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(gameSummery => {
                this.setState(() => ({
                    isActive: false,
                    gameSummery: gameSummery
                }));
            })
            .catch(err => {
                throw err
            });
    }

//----------------------------------------------------UTILITIES---------------------------------------------------------

    createStatusMessage(gameInfo) {
        const playersMissing = gameInfo.playersNum - gameInfo.players.length;

        if(gameInfo.isActive === true){
            return "game on!!!";
        } else if(playersMissing === 1 || (playersMissing === 2 && gameInfo.isCompPlay === true)){
            return "waiting for one more player";
        } else {
            return gameInfo.isCompPlay === true ? `waiting for ${playersMissing - 1} players` : `waiting for ${playersMissing} players`;
        }
    }

    calcPlayerContainerName(playerName) {
        let placeOnBoard;
        const playersNum = this.state.players.length;
        const playerIndex = this.state.players.indexOf(playerName);
        if(playersNum === 2) {
            placeOnBoard = playerIndex === 0 ? 1 : 3;
        }
        else if(playersNum === 3) {
            placeOnBoard = playerIndex === 1 ? 4 : playerIndex + 1;
        }
        return `player${placeOnBoard}-container`;
    }

    notificationManager(notification, notificationType) {
        switch (notificationType) {
            case notificationConst.PRE_GAME_STATUS:
                //snackbarStatusMessage(notification);
                break;
            case notificationConst.INVALID_MOVE:
                //snackbarInvalid(notification);
                break;
        }
    }
}

export default GameContainer;