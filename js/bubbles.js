/* global Graft, $: false, Mustache: false */
'use strict';

Graft.bubbles = (function() {
  var template = Graft.template('bubbles');

  function getDiameter(area) {
    return 2 * Math.sqrt(area / Math.PI);
  }

  function bind(sel, data, maxWidth, minWidth) {
    maxWidth = maxWidth || 1;
    minWidth = minWidth || 0.01;

    var maxTotal = data.reduce(function (a, b) {
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
      }, 0),
      $bubbles;

    sets
      .sort(function (a, b) {
        return b.total - a.total;
      })
      .forEach(function (d) {
        d.width = Graft.percent(Math.max(maxWidth * (d.diameter / maxDiameter), minWidth));
      });

    $bubbles = $(Mustache.render(template, {
      sets: sets
    }));

    $bubbles.find('.set').each(function (i) {
      $(this).data(sets[i]);
    });

    $bubbles
      .appendTo($(sel))
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
