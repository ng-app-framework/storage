import {MockFactory} from "../Mock/MockFactory";
import {MockConverter} from "../Mock/MockConverter";
import {TimedStorage} from "../../src/app/Service/Impl/TimedStorage";

describe('TimedStorage', () => {

    class TestStorage extends TimedStorage {

        constructor(expirationInMinutes ?: number) {
            super('test', expirationInMinutes);
        }

        loadDependencies() {
            super.loadDependencies(new MockConverter(), new MockFactory());
        }
    }

    let storage: TimedStorage = null;
    let minuteInSeconds       = 60;
    let secondInMilliseconds  = 1000;

    describe('on new instance', () => {
        it('should default the expiration to 30 minutes', () => {
            storage = new TestStorage();
            expect(storage.expirationIncrementInMinutes).toEqual(30);
        })
    });
    describe('after instantiation', () => {
        beforeEach(() => {
            storage = new TestStorage(5);
        });

        // Fixtures and Helper Functions

        let getExpirationInMilliseconds = function () {
            return (storage.expirationIncrementInMinutes * minuteInSeconds * secondInMilliseconds);
        };
        let getCurrentUnixTimestamp     = function () {
            return (new Date()).valueOf();
        };
        let getExpirationUnixTimestamp  = function () {
            return getCurrentUnixTimestamp() + getExpirationInMilliseconds();
        };
        let toInteger                   = function (value: number) {
            return (value).toFixed(0);
        };

        let millisecondsToSeconds = function (value: number) {
            return toInteger(value / secondInMilliseconds);
        };

        // Assertions

        let assertExpirationMatches            = function () {
            expect(millisecondsToSeconds(storage.getNewExpiration())).toEqual(millisecondsToSeconds(getExpirationUnixTimestamp()));
        };
        let assertFutureExpirationIsNotExpired = function () {
            storage.expiration = getExpirationUnixTimestamp();
            expect(storage.isExpired()).toBeFalsy('in the future');
        };
        let assertPastExpirationIsNotExpired   = function () {
            storage.expiration = getCurrentUnixTimestamp() - (getExpirationInMilliseconds());
            expect(storage.isExpired()).toBeTruthy('in the past');
        };
        let assertZeroExpirationIsNeverExpired = function () {
            storage.expiration = 0;
            expect(storage.isExpired()).toBeFalsy();
        };
        let assertClearGetsCalledOnLoad        = function () {
            let called         = false;
            storage.clear      = () => {
                // SPY MY PRETTY
                called = true;
            };
            // Its not 0, so EXPIRE IT
            storage.expiration = 1;
            storage.load();
            expect(called).toBeTruthy('clear was not called');
        };
        let assertClearDoesNotGetCalledOnLoad  = function () {
            let called         = false;
            storage.clear      = () => {
                // SPY MY PRETTY
                called = true;
            };
            // Its not 0, so EXPIRE IT
            storage.expiration = 0;
            storage.load();
            expect(called).toBeFalsy('clear was not supposed to be called');
        };

        let assertNewExpirationOnClear = function () {
            storage.expiration = 1;
            expect(storage.expiration).toEqual(1);
            storage.clear();
            assertExpirationMatches();
        };


        // Test Cases
        describe('Getting New Expiration', () => {
            it('should return a unix timestamp for the next expiration datetime if requested', () => {
                assertExpirationMatches();
            });
        });
        describe('Is Expired', () => {
            it('should return if the current time exceeds the expiration', () => {
                assertFutureExpirationIsNotExpired();
                assertPastExpirationIsNotExpired();
            });
            it('should always return false for isExpired if expiration is 0 (not set, keep indefinitely)', () => {
                assertZeroExpirationIsNeverExpired();
            });
        });
        describe('Clearing Cached Data', () => {
            it('should clear the cache if loading when expired', () => {
                assertClearGetsCalledOnLoad();
            });
            it('should create a new expiration when clearing', () => {
                assertNewExpirationOnClear();
            });
            it('should not clear the cache if loading when NOT expired', () => {
                assertClearDoesNotGetCalledOnLoad();
            });
        });
    });
});
