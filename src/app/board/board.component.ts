import { Component, OnInit } from '@angular/core';
import { WebSocketService } from "../services/web-socket.service";

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {

    boardSize: number = 3;
    boardArray: Array<number> = Array(this.boardSize).fill(0);
    board: Array<any> = [];
    showBoard: boolean = false;
    disableCells: boolean;

    move: string;
    opponentMove: string;

    errMsg: string;

    constructor(private webSocketService: WebSocketService) { }

    ngOnInit() {
        this.sendBoardSize();
        this.getPlayer();
        this.listenOpponentCellClick();
        this.listenGameResultEvent();
        this.disableCells = false;
    }

    sendBoardSize(): void {
        this.webSocketService.emit('boardSize', this.boardSize);
    }

    listenGameResultEvent(): void {
        this.webSocketService.listen('gameResult').subscribe((data: string) => {
            this.disableCells = true;
            if (data['winningCombination']) {
                let winningCells = data['winningCombination'];
                let color;
                let message;
                console.log(`Data: ${JSON.stringify(data)}`);
                if (data['status'] === 1) {
                    color = 'green';
                    message = 'You Win!';
                } else if (data['status'] === -1) {
                    color = 'firebrick';
                    message = 'You Loose!';
                }
                for (let i = 0; i < winningCells.length; i++) {
                    document.getElementById(winningCells[i]).style.background = color;
                }
                alert(message);
            }
            else {
                for (let i = 0; i < (this.boardSize * this.boardSize); i++) {
                    document.getElementById('' + i).style.background = 'grey';
                }
                alert('Tied!');
            }
        });
    }

    getPlayer(): void {
        this.webSocketService.listen('move').subscribe(data => {
            this.showBoard = true;
            this.move = data['move'];
            this.opponentMove = data['opponentMove'];
            console.log(`move: ${this.move}, opponentMove: ${this.opponentMove}`);
        });

        this.webSocketService.listen('errorJoining').subscribe((data: string) => {
            this.showBoard = false;
            this.errMsg = data;
            console.log(`Error Joining: ${this.errMsg}`);
        });
    }

    cellClicked(cellId: string) {
        if (!this.disableCells) {
            document.getElementById(cellId).innerHTML = this.move;
            this.disableCells = true;
            this.webSocketService.emit('cellClicked', { move: this.move, cellId });
        }
    }

    listenOpponentCellClick() {
        this.webSocketService.listen('cellClicked').subscribe(data => {
            document.getElementById(data['cellId']).innerHTML = this.opponentMove;
            this.disableCells = false;
        });
    }
}