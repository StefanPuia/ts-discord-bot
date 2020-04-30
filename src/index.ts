///<reference path='./index.d.ts'/>

import { Bot } from './core/bot';
import { coreHandler } from './handlers/core';

Bot.use(coreHandler);

Bot.init();
