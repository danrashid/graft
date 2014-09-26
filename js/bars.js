/* global Graft, $: false, Mustache: false */
'use strict';

Graft.bars = (function() {
  var tooltipTemplate = Graft.template('tooltip.bars');

  function scale($graphs) {
    $graphs.find('.set').each(function () {
      var $set = $(this),
        set = Graft.lookup($set.data('id'));

      $set.find('.bar').each(function (i) {
        $(this).css({
          height: Graft.percent(set.values[i][1] / set.max) + '%',
          bottom: null
        });
      });
    });
  }

  function bind(sel, togglable) {
    var $graphs = Graft.graphs.bind(togglable);

    scale($graphs);

    $graphs
      .addClass('bars')
      .appendTo($(sel));
  }

  $(document)
    .on('click', '.graft.bars .name', Graft.toggle)
    .on('click', '.graft.bars .interval', function (e) {
      var $interval = $(this),
        set = Graft.lookup($interval.closest('.set').data('id')),
        interval = set.values[$interval.index()];

      Graft.tooltip.show(e, Mustache.render(tooltipTemplate, {
        value: interval[1],
        start: new Date(interval[0]).toLocaleString(),
        end: new Date(interval[0] + Graft.data.interval).toLocaleString()
      }));

      return false;
    });

  return {
    bind: bind,
    scale: scale
  };
})();
