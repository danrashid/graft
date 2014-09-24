/* global Graft, $: false */
'use strict';

Graft.stack = (function() {

  function addIntervalClass($interval, className) {
    removeIntervalClass($interval, className)
      .eq($interval.index())
        .addClass(className);
  }

  function removeIntervalClass($interval, className) {
    return $interval.closest('.stack')
      .find('.set:first-child .interval')
        .removeClass(className);
  }

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
          $interval = $('<a class="interval" href="#">')
            .data({time: v[0], value: v[1]})
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
        addIntervalClass($(this), 'hover');
      })
      .on('mouseout', function () {
        removeIntervalClass($(this), 'hover');
      })
      .on('click', '.interval', function (e) {
        var $this = $(this),
          start = new Date($this.data('time')).toLocaleString(),
          end = new Date($this.data('time') + ts.interval).toLocaleString(),
          total = 0,
          rows = [];

        addIntervalClass($this, 'active');

        ts.sets.forEach(function (s) {
          var value = s.values[$this.index()][1];

          rows.unshift('<tr class="name ' + s.color + '"><th>' + value + '</th><td>' + s.name + '</td></tr>');
          total += value;
        });

        rows.push('<tr class="total"><th>' + total + '</th><td>Total</td></tr>');

        Graft.tooltip.show(e, [
          '<table>',
          rows.join(''),
          '</table>',
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
