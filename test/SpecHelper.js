var customMatchers = {
    toBeApproximately: function (util, customEqualityTesters) {
        'use strict';
        return {
            compare: function (actual, expected, epsilon) {

                var message;
                var delta = (actual - expected) / expected;
                if (Math.abs(delta) > epsilon) {
                    var lower = expected * (1 - epsilon);
                    var upper = expected * (1 + epsilon);

                    message = 'Expected ' + actual + ' to be approximately ' + expected + ' +/- ' + epsilon + ' (' + lower + ' - ' + upper + ')';
                }

                return {
                    pass: !message,
                    message: message
                };
            }
        };
    }
};

beforeEach(function () {
    jasmine.addMatchers(customMatchers);
});
