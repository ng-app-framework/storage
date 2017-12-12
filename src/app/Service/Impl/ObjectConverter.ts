import {Converter} from "../Interface/Converter";
const stringify = require('json-stringify-safe');
import {Value} from "@ng-app-framework/core";

export class ObjectConverter implements Converter {


    toString(value: { [key: string]: any }, shouldConvert: (key: string) => boolean = () => true) {
        if (Value.isScalar(value)) {
            return '';
        }
        let convertible: any = {};
        for (let key in value) {
            if (Value.isNotNull(value[key]) && shouldConvert(key)) {
                convertible[key] = value[key];
            }
        }
        return stringify(convertible);
    }

    fromString(value: string, shouldConvert: (key: string) => boolean = () => true) {
        try {
            let convertible: { [key: string]: any } = JSON.parse(value);
            for (let key in convertible) {
                if (Value.isNotNull(convertible[key]) && !shouldConvert(key)) {
                    delete convertible[key];
                }
            }
            return convertible;
        } catch (e) {
            // Do not throw for json parse failures, just return an empty object to indicate failure
            return {};
        }
    }
}
