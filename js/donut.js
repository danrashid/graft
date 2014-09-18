/* global Graft, $: false */
'use strict';

Graft.donut = function (sel, data) {
  var $el = $(sel),
    $donut = $('<div class="graft donut"><div class="hole">'),
    total = data.reduce(function (a, b) {
      return a + b.total;
    }, 0),
    start = 0,
    slices = data.map(function (d) {
      return {
        id: d.id,
        name: d.name,
        color: d.color,
        total: d.total,
        ratio: d.total / total
      };
    });

  slices.sort(function (a, b) {
    return a.total - b.total;
  });

  slices.forEach(function (d, i) {
    var deg = Math.floor(360 * d.ratio),
      skewY = Math.min(deg - 90, 89),
      transform = i < slices.length - 1 ? 'rotate(' + start + 'deg) skewY(' + skewY + 'deg)' : null;

    start += deg;

    $('<div class="slice">')
      .data('d', d)
      .css({
        background: d.color,
        '-ms-transform': transform,
        '-webkit-transform': transform,
        transform: transform
      })
      .appendTo($donut);
  });

  $donut
    .height($el.width())
    .appendTo($el);
};

$(window).on('resize', function () {
  $('.donut').each(function () {
    var $this = $(this);

    $this.height($this.width());
  });
});
