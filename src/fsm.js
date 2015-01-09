define(function(require, exports, module) {
    function FSM(defaultState) {
        this.currentState = defaultState;

        this.jump = function(state) {
            this.currentState = state;
        };
    }

    module.exports = FSM;
});