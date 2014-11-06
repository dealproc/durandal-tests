define(["knockout", "plugins/observable"], function (ko, observable) {
    var hasAttribute = function (node, attr) {
        return node.getAttribute(attr) !== null;
    };
    var getAttribute = function (element, attr) {
        return element.getAttribute(attr);
    };
    var getObservableFromBindingContext = function (element, bindingContext) {
        var element = bindingContext.$element || element,
        viewModel = bindingContext.$data,
        hasBindAttribute = hasAttribute(element, 'data-bind'),
        bindAttribute = getAttribute(element, "data-bind");

        findObservable = function (accessor, obj) {

            var boundProperty = accessor.split(":")[1].trim();

            var objects = boundProperty.split(".");
            var result = obj;

            for (var i = 1, j = objects.length - 1; i < j; i++) {
                result = result[objects[i]];
            }
            return observable(result, objects[objects.length - 1]);
        }

        if (hasBindAttribute) {
            var patternsToMatch = Object.keys(ko.bindingHandlers).join("|");

            var pattern = new RegExp("(" + patternsToMatch + ")\:[ \\t]+([A-z_0-9\\-]+)", "g");

            var matchResult = bindAttribute.match(pattern),
                accessor = matchResult && matchResult.length === 3 ? matchResult[2] : matchResult.length === 2 ? matchResult[1] : matchResult.length === 1 ? matchResult[0] : null;

            return findObservable(accessor, viewModel);
        }
        return null;
    };
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
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var obs = getObservableFromBindingContext(element, bindingContext),
                    allBindings = allBindingsAccessor(),
                    $element = $(element);

                var unwrappedValue = ko.utils.unwrapObservable(obs);

                if (unwrappedValue === null || unwrappedValue === undefined) {
                    unwrappedValue = "04:00 AM";
                }
                var pattern = allBindings.timePattern || "hh:mm A";

                var formattedText = moment(unwrappedValue).format(pattern);

                var $timepicker = $(element).timepicker({
                    showInputs: false,
                    minuteStep: 5,
                    disableFocus: true
                });

                if (unwrappedValue !== null && unwrappedValue !== undefined) {
                    $timepicker.timepicker("setTime", formattedText);
                }

                var updateTripped = false;
                var valueUpdateHandler = function (e) {
                    var currentTime = $timepicker.timepicker("getTime");
                    if (e.time.value !== currentTime) {
                        ko.expressionRewriting.writeValueToProperty(obs, allBindings, 'value', e.time.value);
                    }
                };

                ko.utils.registerEventHandler($element, "changeTime.timepicker", valueUpdateHandler);

                // Commented out because not sure if this is necessary.
                ////handle disposal (if KO removes by the template binding)
                //ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                //    $(element).timepicker("destroy");
                //});

                $timepicker.timepicker("update");
            },
            update: function (element, valueAccessor, allBindingsAccessor) {
                //var value = valueAccessor(),
                //    allBindings = allBindingsAccessor(),
                //    unwrappedValue = ko.utils.unwrapObservable(value);
                //
                //var pattern = allBindings.timePattern || "hh:mm A";
                //var formattedText = moment(unwrappedValue).format(pattern);
                //
                //$(element).timepicker("setTime", formattedText);
            }
        };
    };
    return {
        install: install
    };
});