export abstract class Storable {
    abstract load();

    abstract clear();

    abstract store();

    abstract shouldStore(key: string): boolean;
}

