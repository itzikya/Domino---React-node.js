class StatsTimer {
    constructor() {
        this.minutes = "00",
        this.seconds = "00"
        this.totalSeconds = 0;
        this.StartTimer = this.StartTimer.bind(this);
        this.StopTimer = this.StopTimer.bind(this);
        this.ClearTimerStats = this.ClearTimerStats.bind(this);
        this._pad = this._pad.bind(this);
    }

    _pad(val) {
        let valString = val + "";
        let res = "";
        
        if (valString.length < 2) { 
            res = "0" + valString;
        }
        else {
            res = valString;
        }

        return res;
    }

    StopTimer() {
        clearInterval(this.timer);
    }

    ClearTimerStats() {
        this.minutes = "00",
        this.seconds = "00"
        this.totalSeconds = 0;
    }

    StartTimer() {
        this.ClearTimerStats();
        let totalSeconds = 0;
        let tick = function() {
            this.totalSeconds++;
            totalSeconds++;
            this.seconds = this._pad(totalSeconds % 60);
            this.minutes = this._pad(parseInt(totalSeconds / 60));
        }.bind(this);

        this.timer = setInterval(tick, 1000);
    }
  
}

class Statistics {
    constructor() {
        this.numOfTurns = 0;                 // 9.1
        this.timeFromStartSeconds = 0;       // 9.2
        this.avgTimeOfTurnSeconds = 0;       // 9.3   -- TimeFromStart/numOfTurns
        this.numOfTileDraws = 0;             // 9.4
        this.sumOfHandWeight = 0;            // 9.5
        this.statsTimer = new StatsTimer();
        
        this.TurnStart = this.TurnStart.bind(this);
        this.TurnEnd = this.TurnEnd.bind(this);
        this.GetTimeString = this.GetTimeString.bind(this);
        this.Update = this.Update.bind(this);
        this._updateSumOfHandWeight = this._updateSumOfHandWeight.bind(this);
        this._updateAvgTimeOfTurn = this._updateAvgTimeOfTurn.bind(this);
        this._updateTime = this._updateTime.bind(this);
        this.copyCtr = this.copyCtr.bind(this);
    }

    copyCtr() {
        let res = new Statistics();
        res.numOfTurns = this.numOfTurns;               
        res.timeFromStartSeconds = this.timeFromStartSeconds;     
        res.avgTimeOfTurnSeconds = this.avgTimeOfTurnSeconds;     
        res.numOfTileDraws = this.numOfTileDraws;           
        res.sumOfHandWeight = this.sumOfHandWeight;     
        return res;     
    }

    TurnStart() {
        this.statsTimer.StartTimer();
    }

    TurnEnd() {
        this.statsTimer.StopTimer();
    }

    Update(playerHand, moveWasDraw) {
        if(moveWasDraw) {
            this.numOfTileDraws ++;
        }

        this.numOfTurns ++;
        this._updateSumOfHandWeight(playerHand);
        this._updateTime();
    }

    _updateSumOfHandWeight(hand) {
        let sum = 0;
        for(let i = 0 ; i < hand.length ; i++) {
            for(let j = 0 ; j <hand[i].length ; j++) {
                if(hand[i][j].occupied) {
                    sum += hand[i][j].brick[0] + hand[i][j].brick[1];
                }
            }
        }
        this.sumOfHandWeight = sum;
    }

    _updateTime() {
        this.timeFromStartSeconds += this.statsTimer.totalSeconds;
        this._updateAvgTimeOfTurn();
    }


    _updateAvgTimeOfTurn() {
        this.avgTimeOfTurnSeconds = 0;
        if(this.numOfTurns > 1) {      // weird bug when doing numOfTurn > 0 we will get NaN on avgTime
            this.avgTimeOfTurnSeconds = (this.timeFromStartSeconds / this.numOfTurns).toFixed(2);
        }
    }

    GetTimeString() {
        return `${this.timeFromStartSeconds/60}: ${this.timeFromStartSeconds %60}`;
    }
}

class History {
    constructor (num, gameStart, p1Deck, boardB, pd, board, pile, p1Stats) {
        this.numOfPlayers = this.deepClone(num);
        this.isGameStarted = this.deepClone(gameStart);
        this.player1Deck = this.deepClone(p1Deck);
        this.boardBricks = this.deepClone(boardB);
        this.playerDeck = this.deepClone(pd);
        this.myBoard = this.deepClone(board);
        this.myPile = this.deepClone(pile);
        this.player1Stats = p1Stats;
    }

