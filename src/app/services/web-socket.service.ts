import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";

@Injectable({
    providedIn: 'root'
})

export class WebSocketService {
    socket: any;
    url: string = "http://localhost:3001"

    constructor() {
        this.socket = io(this.url);
    }

    listen(event: string) {
        return new Observable(subscriber => {
            this.socket.on(event, (data: object) => {
                subscriber.next(data);
            })
        })
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }
}