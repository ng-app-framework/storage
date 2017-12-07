import {objectValue, stringValue} from "./dependencies";
import {Converter} from "../../src/app/Service/Interface/Converter";

export class MockConverter implements Converter {
    toString(value: any, shouldConvert?: (key: string) => boolean) {
        return stringValue;
    }

    fromString(value: string, shouldConvert?: (key: string) => boolean) {
        return objectValue;
    }
}
