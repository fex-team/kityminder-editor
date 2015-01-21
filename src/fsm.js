define(function(require, exports, module) {
    function FSM(defaultState) {
        var currentState = defaultState;
        var callbacks = [];

        this.jump = function(state, reason) {
            var lastState = currentState;
            if (state != lastState) {
                currentState = state;
                callbacks.forEach(function(callback) {
                    callback(lastState, currentState, reason);
                });
                console.log('%s -> %s', lastState, currentState, reason);
            }
        };

        this.state = function() {
            return currentState;
        };

        this.listen = function(callback) {
            callbacks.push(callback);
        };
    }

    return module.exports = FSM;
});