import {Storable}            from "../Interface/Storable";
import {ObjectConverter}     from "./ObjectConverter";
import {LocallyStorable}     from "../Interface/LocallyStorable";
import {LocalStorageFactory} from "./LocalStorageFactory";
import {Converter}           from "../Interface/Converter";
import {Value}               from "@ng-app-framework/core";

export class Storage implements Storable {

    static registry = {};

    localStorageFactory: LocalStorageFactory = null;
    localStorage: LocallyStorable            = null;
    converter: Converter                     = null;
    isCached                                 = false;

    constructor(public storageKey: string) {
        this.loadDependencies();
        Storage.registry[storageKey] = this;
    }

    loadDependencies(converter: Converter = new ObjectConverter(), localStorageFactory: LocalStorageFactory = new LocalStorageFactory()) {
        this.converter           = converter;
        this.localStorageFactory = localStorageFactory;
        this.localStorage        = localStorageFactory.getLocalStorage(localStorage);
    }

    public load(): void {
        this.loadFromStorage();
    }

    public onStorageChange() {
        this.load();
    }

    public clear(): void {
        this.isCached = false;
        this.setItem('');

    }

    set(key: string, value: any, store: boolean = true) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
            if (this.shouldStore(key) && store) {
                this.store();
            }
        }
    }

    get(key: string) {
        return this.hasOwnProperty(key) ? this[key] : undefined;
    }

    update(propertyBag: any, persist: boolean = true) {
        for (let property in propertyBag) {
            if (propertyBag.hasOwnProperty(property)) {
                this.set(property, propertyBag[property], false);
            }
        }
        if (persist) {
            this.store();
        }
    }

    public store() {
        this.assertStorageKeySet();
        this.setItem(this.converter.toString(this, (key: string) => {
            return this.hasValue(key) && this.shouldStore(key);
        }));
    }

    protected hasValue(key: string) {
        return Value.isDefined(this[key]);
    }

    protected assertStorageKeySet() {
        if (!this.storageKey || this.storageKey === '') {
            throw `Storage Key Not Set: ${this.constructor.name}`;
        }
    }

    public loadFromStorage(): void {
        this.assertStorageKeySet();
        let stored = this.getItem();
        if (stored) {
            this.isCached = true;
            this.update(this.converter.fromString(stored, (key: string) => {
                return this.shouldStore(key);
            }), false);
        }
    }

    shouldStore(key: string) {
        return this.hasValue(key) && ['storageKey', 'storage', 'localStorage', 'localStorageFactory', 'isCached', 'converter'].indexOf(key) === -1 && typeof this[key] !== 'function';
    }

    protected setItem(value: any) {
        this.localStorage.setItem(this.storageKey, value);
    }

    protected getItem(): any {
        return this.localStorage.getItem(this.storageKey);
    }
}
