import fs from 'fs';

import { Log } from './log';

export class Config {
    private static configLock: boolean = false;
    private static data: ConfigData;

    private static getData(): ConfigData {
        if (!this.data) {
            this.readConfig();
        }
        return this.data;
    }

    private static readConfig() {
        try {
            const config = fs.readFileSync("./config.json");
            this.data = JSON.parse(config.toString());
        } catch (err) {
            Log.error(err, "Config.ReadConfig");
        }
    }

    private static writeConfig() {
        if (!this.configLock) {
            try {
                this.configLock = true;
                fs.writeFileSync("./config.json", JSON.stringify(this.getData()));
            } catch (err) {
                Log.error(err, "Config.WriteConfig");
            } finally {
                this.configLock = false;
            }
        }
    }

    public static get(key: string): any {
        return this.getData()[key];
    }

    public static set(key: string, value: any) {
        this.getData()[key] = value;
        // this.writeConfig();
    }
}

type ConfigData = {
    token: string,
    logChannel: string,
    [key: string]: any
}