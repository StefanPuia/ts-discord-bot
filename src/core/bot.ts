import * as Discord from 'discord.js';

import { Config } from './config';
import { Controller } from './controller';
import { CommandHandler } from './handler';
import { Log } from './log';

export class Bot {
    private static instance: Bot;
    public static id: string;

    private bot: Discord.Client;
    private ready: boolean = false;

    private constructor() {
        this.bot = new Discord.Client();
    };

    private static getInstance() {
        if (!this.instance) {
            this.instance = new Bot();
        }
        return this.instance;
    }

    private init() {
        this.bot.login(Config.get("token"));

        this.bot.on('ready', () => {
            this.ready = true;
            Bot.id = this.bot.user!.id || "";
            Log.info("Ready!", "Bot.Init.Ready");
        });

        this.bot.on('disconnect', () => {
            this.ready = false;
        });

        this.bot.on("message", (message: Discord.Message) => {
            Controller.handle(message);
        })

        this.bot.on('error', error => {
            Log.error(error, "Bot.Init.OnError");
        });
    }

    public static use(handler: CommandHandler) {
        const commands = handler.getCommands();
        for (const comm of Object.keys(commands)) {
            Controller.register(comm, handler, commands[comm]);
        }
    }

    public static init() {
        this.getInstance().init();
    }

    public static async getChannel(id: string): Promise<Discord.Channel> {
        return await this.getInstance().bot.channels.fetch(id);
    }

    public static send(target: Discord.User | Discord.TextChannel, message: Discord.Message | Discord.MessageEmbed) {
        if (this.getInstance().ready) {
            try {
                (target as Discord.TextChannel).send(message as Discord.MessageEmbed);
            } catch (err) {
                Log.error(err, "Bot.Send");
            }
        } else {
            Log.error("Bot not ready", "Bot.Send");
        }
    }

    public static getBot() {
        return Bot.getInstance().bot;
    }
}