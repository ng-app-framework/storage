import {objectValue, stringValue} from "../Mock/dependencies";
import {MockObjectConverter} from "../Mock/MockObjectConverter";
import {MockLocalStorageFactory} from "../Mock/MockLocalStorageFactory";
import {Storage} from "../../src/app/Service/Impl/Storage";

describe('Storage', () => {
    let storage: Storage = null;

    class TestStorage extends Storage {
        constructor(storageKey: string = '') {
            super(storageKey);
        }

        loadDependencies() {
            super.loadDependencies(new MockObjectConverter(), new MockLocalStorageFactory());
        }
    }

    describe('on new instance', () => {

        it('SHOULD throw if trying to load or store WITHOUT a proper storageKey', () => {
            storage = new TestStorage();
            expect(() => storage.load()).toThrow();
            expect(() => storage.store()).toThrow();
        });
        it('SHOULD NOT throw if trying to load or store WITH a proper storageKey', () => {
            storage = new TestStorage('words');
            expect(() => storage.load()).not.toThrow();
            expect(() => storage.store()).not.toThrow();
        });
    });
    describe('After Instantiation', () => {

        beforeEach(() => {
            storage = new TestStorage('test');
        });
        let setUpForCheckingStorage = function () {
            storage['storeMe'] = '';
            storage.localStorage.setItem('test', stringValue);
            expect(storage['storeMe']).toEqual('');
        };

        let assertStoragePropertiesDoNotGetStored = function () {
            expect(storage.shouldStore('storage')).toBeFalsy();
            expect(storage.shouldStore('storageKey')).toBeFalsy();
            expect(storage.shouldStore('isCached')).toBeFalsy();
        };
        let assertRandomPropertyNameGetsStored    = function () {
            expect(storage.shouldStore('bob')).toBeTruthy();
        };

        let assertDependenciesDoNotGetStored = function () {
            expect(storage.shouldStore('localStorage')).toBeFalsy();
            expect(storage.shouldStore('localStorageFactory')).toBeFalsy();
            expect(storage.shouldStore('converter')).toBeFalsy();
        };
        let assertCacheLoaded                = function () {
            storage.load();
            expect(storage['storeMe']).toEqual(objectValue.storeMe);
        };

        it('should load data from cache if exists', () => {
            setUpForCheckingStorage();
            assertCacheLoaded();
        });
        it('should return null if cache does not exist', () => {
            expect(storage.localStorage.getItem('does not exist')).toEqual(null);
        });
        it('should make sure the properties "storage" and "storageKey" do not get stored', () => {
            assertStoragePropertiesDoNotGetStored();
        });
        it('should make sure the dependencies do not get stored', () => {
            assertDependenciesDoNotGetStored();
        });
        it('should be able to store any old property name that was not protected by "shouldStore"', () => {
            assertRandomPropertyNameGetsStored();
        })
    });


});
