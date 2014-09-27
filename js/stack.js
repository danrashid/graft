/* global Graft, $: false, Mustache: false */
'use strict';

Graft.stack = (function() {
  var tooltipTemplate = Graft.template('tooltip.stack');

  function addIntervalClass($interval, className) {
    var $stack = $interval.closest('.stack'),
      n = $interval.index() + 1;

    removeIntervalClass($stack, className);
    $stack.find('.set.first .interval:nth-child(' + n + ')').addClass(className);
  }

  function removeIntervalClass($stack, className) {
    $stack.find('.set.first .interval').removeClass(className);
  }

  function scale($graphs) {
    var tops = [];

    $graphs.find('.set').each(function () {
      var $set = $(this),
        set = Graft.lookup($set.data('id'));

      $(this).find('.bar').each(function (j) {
        var height = Graft.percent(set.values[j][1] / Graft.data.max),
          bottom = tops[j] || 0;

        $(this).css({
          height: height + '%',
          bottom: bottom + '%'
        });
        tops[j] = height + bottom;
      });
    });
  }

  function bind(sel) {
    var $graphs = Graft.graphs.bind();

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
      var i = $(this).index(),
        startTicks = Graft.data.sets[0].values[i][0],
        sets = Graft.data.sets.map(function (s) {
          return {
            name: s.name,
            color: s.color,
            value: s.values[i][1]
          };
        });

      sets.reverse();

      Graft.tooltip.show(e, Mustache.render(tooltipTemplate, {
        sets: sets,
        total: sets.reduce(function (a, b) {
          return a + b.value;
        }, 0),
        start: new Date(startTicks).toLocaleString(),
        end: new Date(startTicks + Graft.data.interval).toLocaleString()
      }));

      return false;
    });

  return {
    bind: bind,
    scale: scale
  };
})();
