import {Component, Injectable, NgModule} from "@angular/core";
import {BrowserModule}                   from "@angular/platform-browser";
import {CommonModule}                    from "@angular/common";
import {Observable}                      from "rxjs";
import {NgStorageModule}                 from "./NgStorageModule";
import {Storage}                         from "./Service/Impl/Storage";

@Injectable()
export class TestStorage extends Storage {

    prop1 = 0;
    prop2 = 0;
    prop3 = 0;

    constructor() {
        super('test');
    }
}

@Component({
    selector: 'app',
    template: `
        <div>It works!</div>
    `
})
export class AppComponent {

    constructor(public testStorage: TestStorage) {
        testStorage.load();
    }

    ngOnInit() {
        Observable.interval(1000)
                  .subscribe((val) => {
                      this.testStorage.update({
                          prop1: ++this.testStorage.prop1,
                          prop2: ++this.testStorage.prop2,
                          prop3: ++this.testStorage.prop3
                      });
                  })
    }
}

@NgModule({
    declarations: [AppComponent],
    imports     : [
        BrowserModule,
        CommonModule,
        NgStorageModule
    ],
    exports     : [AppComponent],
    providers   : [TestStorage],
    bootstrap   : [AppComponent]

})
export class AppModule {

}
