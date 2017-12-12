import {LocallyStorable} from "../Interface/LocallyStorable";
import {Value} from "@ng-app-framework/core";

export class DummyStorage implements LocallyStorable {

    storage = {};

    setItem(key: string, value: string): void {
        this.storage[key] = value;
    }

    getItem(key: string): string | null {
        return Value.coalesce(this.storage[key], null);
    }
}
