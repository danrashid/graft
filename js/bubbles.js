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
      sets = data.map(function (d) {
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

    sets.sort(function (a, b) {
      return b.total - a.total;
    });

    sets.forEach(function (d) {
      var width = Math.max(maxWidth * (d.diameter / maxDiameter), minWidth),
        $set = $('<div class="set">');

      $set.addClass(d.color);

      $('<div class="bubble">')
        .css('width', Graft.percent(width) + '%')
        .appendTo($set);

      $('<div class="name">')
        .html(d.name)
        .appendTo($set);

      $('<div class="total">')
        .html(d.total)
        .appendTo($set);

      $set
        .data(d)
        .appendTo($bubbles);
    });

    $bubbles
      .appendTo($el)
      .on('click', '.bubble, .name', Graft.toggle)
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
