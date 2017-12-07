import {LocalStorageFactory} from "../../src/app/Service/Impl/LocalStorageFactory";
import {LocalStorage} from "../../src/app/Service/Impl/LocalStorage";
import {DummyStorage} from "../../src/app/Service/Impl/DummyStorage";

describe('LocalStorageFactory', () => {
    let factory: LocalStorageFactory;

    beforeEach(() => {
        factory = new LocalStorageFactory();
    });

    it('should return the LocalStorage Proxy if localStorage is defined (Modern browsers have it)', () => {
        expect(factory.getLocalStorage(localStorage) instanceof LocalStorage).toBeTruthy();
    });
    it('should return the DummyStorage Proxy if localStorage is not defined (Older browser or Incognito Mode or In Private Browsing)', () => {
        expect(factory.getLocalStorage() instanceof DummyStorage).toBeTruthy();
    })
});
