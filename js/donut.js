/* global Graft, $: false */
'use strict';

Graft.donut = function (sel, data, spaceDeg) {
  spaceDeg = spaceDeg || 5;

  function getSkewY(deg) {
    return Math.min(deg - 90, 89);
  }

  function getTransformRules(start, deg) {
    var skewY = getSkewY(deg),
      transform = 'rotate(' + start + 'deg) skewY(' + skewY + 'deg)';

    return {
      '-ms-transform': transform,
      '-webkit-transform': transform,
      transform: transform
    };
  }

  function appendSpace() {
    $('<div class="space">')
      .css(getTransformRules(start, spaceDeg))
      .appendTo($donut);

    start += spaceDeg;
  }

  var $el = $(sel),
    $donut = $('<div class="graft donut"><div class="hole">'),
    total = data.reduce(function (a, b) {
      return a + b.total;
    }, 0),
    start = -spaceDeg,
    slices = data.map(function (d) {
      return {
        id: d.id,
        name: d.name,
        color: d.color,
        total: d.total,
        ratio: d.total / total
      };
    }),
    lastSlice;

  slices.sort(function (a, b) {
    return a.total - b.total;
  });

  lastSlice = slices.pop();

  slices.forEach(function (d, i) {
    var sliceDeg = Math.floor(360 * d.ratio) - spaceDeg;

    appendSpace();

    $('<div class="slice">')
      .data(d)
      .css('background', d.color)
      .css(getTransformRules(start, sliceDeg))
      .appendTo($donut);

    start += sliceDeg;

    if (i === slices.length - 1) {
      appendSpace();
    }
  });

  $('<div class="slice">')
    .data(lastSlice)
    .css('background', lastSlice.color)
    .appendTo($donut);

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

$(document).on('click', '.slice', function (e) {
  var $slice = $(this),
    percent = Math.round($slice.data('ratio') * 10000) / 100;

  $(document).trigger('graft:tooltip:show', [
    e,
    '<div style="color:' + $slice.data('color') + '"><strong>' + percent + '%</strong></div>' +
    '<div>' + $slice.data('name') + '</div>'
  ]);
});
