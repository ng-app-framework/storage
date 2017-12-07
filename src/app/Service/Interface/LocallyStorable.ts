export abstract class LocallyStorable {

    abstract setItem(key: string, value: string): void;

    abstract getItem(key: string): string | null;
}
