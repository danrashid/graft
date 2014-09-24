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
          $interval = $('<div class="interval">')
            .css('width', ts.intervalWidth + '%')
            .appendTo($set);

        $('<div class="bar">')
          .css({
            height: height + '%',
            bottom: bottom + '%'
          })
          .appendTo($interval);

        tops[j] = height + bottom;
      });

      $set
        .data(d)
        .appendTo($stack);
    });

    $('<div class="max">')
      .html(ts.max)
      .css('right', ts.rightEdge + '%')
      .appendTo($stack);

    $stack
      .appendTo($el)
      .on('mouseover', '.interval', function() {
        $stack.find('.set:first-child .interval')
          .removeClass('hover')
          .eq($(this).index())
            .addClass('hover');
      })
      .on('mouseout', function () {
        $stack.find('.set:first-child .interval')
          .removeClass('hover');
      });
  }

  return {
    bind: bind
  };
})();
