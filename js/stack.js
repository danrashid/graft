/* global Graft, $: false */
'use strict';

Graft.stack = (function() {

  function bind(sel, data) {
    var $el = $(sel),
      $stack = $('<div class="graft stack">'),
      sets = data.map(function (d) {
        return {
          id: d.id,
          name: d.name,
          color: d.color,
          total: d.total,
          values: d.values
        };
      }),
      resolution = data[0].values[1][0] - data[0].values[0][0],
      span = data[0].values[data[0].values.length - 1][0] - data[0].values[0][0],
      periodWidth = Graft.percent(resolution / span),
      max = data[0].values
        .map(function (v, i) {
          return data.reduce(function (a, b) {
            return a + b.values[i][1];
          }, 0);
        })
        .reduce(function (a, b) {
          return Math.max(a, b);
        }, 0),
      tops = [];

    sets.sort(function (a, b) {
      return b.total - a.total;
    });

    sets.forEach(function (d) {
      var $set = $('<div class="set">');

      d.values.forEach(function (v, j) {
        var height = Graft.percent(v[1] / max),
          bottom = tops[j] || 0,
          $period = $('<div class="period">')
            .css('width', periodWidth + '%')
            .appendTo($set);

        $('<div class="bar">')
          .css({
            background: d.color,
            height: height + '%',
            bottom: bottom + '%'
          })
          .appendTo($period);

        tops[j] = height + bottom;
      });

      $set
        .data(d)
        .appendTo($stack);
    });

    $stack
      .appendTo($el)
      .on('mouseover', '.period', function() {
        $stack.find('.set:first-child .period')
          .removeClass('hover')
          .eq($(this).index())
            .addClass('hover');
      })
      .on('mouseout', function () {
        $stack.find('.set:first-child .period')
          .removeClass('hover');
      });
  }

  return {
    bind: bind
  };
})();
