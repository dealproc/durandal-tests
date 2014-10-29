define(["durandal/app", "plugins/observable"], function (app, observable) {
    var pg = function () { };

    pg.prototype.canActivate = function () {
        this.model = {
            FirstName: 'Jim',
            LastName: 'Thorpe'
        };

        return true;
    };

    pg.prototype.activate = function () {
        this.validationModel = ko.validatedObservable({
            p1: observable(this.model, "FirstName").extend({ required: true }),
            p2: observable(this.model, "LastName").extend({ required: true })
        });
    };

    pg.prototype.submit = function () {
        alert(this.validationModel.isValid());
    };

    return pg;
});