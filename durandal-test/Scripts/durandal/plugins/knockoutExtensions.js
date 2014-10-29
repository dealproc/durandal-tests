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
        // binding from: https://github.com/hugozap/knockoutjs-date-bindings/blob/master/src/ko.dateBindings.js
        ko.bindingHandlers.timepicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var value = valueAccessor(),
                    allBindings = allBindingsAccessor(),
                    $element = $(element),
                    valueUnwrapped = ko.utils.unwrapObservable(value);
            
                if (valueUnwrapped === null || valueUnwrapped === undefined) {
                    valueUnwrapped = "04:00 AM";
                }
                var pattern = allBindings.timePattern || "hh:mm A";
            
                var formattedText = moment(valueUnwrapped).format(pattern);
            
                var $timepicker = $(element).timepicker({
                    showInputs: false,
                    minuteStep: 5,
                    disableFocus: true
                });
            
                if (valueUnwrapped !== null && valueUnwrapped !== undefined) {
                    $timepicker.timepicker("setTime", formattedText);
                }
            
                var updateTripped = false;
                var valueUpdateHandler = function (e) {
                    var currentTime = $timepicker.timepicker("getTime");
                    if (e.time.value !== currentTime) {
                        ko.expressionRewriting.writeValueToProperty(value, allBindings, 'value', e.time.value);
                    }
                };
            
                ko.utils.registerEventHandler($element, "changeTime.timepicker", valueUpdateHandler);
            },
            update: function (element, valueAccessor, allBindingsAccessor) {
                var value = valueAccessor(),
                    allBindings = allBindingsAccessor();
            
                var valueUnwrapped = ko.utils.unwrapObservable(value);
                $(element).timepicker("setTime", valueUnwrapped);
            }
        };

    };
    return {
        install: install
    };
})