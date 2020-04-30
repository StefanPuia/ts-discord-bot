import * as Discord from 'discord.js';

import { Bot } from '../core/bot';
import { Controller, ControllerCommandStorage } from '../core/controller';
import { CommandHandler, CommandStorage } from '../core/handler';

const coreHandler = new CommandHandler("CoreHandler", {
    name: "Core Options",
    icon: ":gear:",
    colour: "#00ff00"
});

const cache: {
    [handler: string]: {
        handler: CommandHandler,
        commands: CommandStorage
    }
} = {};

function initCommandCache(commands: ControllerCommandStorage) {
    if (Object.keys(cache).length !== 0) return;
    for (const method in commands) {
        const group = commands[method];
        if (!cache[group.handler.name]) {
            cache[group.handler.name] = {
                handler: group.handler,
                commands: {}
            };
        }
        cache[group.handler.name].commands[method] = group.command;
    }
}

coreHandler.register("help", () => "Show this help", (message: Discord.Message) => {
    const commands = Controller.getCommands();
    initCommandCache(commands);

    for (const handlerName in cache) {
        const handlerData = cache[handlerName].handler.helpData;

        const embed = new Discord.MessageEmbed().setTitle(`${handlerData.icon || ""} ${handlerData.name}`);
        if (handlerData.colour) embed.setColor(handlerData.colour);
        if (handlerData.info) embed.setDescription(handlerData.info);

        for (const comm in cache[handlerName].commands) {
            embed.addField(comm, commands[comm].command.help(message));
        }
        Bot.send(<Discord.TextChannel>message.channel, embed);
    }

})

export { coreHandler };