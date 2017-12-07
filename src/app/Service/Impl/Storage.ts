import {Storable} from "../Interface/Storable";
import {ObjectConverter} from "./ObjectConverter";
import {LocallyStorable} from "../Interface/LocallyStorable";
import {LocalStorageFactory} from "./LocalStorageFactory";
import {Converter} from "../Interface/Converter";
import {Value} from "@ng-app-framework/core";

export class Storage implements Storable {

    localStorageFactory: LocalStorageFactory = null;
    localStorage: LocallyStorable            = null;
    converter: Converter                     = null;
    isCached                                 = false;

    constructor(public storageKey: string) {
        this.loadDependencies();
    }

    loadDependencies(converter: Converter = new ObjectConverter(), localStorageFactory: LocalStorageFactory = new LocalStorageFactory()) {
        this.converter           = converter;
        this.localStorageFactory = localStorageFactory;
        this.localStorage        = localStorageFactory.getLocalStorage(localStorage);
    }

    public load(): void {
        this.loadFromStorage();
    }

    public clear(): void {
        this.isCached = false;
        this.setItem('');

    }

    public store() {
        this.assertStorageKeySet();
        this.setItem(this.converter.toString(this, (key: string) => {
            return this.hasValue(key) && this.shouldStore(key);
        }));
    }

    private hasValue(key: string) {
        return Value.isDefined(this[key]);
    }

    private assertStorageKeySet() {
        if (!this.storageKey || this.storageKey === '') {
            throw `Storage Key Not Set: ${this.constructor.name}`;
        }
    }

    public loadFromStorage(): void {
        this.assertStorageKeySet();
        let stored = this.getItem();
        if (stored) {
            this.isCached = true;
            Object.assign(this, this.converter.fromString(stored, (key: string) => {
                return this.hasValue(key) && this.shouldStore(key);
            }));
        }
    }

    shouldStore(key: string) {
        return ['storageKey', 'storage', 'localStorage', 'localStorageFactory', 'isCached', 'converter'].indexOf(key) === -1;
    }

    protected setItem(value: any) {
        this.localStorage.setItem(this.storageKey, value);
    }

    protected getItem(): any {
        return this.localStorage.getItem(this.storageKey);
    }
}
