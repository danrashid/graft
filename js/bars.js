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
      periodWidth = Graft.percent(resolution / span),
      maxRightPosition = 100 - (periodWidth * data[0].values.length);

    graphs.sort(function (a, b) {
      return b.total - a.total;
    });

    graphs.forEach(function (d) {
      var $graph = $('<div class="graph clearfix">'),
        max = d.values.reduce(function (a, b) {
          return Math.max(a, b[1]);
        }, 0);

      $('<div class="max">')
        .html(max)
        .css('right', maxRightPosition + '%')
        .appendTo($graphs);

      $('<div class="name">')
        .html(d.name)
        .css('color', d.color)
        .appendTo($graphs);

      d.values.forEach(function (v) {
        var $period = $('<div class="period">')
          .data({time: v[0], value: v[1]})
          .css('width', periodWidth + '%')
          .appendTo($graph);

        $('<div class="bar">')
          .css('height', Graft.percent(v[1] / max) + '%')
          .appendTo($period);
      });

      $graph.appendTo($graphs);
    });

    $graphs
      .appendTo($el)
      .on('click', '.period', function (e) {
        var $this = $(this);

        $graphs
          .find('.period')
            .removeClass('active');

        $this.addClass('active');

        Graft.tooltip.show(e, [
          '<div class="start">' + (new Date($this.data('time')).toLocaleString()) + ' –</div>',
          '<div class="end">' + (new Date($this.data('time') + span).toLocaleString()) + '</div>',
          '<div class="bars value">' + $this.data('value') + '</div>'
        ].join(''));

        return false;
      });
  }

  return {
    bind: bind
  };
})();
