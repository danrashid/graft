/* global Graft, $: false */
'use strict';

Graft.bars = (function() {

  function bind(sel, data) {
    var $el = $(sel),
      $graphs = $('<div class="graft bars">'),
      ts = Graft.timeseries(data);

    $('<div class="max">')
      .html(ts.max)
      .css('right', ts.rightEdge + '%')
      .appendTo($graphs);

    ts.sets.forEach(function (d) {
      var $set = $('<div class="set">');

      $set.addClass(d.color);

      $('<div class="name">')
        .html(d.name)
        .appendTo($set);

      d.values.forEach(function (v) {
        var $interval = $('<div class="interval">')
          .data({time: v[0], value: v[1]})
          .css('width', ts.intervalWidth + '%')
          .appendTo($set);

        $('<div class="bar">')
          .css('height', Graft.percent(v[1] / d.max) + '%')
          .appendTo($interval);
      });


      $('<div class="max">')
        .html(d.max)
        .css('right', ts.rightEdge + '%')
        .appendTo($set);

      $set
        .data(d)
        .appendTo($graphs);
    });

    $graphs
      .appendTo($el)
      .on('click', '.name', Graft.toggle)
      .on('click', '.interval', function (e) {
        var $this = $(this),
          start = new Date($this.data('time')).toLocaleString(),
          end = new Date($this.data('time') + ts.interval).toLocaleString();

        $graphs
          .find('.interval')
            .removeClass('active');

        $this.addClass('active');

        Graft.tooltip.show(e, [
          '<div class="bars value">' + $this.data('value') + '</div>',
          '<div class="start">' + start + ' –</div>',
          '<div class="end">' + end + '</div>'
        ].join(''));

        return false;
      });
  }

  return {
    bind: bind
  };
})();
