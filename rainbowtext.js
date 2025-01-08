(function() {
    'use strict';

    var h1      = document.getElementsByTagName('h1')[0], // Select the first h1 element
        chars   = h1.textContent.split(''),              // Get text content and split into characters
        length  = chars.length,
        shift   = 360 / length,
        angle   = 0,
        span, t;

    h1.innerHTML = chars.map(function (char) {
      return '<span>' + char + '</span>'; // Wrap each character in a span
    }).join('');

    span = h1.children; // Get the span elements

    function frame() {
        for (var i = 0; i < length; i++) {
            span[i].style.color = 'hsl(' + (angle + Math.floor(i * shift)) + ', 60%, 70%)';
        }
        angle++;
    }

    t = setInterval(frame, 10); // Update colours every 10ms
})();
