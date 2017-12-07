import {Storage} from "./Storage";

export abstract class TimedStorage extends Storage {

    expiration: number = 0;

    constructor(name, public expirationIncrementInMinutes: number = 30) {
        super(name);
        this.expiration = this.getNewExpiration();
    }

    load() {
        super.load();
        if (this.isExpired()) {
            this.clear();
        }
    }

    clear() {
        super.clear();
        this.expiration = this.getNewExpiration();
    }

    getNewExpiration() {
        let today = new Date();
        today.setMinutes(today.getMinutes() + this.expirationIncrementInMinutes);
        return today.valueOf();
    }

    isExpired() {
        return this.expiration > 0 && this.expiration < (new Date()).valueOf();
    }
}