    deepClone(x) {
        return JSON.parse(JSON.stringify(x));
    }
}

class Player
{
    constructor(i_ID, i_IsHuman)
    {
        this.id = i_ID;
        this.isHuman = i_IsHuman;
        this.Hand = [];
       // this.Stats = new Statistics();
        this.Stats = "Ido";
        this.UpdateStats = this.UpdateStats.bind(this);

    }

    UpdateStats(i_MoveWasDraw)
    {
        //this.Stats.Update(this.Hand, i_MoveWasDraw);
    }
}

let idNum = 0;

class Game {
    constructor(i_NumOfPlayers, i_PlayerIDArr, gameName) {
        this.GameID = idNum++;
        this.numOfPlayers = i_NumOfPlayers;
        this.isGameEnded = false;
        //this.players = i_NumOfPlayers;
        this.Players = [new Player(1,1)];
        this.gameName = gameName;
        this.myBoard = [];
        this.playerTurnID = this.Players[0];
        this.playerTurn = 0;
        this.Deck = [];
        this.isActive = true;

        this._initDeckAndHands = this._initDeckAndHands.bind(this);
        this._initPlayers = this._initPlayers.bind(this);
        this._isPlayerTurn = this._isPlayerTurn.bind(this);
        this._shuffle = this._shuffle.bind(this);
        this._nextTurn = this._nextTurn.bind(this);
        this._playerHasBrick = this._playerHasBrick.bind(this);
        this._checkEndGame = this._checkEndGame.bind(this);
        this.AddBrickToBoard = this.AddBrickToBoard.bind(this);
        this.IsLegalMove = this.IsLegalMove.bind(this);
        this.IsLegalDraw = this.IsLegalDraw.bind(this);
        this.GetGameState = this.GetGameState.bind(this);
        this.ExecuteADraw = this.ExecuteADraw.bind(this);
        this.getJSONgameSummery = this.getJSONgameSummery.bind(this);


        this._initPlayers(i_PlayerIDArr);
        this._initDeckAndHands();
    }

    _initPlayers(i_PlayerIDArr)
    {
        for(let i = 0; i < this.numOfPlayers; i++)
        {
            this.Players[i] = new Player(i_PlayerIDArr[i], true);
            console.log("on init inside loop: ", i_PlayerIDArr[i])
        }

        this.playerTurnID = this.Players[0].id;
        console.log("on init player turn: ", this.playerTurn);
    }

    _shuffle() 
    {
        for (let i = this.Deck.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [this.Deck[i], this.Deck[j]] = [this.Deck[j], this.Deck[i]];
        }

    }

    _initDeckAndHands()
    {
        this.Deck = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 2], 
        [2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [3, 4], [3, 5], 
        [3, 6], [4, 4], [4, 5], [4, 6], [5, 5], [5, 6], [6, 6],
        ];

        this._shuffle();

