import {Observable} from "rxjs";
import {Storage}    from "./Storage";


export class StorageUpdater {

    constructor(storage: Storage) {
        Observable.fromEvent(window, 'storage')
            .subscribe((event) => {

            });
    }
}
