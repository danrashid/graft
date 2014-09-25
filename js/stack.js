/* global Graft, $: false */
'use strict';

Graft.stack = (function() {
  function addIntervalClass($td, className) {
    var $stack = $td.closest('.stack'),
      n = $td.index() + 1;

    removeIntervalClass($stack, className);
    $stack.find('.set.first table td:nth-child(' + n + ') .interval').addClass(className);
  }

  function removeIntervalClass($stack, className) {
    $stack.find('.set.first .interval').removeClass(className);
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
      .appendTo($(sel));
  }

  $(document)
    .on('mouseover', '.graft.stack .interval', function() {
      addIntervalClass($(this).closest('td'), 'hover');
    })
    .on('mouseout', '.graft.stack', function () {
      removeIntervalClass($(this), 'hover');
    })
    .on('click', '.graft.stack .interval', function (e) {
      var $interval = $(this),
        $td = $interval.closest('td'),
        $stack = $interval.closest('.stack'),
        startTicks = $interval.data('time'),
        start = new Date(startTicks).toLocaleString(),
        end = new Date(startTicks + $stack.data('interval')).toLocaleString(),
        total = 0,
        rows = [];

      $stack.find('.set').each(function () {
        var $set = $(this),
          n = $td.index() + 1,
          value = $set.find('table td:nth-child(' + n + ') .interval').data('value');

        rows.unshift('<tr class="name ' + $set.data('color') + '"><th>' + value + '</th><td>' + $set.data('name')+ '</td></tr>');
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

  return {
    bind: bind,
    scale: scale
  };
})();