        for(let i = 0; i< this.numOfPlayers; i++)
        {
            for(let j = 0; j<6; j++)
            {
                this.Players[i].Hand.push(this.Deck.pop());
            }
        }
    }

    _isPlayerTurn(id)
    {
        return this.playerTurnID === id;
    }

    _nextTurn(moveWasDraw)
    {
        //this._checkEndGame();
        //this.Players[this.playerTurn].UpdateStats(moveWasDraw);
        //this.Players[this.playerTurn].Stats.TurnEnd();
        this.playerTurn = (++this.playerTurn) % this.numOfPlayers;
        this.playerTurnID = this.Players[this.playerTurn].id;
        //this.Players[this.playerTurn].Stats.TurnStart();

    }

    _checkEndGame() 
    {
        let currPlayer = this.playerTurn;
        let currPlayerID = this.playerTurnID;

        this.playerTurn =(this.playerTurn +1) % this.numOfPlayers;
        this.playerTurnID = this.Players[this.playerTurn].id;

        if(this.Players[this.playerTurn].Hand.length === 0) 
        {
           this.isGameEnded = true;
        }
        else if(this.Deck.length === 0 && this.IsLegalDraw(this.playerTurnID)) 
        {
            this.isGameEnded = true;
        }

        this.playerTurn = currPlayer;
        this.playerTurnID = currPlayerID;
    }

    _playerHasBrick(brick)
    {
        for (const tile of this.Players[this.playerTurn].Hand)
        {
           if(tile[0] === brick[0] && tile[1] === brick[1]) 
            {
                return true;
            }
        }

        return false;
    }

    IsLegalMove(brick, id) 
    {
        console.log("in IsLegalMove func in Game ", brick, id);
        console.log("this player id: ", id, "this turn id: ", this.playerTurnID);
        if(!this._isPlayerTurn(id))
        {
            return false;
        }
        
        console.log(this.myBoard);
        if(this.myBoard.length === 0) 
        {
           return true;
        }

        for(let i = 0 ; i < this.myBoard.length ; i++) 
        {
            for(let j = 0 ; j < this.myBoard[i].length ; j++) 
            {
                let currBrick = this.myBoard[i][j];
                if(currBrick.occupied) {

                    let row = currBrick.position.row;
                    let column = currBrick.position.column;
                    
                    if((currBrick.brick[0] === brick[1]) || (currBrick.brick[0]) === brick[0]) {
                        if(!((this.myBoard[row - 1]) && (this.myBoard[row - 1][column].occupied)) && currBrick.direction === "vertical") 
                        {
                            return true;
                        }
                        else if(!((this.myBoard[0][column + 1]) && (this.myBoard[row][column + 1].occupied)) && currBrick.direction === "horizontal" ) 
                        {
                            return true;
                        }
                        if(currBrick.brick[0] === currBrick.brick[1]) {
                            if(!((this.myBoard[row - 1]) && (this.myBoard[row - 1][column].occupied)) && currBrick.direction === "horizontal" ) 
                            {
                                return true;
                            }
                            else if(!((this.myBoard[row + 1]) && (this.myBoard[row + 1][column].occupied)) && currBrick.direction === "horizontal") 
                            {
                                return true;
                            }
                            else if(!((this.myBoard[0][column + 1]) && (this.myBoard[row][column + 1].occupied)) && currBrick.direction === "vertical") 
                            {
                                return true;
                            }
                            else if(!((this.myBoard[0][column - 1]) && (this.myBoard[row][column - 1].occupied)) && currBrick.direction === "vertical") 
                            {
                                return true;
                            }
                        }
                    }

                    if((currBrick.brick[1] == brick[0]) || (currBrick.brick[1] == brick[1])) 
                    {
                        if(!((this.myBoard[row + 1]) && (this.myBoard[row + 1][column].occupied)) && currBrick.direction === "vertical") 
                        {
                            return true;
                        }
                        else if(!((this.myBoard[0][column - 1]) && (this.myBoard[row][column - 1].occupied)) && currBrick.direction === "horizontal") 
                        {
                            return true;
                        }
                    }
                }   
            }
        }

        return false;
    }

    IsLegalDraw(id) {
        let canDrawTile = true;
        if(!this._isPlayerTurn(id)) {
            return false;
        }

        for (const tile of this.Players[this.playerTurnID].Hand) {
           if(this.IsLegalMove(tile)) {
                canDrawTile = false;
                break;
            }
        }

        return canDrawTile;
    }

    AddBrickToBoard(brick, id) 
    {
        let found = false;
        let currBrick = null;
        let row = null;
        let column = null;

        if(!this._isPlayerTurn(id) /*|| !this.IsLegalMove() /*|| !this._playerHasBrick(brick)*/)
        {
            console.log("in addbrick in first condition");
            return false;
        }
        console.log("in addbrick");
        let moveWasDraw = false;
        let myBoard = this.myBoard;
        let playersHand = this.Players[this.playerTurn].Hand;
        //maybe it's not good to declare it here
        let brickToInsert = {brick: brick,
                            direction: "vertical",
                            occupied: true,
                            position: {row: 0,
                                        column: 0}};
        /*if(!this.IsLegalMove(brick))
        {
            console.log("in addbrick in islegalmove");
            return;
        }*/
        
        //this.saveCurrentStateForHistory();
        //Zero Condition//
        if(myBoard.length === 0) 
        {
            console.log(">> Board 1st brick");
            console.log(brickToInsert);
            console.log("My board before");
            console.log(myBoard);
            myBoard.push([brickToInsert]);
            console.log("After");
            console.log(myBoard);
            playersHand = playersHand.filter((item) => item !== brick);
        }
        else 
        {
          
            for(let i = 0 ; i < myBoard.length ; i++) 
            {
                for(let j = 0 ; j < myBoard[i].length ; j++) 
                {
                    currBrick = myBoard[i][j];
                    
                    if(!found && currBrick.occupied) 
                    {
                        row = currBrick.position.row;
                        column = currBrick.position.column;

                        //First Condition//
                        if(currBrick.brick[0] === brick[1] && !found) 
                        {
                            if(!((myBoard[row - 1]) && (myBoard[row - 1][column].occupied)) && currBrick.direction === "vertical") 
                            {
                                if(!myBoard[row - 1]) {
                                    for(let i = 0 ; i < myBoard.length ; i++) 
                                    {
                                        for(let j = 0 ; j < myBoard[i].length ; j++) 
                                        {
                                            if(myBoard[i][j].occupied) 
                                            {
                                                myBoard[i][j].position.row++; //changing
                                            }
                                        } 
                                    } 

                                    let newLine = [];
                                    for(let i = 0 ; i < myBoard[0].length ; i++) 
                                    {
                                        newLine.push({occupied: false})
                                    }

                                    myBoard.unshift(newLine);
                                }
                                if(brick[0] === brick[1]) 
                                {
                                        brickToInsert.direction = "horizontal";
                                }
                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }

                                brickToInsert.position.column = currBrick.position.column;
                                brickToInsert.position.row = currBrick.position.row - 1;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);

                                found = true;
                            }

                            //Fifth Condition//
                            else if(!((myBoard[0][column + 1]) && (myBoard[row][column + 1].occupied)) && currBrick.direction === "horizontal") 
                            {
                                if(!myBoard[0][column + 1]) 
                                {
                                    for(let i = 0 ; i < myBoard.length ; i++) 
                                    {
                                        myBoard[i].push({occupied: false});
                                    } 
                                }
                                if(brick[0] === brick[1]) 
                                {
                                        brickToInsert.direction = "vertical";
                                }
                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }

                                brickToInsert.position.column = currBrick.position.column + 1;
                                brickToInsert.position.row = currBrick.position.row;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);
                                found = true;
                            }
                            
                            if(currBrick.brick[0] === currBrick.brick[1] && !found) 
                            {
                                if(!((myBoard[row - 1]) && (myBoard[row - 1][column].occupied)) && currBrick.direction === "horizontal") {
                                    if(!myBoard[row - 1]) 
                                    {
                                        for(let i = 0 ; i < myBoard.length ; i++) 
                                        {
                                            for(let j = 0 ; j < myBoard[i].length ; j++) 
                                            {
                                                if(myBoard[i][j].occupied) 
                                                {
                                                    myBoard[i][j].position.row++; //changing
                                                }
                                            } 
                                        } 
    
                                        let newLine = [];
                                        for(let i = 0 ; i < myBoard[0].length ; i++) 
                                        {
                                            newLine.push({occupied: false})
                                        }

                                        myBoard.unshift(newLine);
                                    }

                                    brickToInsert.direction = "vertical";
                                    brickToInsert.position.column = currBrick.position.column;
                                    brickToInsert.position.row = currBrick.position.row - 1;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
    
                                    found = true;
                                }
                                ///////////////////
                                else if(!((myBoard[row + 1]) && (myBoard[row + 1][column].occupied)) && currBrick.direction === "horizontal") 
                                {
                                    brickToInsert.brick = [brick[1], brick[0]];
                                    if(!myBoard[row + 1]) 
                                    {
                                        let newLine = [];
                                        for(let i = 0 ; i < myBoard[0].length ; i++) 
                                        {
                                            newLine.push({occupied: false})
                                        } 

                                        myBoard.push(newLine);
                                    }
                                    
                                    brickToInsert.direction = "vertical";
                                    brickToInsert.position.row = currBrick.position.row + 1;
                                    brickToInsert.position.column = currBrick.position.column;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
                                    
                                    found = true;
                                }


                                else if(!((myBoard[0][column + 1]) && (myBoard[row][column + 1].occupied)) && currBrick.direction === "vertical") 
                                {
                                    if(!myBoard[0][column + 1]) 
                                    {
                                        for(let i = 0 ; i < myBoard.length ; i++) 
                                        {
                                            myBoard[i].push({occupied: false});
                                        } 
                                    }

                                    brickToInsert.direction = "horizontal";
                                    brickToInsert.position.column = currBrick.position.column + 1;
                                    brickToInsert.position.row = currBrick.position.row;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
                                    found = true;
                                }
                                ////////////////////////////////
                                else if(!((myBoard[0][column - 1]) && (myBoard[row][column - 1].occupied)) && currBrick.direction === "vertical") 
                                {
                                    brickToInsert.brick = [brick[1], brick[0]];
                                    if(!myBoard[0][column - 1]) 
                                    {
                                        for(let i = 0 ; i < myBoard.length ; i++) 
                                        {
                                            myBoard[i].unshift({occupied: false});
                                            for(let j = 0 ; j < myBoard[i].length ; j++) 
                                            {
                                                if(myBoard[i][j].occupied) 
                                                {
                                                    myBoard[i][j].position.column++; //changing
                                                }
                                            } 
                                        } 
                                    }

                                    brickToInsert.direction = "horizontal";
                                    brickToInsert.position.row = currBrick.position.row;
                                    brickToInsert.position.column = currBrick.position.column - 1;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
                                    
                                    found = true;
                                }

                            }
                        }    
                            //Second Condition//
                        if(currBrick.brick[1] === brick[0] && !found) 
                        {
                            if(!((myBoard[row + 1]) && (myBoard[row + 1][column].occupied)) && currBrick.direction === "vertical") 
                            {
                                if(!myBoard[row + 1]) 
                                {
                                    let newLine = [];
                                    for(let i = 0 ; i < myBoard[0].length ; i++) 
                                    {
                                        newLine.push({occupied: false})
                                    } 

                                    myBoard.push(newLine);
                                }
                                if(brick[0] === brick[1]) 
                                {
                                        brickToInsert.direction = "horizontal";
                                }

                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }

                                brickToInsert.position.row = currBrick.position.row + 1;
                                brickToInsert.position.column = currBrick.position.column;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);
                                
                                found = true;
                            }
                            
                            //Sixth Condition//
                            else if(!((myBoard[0][column - 1]) && (myBoard[row][column - 1].occupied)) && currBrick.direction === "horizontal" && !found) 
                            {
                                if(!myBoard[0][column - 1]) 
                                {
                                    for(let i = 0 ; i < myBoard.length ; i++) 
                                    {
                                        myBoard[i].unshift({occupied: false});
                                        for(let j = 0 ; j < myBoard[i].length ; j++) 
                                        {
                                            if(myBoard[i][j].occupied) 
                                            {
                                                myBoard[i][j].position.column++; //changing
                                            }
                                        } 
                                    } 
                                }
                                if(brick[0] === brick[1]) 
                                {
                                        brickToInsert.direction = "vertical";
                                }
                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }
                                
                                brickToInsert.position.row = currBrick.position.row;
                                brickToInsert.position.column = currBrick.position.column - 1;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);
                                found = true;
                            }
                            if(currBrick.brick[0] === currBrick.brick[1] && !found) 
                            {
                                if(!((myBoard[row + 1]) && (myBoard[row + 1][column].occupied)) && currBrick.direction === "horizontal") 
                                {
                                    if(!myBoard[row + 1]) 
                                    {
                                        let newLine = [];
                                        for(let i = 0 ; i < myBoard[0].length ; i++) 
                                        {
                                            newLine.push({occupied: false})
                                        } 

                                        myBoard.push(newLine);
                                    }

                                    brickToInsert.direction = "vertical";
                                    brickToInsert.position.row = currBrick.position.row + 1;
                                    brickToInsert.position.column = currBrick.position.column;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
                                    found = true;
                                }
                                //////////////////////////////////////////////////////
                                else if(!((myBoard[row - 1]) && (myBoard[row - 1][column].occupied)) && currBrick.direction === "horizontal") 
                                {
                                    brickToInsert.brick = [brick[1], brick[0]];
                                    if(!myBoard[row - 1]) 
                                    {
                                        for(let i = 0 ; i < myBoard.length ; i++)
                                        {
                                            for(let j = 0 ; j < myBoard[i].length ; j++) 
                                            {
                                                if(myBoard[i][j].occupied) 
                                                {
                                                    myBoard[i][j].position.row++; //changing
                                                }
                                            } 
                                        } 
    
                                        let newLine = [];
                                        for(let i = 0 ; i < myBoard[0].length ; i++) 
                                        {
                                            newLine.push({occupied: false})
                                        }

                                        myBoard.unshift(newLine);
                                    }

                                    brickToInsert.direction = "vertical";
                                    brickToInsert.position.column = currBrick.position.column;
                                    brickToInsert.position.row = currBrick.position.row - 1;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
                                    found = true;
                                }
                                
                                else if(!((myBoard[0][column - 1]) && (myBoard[row][column - 1].occupied)) && currBrick.direction === "vertical") 
                                {
                                    if(!myBoard[0][column - 1]) 
                                    {
                                        for(let i = 0 ; i < myBoard.length ; i++) 
                                        {
                                            myBoard[i].unshift({occupied: false});
                                            for(let j = 0 ; j < myBoard[i].length ; j++) 
                                            {
                                                if(myBoard[i][j].occupied) 
                                                {
                                                    myBoard[i][j].position.column++; //changing
                                                }
                                            } 
                                        } 
                                    }

                                    brickToInsert.direction = "horizontal";
                                    brickToInsert.position.row = currBrick.position.row;
                                    brickToInsert.position.column = currBrick.position.column - 1;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
                                    
                                    found = true;
                                }
                                ////////////////////////////////
                                else if(!((myBoard[0][column + 1]) && (myBoard[row][column + 1].occupied)) && currBrick.direction === "vertical") 
                                {
                                    brickToInsert.brick = [brick[1], brick[0]];
                                    if(!myBoard[0][column + 1]) 
                                    {
                                        for(let i = 0 ; i < myBoard.length ; i++) 
                                        {
                                            myBoard[i].push({occupied: false});
                                        } 
                                    }

                                    brickToInsert.direction = "horizontal";
                                    brickToInsert.position.column = currBrick.position.column + 1;
                                    brickToInsert.position.row = currBrick.position.row;
                                    myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                    playersHand = playersHand.filter((item) => item !== brick);
                                    found = true;
                                }
                            }
                        }
                        
                        //Third Condition//
                        if(currBrick.brick[0] === brick[0] & !found) 
                        {
                            if(!((myBoard[row - 1]) && (myBoard[row - 1][column].occupied)) && currBrick.direction === "vertical") 
                            {
                                brickToInsert.brick = [brick[1], brick[0]];
                                if(!myBoard[row - 1]) 
                                {
                                    for(let i = 0 ; i < myBoard.length ; i++) 
                                    {
                                        for(let j = 0 ; j < myBoard[i].length ; j++) 
                                        {
                                            if(myBoard[i][j].occupied) 
                                            {
                                                myBoard[i][j].position.row++; //changing
                                            }
                                        } 
                                    } 

                                    let newLine = [];
                                    for(let i = 0 ; i < myBoard[0].length ; i++) 
                                    {
                                        newLine.push({occupied: false})
                                    }

                                    myBoard.unshift(newLine);
                                }
                                if(brick[0] === brick[1]) 
                                {
                                    brickToInsert.direction = "horizontal";
                                }
                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }
                                
                                brickToInsert.position.column = currBrick.position.column;
                                brickToInsert.position.row = currBrick.position.row - 1;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);
                                found = true;
                            }
                            
                            //Seventh Condition//
                            else if(!((myBoard[0][column + 1]) && (myBoard[row][column + 1].occupied)) && currBrick.direction === "horizontal" && !found) 
                            {
                                brickToInsert.brick = [brick[1], brick[0]];
                                if(!myBoard[0][column + 1]) 
                                {
                                    for(let i = 0 ; i < myBoard.length ; i++) 
                                    {
                                        myBoard[i].push({occupied: false});
                                    } 
                                }
                                if(brick[0] === brick[1]) 
                                {
                                    brickToInsert.direction = "vertical"; 
                                }
                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }
                                
                                brickToInsert.position.row = currBrick.position.row;
                                brickToInsert.position.column = currBrick.position.column + 1;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);
                                found = true;
                            }
                        }
                        
                        //Fourth Condition//
                        if(currBrick.brick[1] === brick[1] && !found) 
                        {
                            if(!((myBoard[row + 1]) && (myBoard[row + 1][column].occupied)) && currBrick.direction === "vertical") 
                            {
                                brickToInsert.brick = [brick[1], brick[0]];
                                if(!myBoard[row + 1]) {
                                    let newLine = [];
                                    for(let i = 0 ; i < myBoard[0].length ; i++) 
                                    {
                                        newLine.push({occupied: false})
                                    } 
                                    myBoard.push(newLine);
                                }
                                if(brick[0] === brick[1]) 
                                {
                                    brickToInsert.direction = "horizontal";
                                }
                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }
                                
                                brickToInsert.position.column = currBrick.position.column;
                                brickToInsert.position.row = currBrick.position.row + 1;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);
                                found = true;
                            }
                            
                            //Eighth Condition//
                            else if(!((myBoard[0][column - 1]) && (myBoard[row][column - 1].occupied)) && currBrick.direction === "horizontal" && !found) 
                            {
                                brickToInsert.brick = [brick[1], brick[0]];
                                if(!myBoard[0][column - 1]) 
                                {
                                    for(let i = 0 ; i < myBoard.length ; i++) 
                                    {
                                        myBoard[i].unshift({occupied: false});
                                        for(let j = 0 ; j < myBoard[i].length ; j++) 
                                        {
                                            if(myBoard[i][j].occupied) 
                                            {
                                                myBoard[i][j].position.column++; //changing
                                            }
                                        } 
                                    } 
                                }
                                if(brick[0] === brick[1]) 
                                {
                                    brickToInsert.direction = "vertical";
                                }
                                else 
                                {
                                    brickToInsert.direction = currBrick.direction;
                                }
                                
                                brickToInsert.position.row = currBrick.position.row;
                                brickToInsert.position.column = currBrick.position.column - 1;
                                myBoard[brickToInsert.position.row][brickToInsert.position.column] = brickToInsert;
                                playersHand = playersHand.filter((item) => item !== brick);
                                found = true;
                            }
                        } 
                    }
                }
            }
        }
        console.log("the board:", myBoard);
        console.log("the board brick:", myBoard[0][0].brick);
        this.myBoard = myBoard;
       
       this.Players[this.playerTurn].Hand = playersHand;
       console.log("player's hand: ", playersHand);
       this._nextTurn(moveWasDraw);
       //this.myBoard = [];
       // this._initPlayers();
        return (found);
    }

    ExecuteADraw()
    {
        let moveWasDraw = true;

        this.Players[this.playerTurn].Hand.push(this.Deck.pop);
        this._nextTurn(moveWasDraw);
        return false;
    }
    
    GetGameState(i_ID) {
        let listOfPlayers = [];
        let playerStats;
        let playerHand;
        console.log("in get game state")
        for(let i = 0; i < this.numOfPlayers; i++) {
            let id = this.Players[i].id;
            if(i_ID === id) {
                playerStats = this.Players[i].Stats;
            }

            let handSize = this.Players[i].Hand.length;
            let isHuman = this.Players[i].isHuman;
            listOfPlayers.push({id: id, isHuman: isHuman, handSize: handSize});
        }

        return {
            gameID: this.GameID,
            numOfPlayers: this.numOfPlayers,
            gameEnded: this.isGameEnded,
            listOfPlayers: listOfPlayers,
            players: this.Players,
            playerTurn: this.playerTurnID,
            deckSize: this.Deck.length,
            board: this.myBoard,
            //stats: playerStats,
            isActive: true
        }
    }

    getJSONgameSummery() {
        /*
        let playersLastCard = [];
        let playersAvgTime = [];

        if(this.timer.timerInterval){ clearInterval(this.timer.timerInterval); }

        for(let i = 0 ; i < this.players.length ; i++ ){

            playersAvgTime.push(this.players[i].getAverageTime().toFixed(2));
            playersLastCard.push(this.players[i].getLastCardCounter());

            if(!this.playersRank.includes(this.players[i].name)){
                this.playersRank.push(this.players[i].name);
            }
        }

        return {
            isActive: false,
            playersRank: this.playersRank,
            totalTurns: this.turnsManager.movesCounter,
            totalTime: this.timer.time,
            playersLastCard: playersLastCard,
            playersAvgTime: playersAvgTime
        };
        */
    }
}

function create(numPlayers, playersArr, gameName) { return new Game(numPlayers, playersArr, gameName); }

module.exports = {Game, create}

