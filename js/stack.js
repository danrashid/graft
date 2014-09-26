/* global Graft, $: false, Mustache: false */
'use strict';

Graft.stack = (function() {
  var tooltipTemplate = Graft.template('tooltip.stack');

  function addIntervalClass($td, className) {
    var $stack = $td.closest('.stack'),
      n = $td.index() + 1;

    removeIntervalClass($stack, className);
    $stack.find('.set.first .interval:nth-child(' + n + ')').addClass(className);
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
      addIntervalClass($(this), 'hover');
    })
    .on('mouseout', '.graft.stack', function () {
      removeIntervalClass($(this), 'hover');
    })
    .on('click', '.graft.stack .interval', function (e) {
      var $interval = $(this),
        $stack = $interval.closest('.stack'),
        startTicks = $interval.data('time'),
        total = 0,
        sets = [];

      $stack.find('.set').each(function () {
        var $set = $(this),
          n = $interval.index() + 1,
          value = $set.find('table .interval:nth-child(' + n + ')').data('value');

        sets.unshift({
          color: $set.data('color'),
          value: value,
          name: $set.data('name')
        });
        total += value;
      });

      Graft.tooltip.show(e, Mustache.render(tooltipTemplate, {
        sets: sets,
        total: total,
        start: new Date(startTicks).toLocaleString(),
        end: new Date(startTicks + $stack.data('interval')).toLocaleString()
      }));

      return false;
    });

  return {
    bind: bind,
    scale: scale
  };
})();
