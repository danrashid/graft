/* global Graft, $: false */
'use strict';

Graft.stack = (function() {
  function addIntervalClass($td, className) {
    var $stack = $td.closest('.stack');

    removeIntervalClass($stack, className);

    $stack.find('.set.first table td')
      .eq($td.index())
        .find('.interval')
          .addClass(className);
  }

  function removeIntervalClass($stack, className) {
    $stack.find('.interval').removeClass(className);
  }

  function scale($graphs) {
    var max = $graphs.data('max'),
      tops = [];

    $graphs.find('.interval').each(function () {
      var $interval = $(this),
        time = $interval.data('time'),
        value = $interval.data('value');

      $interval.find('.bar').each(function () {
        var height = Graft.percent(value / max),
          bottom = tops[time] || 0;

        $(this).css({
          height: height + '%',
          bottom: bottom + '%'
        });
        tops[time] = height + bottom;
      });
    });
  }

  function bind(sel, data) {
    var ts = Graft.timeseries(data),
      $graphs = Graft.graphs.bind(ts);

    scale($graphs);

    $graphs
      .addClass('stack')
      .appendTo($(sel))
      .on('mouseover', '.interval', function() {
        addIntervalClass($(this).closest('td'), 'hover');
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
    bind: bind,
    scale: scale
  };
})();
