define(["knockout"], function (ko) {
    var install = function () {

        ko.bindingHandlers.datepicker = {
            init: function (element, valueAccessor, allBindings) {
                //initialize datepicker with some optional options
                var modelValue = valueAccessor(),
                    options = allBindings().datepickerOptions || {
                        format: 'mm/dd/yyyy',
                        clearBtn: true
                    },
                    $element = $(element),
                    valueUnwrapped = ko.utils.unwrapObservable(modelValue);


                var valueUpdateHandler = function () {
                    var setDate = $(element).datepicker("getDate");
                    var dateNumber = Date.parse(setDate);
                    if (isNaN(dateNumber) == false) {
                        ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'value', moment(setDate).format("L"));
                    } else {
                        ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'value', undefined);
                    }
                };

                var momentDate = moment(valueUnwrapped);

                $datepicker = $element.datepicker(options);

                ko.utils.registerEventHandler($element, "changeDate", valueUpdateHandler);

                if (valueUnwrapped !== null && valueUnwrapped !== undefined) {
                    var formatted = momentDate.format("L");
                    $datepicker.datepicker("setDate", formatted);
                }
            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                if (value !== null && value !== undefined) {
                    $(element).datepicker("setDate", value);
                }
            }
        };

        ko.bindingHandlers.timepicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                //initialize timepicker with some optional options
                var options = allBindingsAccessor().timepickerOptions || {},
                    input = $(element).timepicker(options);

                //handle the field changing
                ko.utils.registerEventHandler(element, "time-change", function (event, time) {
                    var observable = valueAccessor(),
                        current = ko.utils.unwrapObservable(observable);

                    if (current - time !== 0) {
                        observable(time);
                    }
                });

                //handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).timepicker("destroy");
                });
            },

            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    // calling timepicker() on an element already initialized will
                    // return a TimePicker object
                    instance = $(element).timepicker();

                if (value !== null && value !== undefined) {
                    if (value - instance.getTime() !== 0) {
                        instance.setTime(value);
                    }
                } else {
                    instance.clear();
                }
            }
            //init: function (element, valueAccessor, allBindingsAccessor) {
            //    var value = valueAccessor(),
            //        allBindings = allBindingsAccessor(),
            //        $element = $(element),
            //        valueUnwrapped = ko.utils.unwrapObservable(value);
            //
            //    if (valueUnwrapped === null || valueUnwrapped === undefined) {
            //        valueUnwrapped = "04:00 AM";
            //    }
            //    var pattern = allBindings.timePattern || "hh:mm A";
            //
            //    var formattedText = moment(valueUnwrapped).format(pattern);
            //
            //    var $timepicker = $(element).timepicker({
            //        showInputs: false,
            //        minuteStep: 5,
            //        disableFocus: true
            //    });
            //
            //    if (valueUnwrapped !== null && valueUnwrapped !== undefined) {
            //        $timepicker.timepicker("setTime", formattedText);
            //    }
            //
            //    var updateTripped = false;
            //    var valueUpdateHandler = function (e) {
            //        var currentTime = $timepicker.timepicker("getTime");
            //        if (e.time.value !== currentTime) {
            //            ko.expressionRewriting.writeValueToProperty(value, allBindings, 'value', e.time.value);
            //        }
            //    };
            //
            //    ko.utils.registerEventHandler($element, "changeTime.timepicker", valueUpdateHandler);
            //},
            //update: function (element, valueAccessor, allBindingsAccessor) {
            //    var value = valueAccessor(),
            //        allBindings = allBindingsAccessor();
            //
            //    var valueUnwrapped = ko.utils.unwrapObservable(value);
            //    $(element).timepicker("setTime", valueUnwrapped);
            //}
        };

    };
    return {
        install: install
    };
})