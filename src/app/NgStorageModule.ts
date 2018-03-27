import {NgModule}     from '@angular/core';
import {NgCoreModule} from "@ng-app-framework/core";
import {Observable}   from "rxjs";
import {Storage}      from "./Service/Impl/Storage";


@NgModule({
    imports: [
        NgCoreModule
    ]
})
export class NgStorageModule {

    constructor() {
        Observable.fromEvent(window, 'storage')
                  .subscribe((event: StorageEvent) => {
                      if (Storage.registry.hasOwnProperty(event.key)) {
                          Storage.registry[event.key].onStorageChange(event);
                      }
                  });
    }
}

