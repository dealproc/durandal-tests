define(["durandal/app", "plugins/observable"], function (app, observable) {
    var pg = function () { };

    pg.prototype.activate = function () {
        this.model = {
            FirstName: 'Jim',
            LastName: 'Thorpe'
        };

        observable(this.model, "FirstName").extend({ required: true });
        observable(this.model, "LastName").extend({ required: true });

        this.validationModel = ko.validatedObservable({ p1: this.model });
    };

    pg.prototype.submit = function () {
        this.validationModel.errors.showAllMessages();
        alert(this.validationModel.isValid());
    };

    return pg;
});