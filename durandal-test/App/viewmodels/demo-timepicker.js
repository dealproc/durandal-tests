define(["durandal/app", "plugins/observable"], function (app, observable) {
    var pg = function () { };
    pg.prototype.canActivate = function () {
        this.model = {
            TimeIn: Date.now()
        };
        return true;
    };
    pg.prototype.activate = function () {
        var x = 0;
    };
    pg.prototype.submit = function () {
        alert(this.model.TimeIn);
    };
    return pg;
})