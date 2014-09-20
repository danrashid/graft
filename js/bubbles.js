/* global Graft, $: false */
'use strict';

Graft.bubbles = (function() {

  function getDiameter(area) {
    return 2 * Math.sqrt(area / Math.PI);
  }

  function bind(sel, data, maxWidth, minWidth) {
    maxWidth = maxWidth || 1;
    minWidth = minWidth || 0.01;

    var $el = $(sel),
      $bubbles = $('<div class="graft bubbles">'),
      maxTotal = data.reduce(function (a, b) {
        return Math.max(a, b.total);
      }, 0),
      maxDiameter = 0,
      bubbles = data.map(function (d) {
        var diameter = getDiameter(d.total / maxTotal);

        maxDiameter = Math.max(diameter, maxDiameter);

        return {
          id: d.id,
          name: d.name,
          color: d.color,
          total: d.total,
          diameter: diameter
        };
      });

    bubbles.sort(function (a, b) {
      return b.total - a.total;
    });

    bubbles.forEach(function (d) {
      var width = Math.max(maxWidth * (d.diameter / maxDiameter), minWidth),
        $set = $('<div class="set">');

      $('<div class="bubble">')
        .data({total: d.total})
        .css({
          background: d.color,
          width: Graft.percent(width) + '%'
        })
        .appendTo($set);

      $('<div class="name">')
        .css('color', d.color)
        .html(d.name)
        .appendTo($set);

      $set
        .data(d)
        .appendTo($bubbles);
    });

    $bubbles
      .appendTo($el)
      .on('click', '.name', Graft.toggle)
      .on('click', '.bubble', function (e) {
        Graft.tooltip.show(e, '<div class="bubbles">' + $(this).data('total') + '</div>');

        return false;
      })
      .find('.bubble')
        .height(function () {
          return $(this).width();
        });
  }

  $(window).on('resize', function () {
    $('.graft.bubbles .bubble').height(function () {
      return $(this).width();
    });
  });

  return {
    bind: bind
  };
})();
