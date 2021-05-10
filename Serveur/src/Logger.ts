import "colors"

export default class Logger {
    static log(color: string, header: string, message: string) {
        console.log("[" + header[color] + "]" + " " + message.white);
    }

    static infos(message: string) {
        Logger.log("green", "INFOS", message);
    }

    static error(message: string) {
        Logger.log("red", "ERROR", message);
    }

    static debug(message: string) {
        Logger.log("magenta", "DEBUG", message);
    }

    static warning(message: string) {
        Logger.log("yellow", "WARNING", message);
    }
}