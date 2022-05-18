"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.URL = void 0;
var socket_io_client_1 = __importDefault(require("socket.io-client"));
exports.URL = "http://localhost:1234";
var Socket = /** @class */ (function () {
    // eventsHandler: { message: string, handler: (data: any) => void }[];
    function Socket() {
        this.socket = socket_io_client_1["default"](exports.URL, { autoConnect: true });
    }
    Socket.prototype.send = function (event, data) {
        this.socket.emit(event, data);
    };
    Socket.prototype.on = function (message, handler) {
        // this.eventsHandler.push({message, handler});
        this.socket.on(message, handler);
    };
    return Socket;
}());
exports["default"] = Socket;
//# sourceMappingURL=socket.js.map