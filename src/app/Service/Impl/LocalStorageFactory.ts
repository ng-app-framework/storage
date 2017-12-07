import {DummyStorage} from "./DummyStorage";
import {LocalStorage} from "./LocalStorage";
import {LocallyStorable} from "../Interface/LocallyStorable";

export class LocalStorageFactory {

    getLocalStorage(storage?: Storage): LocallyStorable {
        if (!storage) {
            return new DummyStorage();
        }
        return new LocalStorage();
    }
}
