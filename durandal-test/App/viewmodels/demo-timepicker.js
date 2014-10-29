define([], function () {
    var pg = function () { };
    pg.prototype.canActivate = function () {
        this.model = {
            TimeIn: undefined
        };
        return true;
    }
    pg.prototype.submit = function () {
        alert(this.model.TimeIn);
    };
    return pg;
})