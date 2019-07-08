import React, {Component} from "react";
//import {snackbarStatusMessage,snackbarInvalid} from '../../engine/snackBars/snackBar.js';
import "./Game-Container.css";
import DominoLogo from "../../domino.png";
import Board from "../Board/Board";
import Deck from "../Deck/Deck";

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        this.roomID = i_ID;
        this.gameActive = false;
        this.roomSize = i_Size;
        this.numOfPlayer = 1;
        this.numOfSpectator = 0;
        this.spectatorList = [];
        this.Admin = i_Admin;
        this.playerList =[i_Admin];
        this.Game = new DominoGame(this.numOfPlayer, this.playerList);
        this.Game = null;
        
        this.Update = this.Update.bind(this);
        this.RemovePlayer = this.RemovePlayer.bind(this);
        this.AddPlayer = this.AddPlayer.bind(this);
        this.AddSpectator = this.AddSpectator.bind(this);
        this.RemoveSpectator = this.RemoveSpectator.bind(this);
        this.GetRoomInfo =this.GetRoomInfo.bind(this);

        if(i_vsPC)
        {
            this.playerList.push("PC");
            this.numOfPlayer++;
            this.Update();
        }
    }

    Update()
    {
        if(this.numOfPlayer === this.roomSize)
        {
            this.Game = new DominoGame(this.numOfPlayer, this.playerList);
            this.gameActive = true;
        }
        else
        {
            this.gameActive = false;
        }
    }

    RemoveSpectator(i_Username)
    {
        const userIndex = this.spectatorList.findIndex((user) => {return user === i_Username});
        this.spectatorList.splice(userIndex,1);
        this.numOfSpectator--;
    }

    RemovePlayer(i_Username)
    {
        const userIndex = this.playerList.findIndex((user) => {return user === i_Username});
        this.playerList.splice(userIndex,1);
        this.numOfPlayer--;
    }

    AddPlayer(i_Username)
    {
        this.playerList.push(i_Username);
        this.numOfPlayer++;
        this.Update();
    }

    AddSpectator(i_Username)
    {
        this.spectatorList.push(i_Username);
        this.numOfSpectator++;
    }

    GetRoomInfo()
    {
        return({
        roomID: this.roomID, 
        numOfPlayer: this.numOfPlayer, 
        numOfSpectator: this.numOfSpectator, 
        roomSize: this.roomSize,
        playerList: this.playerList,
        admin: this.Admin,
        spectatorList: this.spectatorList,
        gameActive: this.gameActive
      });
    }

}