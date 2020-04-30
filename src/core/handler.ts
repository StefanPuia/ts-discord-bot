import * as Discord from 'discord.js';

export class CommandHandler {
    public readonly name: string;
    public readonly helpData: handlerHelpData;

    private commands: CommandStorage = {};

    public constructor(name: string, helpData: handlerHelpData) {
        this.name = name;
        this.helpData = helpData;
    }

    public register(command: string, help: () => string, caller: CommandCaller) {
        this.commands[command] = {
            help: help,
            caller: caller
        }
    }
    public getCommands() {
        return this.commands;
    }
}

export type CommandCaller = (message: Discord.Message, command?: MessageCommand) => void;

export abstract class Command {
    public abstract readonly help: (message?: Discord.Message) => string;
    public abstract readonly caller: CommandCaller;
}

export type CommandStorage = { [method: string]: Command };

export type handlerHelpData = {
    name: string,
    icon?: string,
    colour?: string,
    info?: string
}