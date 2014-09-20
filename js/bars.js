/* global Graft, $: false */
'use strict';

Graft.bars = (function() {

  function bind(sel, data) {
    var $el = $(sel),
      $graphs = $('<div class="graft bars">'),
      graphs = data.map(function (d) {
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
      periodWidth = Math.floor((resolution / span) * 1000) / 1000;

    graphs.sort(function (a, b) {
      return a.total - b.total;
    });

    graphs.forEach(function (d) {
      var $graph = $('<div class="graph clearfix">'),
        max = d.values.reduce(function (a, b) {
          return Math.max(a, b[1]);
        }, 0);

      $('<div class="max">')
        .html(max)
        .appendTo($graphs);

      $('<div class="name">')
        .html(d.name)
        .css('color', d.color)
        .appendTo($graphs);

      d.values.forEach(function (v) {
        var $period = $('<div class="period">')
          .data({time: new Date(v[0]), value: v[1]})
          .css('width', periodWidth * 100 + '%')
          .appendTo($graph);

        $('<div class="bar">')
          .css('height', (v[1] / max) * 100 + '%')
          .appendTo($period);
      });

      $graph.appendTo($graphs);
    });

    $graphs.appendTo($el);
  }

  return {
    bind: bind
  };
})();
