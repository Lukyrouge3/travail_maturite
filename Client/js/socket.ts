import io from "socket.io-client";

export const URL: string = "http://localhost:1234";

export default class Socket {
    private socket: SocketIOClient.Socket = io(URL, {autoConnect: true});
    // eventsHandler: { message: string, handler: (data: any) => void }[];

    constructor() {}

    send(event, data?) {
        this.socket.emit(event, data);
    }

    on(message: string, handler: (data: any) => void) {
        // this.eventsHandler.push({message, handler});
        this.socket.on(message, handler);
    }
}