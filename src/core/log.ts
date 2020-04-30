import * as Discord from 'discord.js';
import { Bot } from './bot';
import { Config } from './config';
export class Log {
    private static NO_MODULE = "No Module";

    public static info(data: any): void;
    public static info(data: any, moduleName: string): void;
    public static info(data: any, moduleName: string, skipMessage: boolean): void;
    public static async info(data: any, moduleName: string = Log.NO_MODULE, skipMessage: boolean = false) {
        console.log(data);
        if (!skipMessage) {
            try {
                const channel = await Log.getLogsChannel();
                Bot.send(<Discord.TextChannel>channel, MessageLog.build("INFO", moduleName, data));
            } catch (err) {
                Log.error(err);
            }
        }
    }

    public static warn(data: any): void;
    public static warn(data: any, moduleName: string): void;
    public static warn(data: any, moduleName: string, skipMessage: boolean): void;
    public static async warn(data: any, moduleName: string = Log.NO_MODULE, skipMessage: boolean = false) {
        console.warn(data);
        if (!skipMessage) {
            try {
                const channel = await Log.getLogsChannel();
                Bot.send(<Discord.TextChannel>channel, MessageLog.build("WARN", moduleName, data));
            } catch (err) {
                Log.error(err);
            }
        }
    }

    public static error(data: any): void;
    public static error(data: any, moduleName: string): void;
    public static error(data: any, moduleName: string, skipMessage: boolean): void;
    public static async error(data: any, moduleName: string = Log.NO_MODULE, skipMessage: boolean = false) {
        console.error(data);
        if (!skipMessage) {
            try {
                const channel = await Log.getLogsChannel();
                Bot.send(<Discord.TextChannel>channel, MessageLog.build("ERROR", moduleName, data));
            } catch (err) {
                console.error(err);
            }
        }
    }

    public static async getLogsChannel() {
        return await Bot.getChannel(Config.get("logChannel"));
    }
}

class MessageLog {
    private static types = {
        "INFO": "#2daeeb",
        "WARN": "#ebc22d",
        "ERROR": "#e81313"
    };

    public static build(type: logType, title: string, text: string): Discord.MessageEmbed {
        const embed = new Discord.MessageEmbed();
        
        if (this.types[type]) embed.setColor(this.types[type]);
        if (title) embed.setTitle(title);
        if (text) embed.setDescription(text);

        return embed;
    }
}

type logType = "INFO" | "WARN" | "ERROR";