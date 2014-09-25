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
        return Math.max(a, b.values.reduce(function (c, d) {
          return c + d[1];
        }, 0));
      }, 0),
      sets = data.map(function (d, i) {
        var total = d.values.reduce(function (a, b) {
            return a + b[1];
          }, 0),
          diameter = getDiameter(total / maxTotal);

        return {
          id: i,
          name: d.name,
          color: d.color,
          total: total,
          diameter: diameter
        };
      }),
      maxDiameter = sets.reduce(function (a, b) {
        return Math.max(a, b.diameter);
      }, 0);

    sets.sort(function (a, b) {
      return b.total - a.total;
    });

    sets.forEach(function (d) {
      var width = Math.max(maxWidth * (d.diameter / maxDiameter), minWidth),
        $set = $('<div class="set">');

      $set.addClass(d.color);

      $('<a class="bubble" href="#">')
        .css('width', Graft.percent(width) + '%')
        .appendTo($set);

      $('<div><a class="name" href="#">' + d.name)
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

  $(document).on('click', '.graft.bubbles .bubble, .graft.bubbles .name', Graft.toggle);

  return {
    bind: bind
  };
})();
