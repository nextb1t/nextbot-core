"use strict";
var DIV = '__';
var State = (function () {
    function State(stateOrGroup, stateIndex) {
        var _this = this;
        this.toString = function () {
            var res = (_this.index)
                ? "" + _this.group + DIV + _this.index
                : _this.group;
            return res;
        };
        if (typeof stateOrGroup === 'string') {
            this.group = stateOrGroup;
            this.index = stateIndex;
        }
        else {
            this.group = stateOrGroup.group;
            this.index = stateOrGroup.index;
        }
    }
    State.prototype.change = function (sgroup, sindex) {
        this.prevState = new State(this.group, this.index);
        this.group = sgroup;
        this.index = sindex;
    };
    State.prototype.is = function (state) {
        return (state.group === this.group && state.index === this.index);
    };
    return State;
}());
exports.State = State;
exports.START = new State('_start');
exports.IDLE = new State('_idle');
exports.DEFAULT = new State('_default');
//# sourceMappingURL=State.js.map