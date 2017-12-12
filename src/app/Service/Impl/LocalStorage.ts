import {LocallyStorable} from "../Interface/LocallyStorable";

export class LocalStorage implements LocallyStorable {

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }
}
