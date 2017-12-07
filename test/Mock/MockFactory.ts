import {LocalStorageFactory} from "../../src/app/Service/Impl/LocalStorageFactory";
import {LocallyStorable} from "../../src/app/Service/Interface/LocallyStorable";
import {DummyStorage} from "../../src/app/Service/Impl/DummyStorage";

export class MockFactory implements LocalStorageFactory {
    public getLocalStorage(): LocallyStorable {
        return new DummyStorage();
    }

}
