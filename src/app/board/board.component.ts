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

    move: string;
    opponentMove: string;

    errMsg: string;

    constructor(private webSocketService: WebSocketService) { }

    ngOnInit() {
        this.getPlayer();
        this.listenOpponentCellClick();
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
        document.getElementById(cellId).innerHTML = this.move;
        this.webSocketService.emit('cellClicked', { cellId });
    }

    listenOpponentCellClick() {
        this.webSocketService.listen('cellClicked').subscribe(data => {
            document.getElementById(data['cellId']).innerHTML = this.opponentMove;
        });
    }
}