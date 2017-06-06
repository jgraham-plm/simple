define(['durandal/composition'], function (composition) {

    ko.bindingHandlers.circleProgress = {
        update: function (element, valueAccessor) {

            var $element = $(element),
                score = valueAccessor().progress || 0,
                lineWidth = valueAccessor().lineWidth || 4,

                centerX = element.width / 2,
                centerY = element.height / 2,
                radius = valueAccessor().radius || (centerX < centerY ? centerX : centerY - lineWidth / 2 - 1),
                progress = score / 100,
                cnxt = element.getContext('2d'),
                masteryScore = valueAccessor().masteryScore;

            if (masteryScore && score >= masteryScore) {
                $element.addClass('mastered')
            }

            var basicColor = 'rgb(252,98,42)';

            cnxt.beginPath();
            cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            cnxt.strokeStyle = basicColor;
            cnxt.lineWidth = lineWidth;
            cnxt.closePath();
            cnxt.stroke();

            if (progress > 0) {
                cnxt.beginPath();
                cnxt.strokeStyle = basicColor;
                cnxt.lineWidth = lineWidth;

                if (progress == 1) {
                    cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                } else {
                    cnxt.arc(centerX, centerY, radius, 1.5 * Math.PI, (progress * 2 - 0.5) * Math.PI);
                }

                cnxt.stroke();
            }

        }
    };



});