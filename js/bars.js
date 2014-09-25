/* global Graft, $: false */
'use strict';

Graft.bars = (function() {
  function scale($graphs) {
    $graphs.find('.set').each(function () {
      var $set = $(this),
        max = $set.data('max');

      $set.find('.interval').each(function () {
        var $interval = $(this),
          value = $interval.data('value');

        $interval.find('.bar').css({
          height: Graft.percent(value / max) + '%',
          bottom: null
        });
      });
    });
  }

  function bind(sel, data, togglable) {
    var ts = Graft.timeseries(data),
      $graphs = Graft.graphs.bind(ts, togglable);

    scale($graphs);

    $graphs
      .addClass('bars')
      .appendTo($(sel));
  }

  $(document)
    .on('click', '.graft.bars .name', Graft.toggle)
    .on('click', '.graft.bars .interval', function (e) {
      var $interval = $(this),
        interval = $interval.closest('.bars').data('interval'),
        startTicks = $interval.data('time'),
        start = new Date(startTicks).toLocaleString(),
        end = new Date(startTicks + interval).toLocaleString();

      Graft.tooltip.show(e, [
        '<div class="bars value">' + $interval.data('value') + '</div>',
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
