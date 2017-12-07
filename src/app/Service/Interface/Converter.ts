export abstract class Converter {

    abstract toString(value: any, shouldConvert?: (key: string) => boolean): string;

    abstract fromString(value: string, shouldConvert?: (key: string) => boolean): any;
}
