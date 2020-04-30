import * as Discord from 'discord.js';

import { Bot } from './bot';
import { Command, CommandHandler } from './handler';
import { Log } from './log';

export class Controller {
    private static readonly commandStorage: ControllerCommandStorage = {};

    public static getCommands(): ControllerCommandStorage {
        return { ...Controller.commandStorage };
    }

    public static register(method: string, handler: CommandHandler, command: Command) {
        Controller.commandStorage[method] = {
            name: method,
            command: command,
            handler: handler
        };
    }

    public static handle(message: Discord.Message) {
        if (message.author.id !== Bot.id) {
            const com = this.parseMessage(message.content);
            if (com && this.commandStorage[com.name]) {
                try {
                    this.commandStorage[com.name].command.caller.apply(this, [message, com]);
                } catch (err) {
                    Log.error(err, this.commandStorage[com.name].handler.name);
                }
            }
        }
    }

    private static parseMessage(text: string): MessageCommand | undefined {
        const match = text.match(/^([\w\d-]+)(\s+(?:(?:"(?:(?:[\w\d\s])|(?:\\"))+?")|[^-\s].+?))?((?:\s+-(?:\w+)\s+(?:(?:".+?")|[\w\d]+)?)*)$/);
        if (!match) return undefined;
        return {
            name: (match[1] || "").trim(),
            params: (match[2] || "").trim().replace(/^"(.+)"$/, "$1"),
            flags: this.parseFlags((match[3] || "").trim())
        };
    }

    private static parseFlags(flagString: string) {
        const flags: {[key: string]: string} = {};
        let match = null;
        while (match = flagString.match(/^(?: *-(\w+)\s*((?:"(?:(?:[\w\d\s]|\\")+?)")|(?:(?:[\w\d\s]|\\")+?)?)?)(?:\s|$)/)) {
            const flagName = (match[1] || "").trim();
            flags[flagName] = (match[2] || "").trim().replace(/^"(.+)"$/, "$1");
            if (match[0].length - flagString.length < 0) {
                flagString = flagString.substr(match[0].length - flagString.length);
            } else {
                break;
            }
        }
        return flags;
    }
}

export type ControllerCommandStorage = {
    [method: string]: {
        name: string,
        command: Command,
        handler: CommandHandler
    }
};