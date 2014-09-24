/* global Graft, $: false */
'use strict';

Graft.stack = (function() {

  function bind(sel, data) {
    var $el = $(sel),
      $stack = $('<div class="graft stack">'),
      ts = Graft.timeseries(data),
      tops = [];

    ts.sets.forEach(function (d) {
      var $set = $('<div class="set">');

      $set.addClass(d.color);

      d.values.forEach(function (v, j) {
        var height = Graft.percent(v[1] / ts.max),
          bottom = tops[j] || 0,
          $period = $('<div class="period">')
            .css('width', ts.intervalWidth + '%')
            .appendTo($set);

        $('<div class="bar">')
          .css({
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
