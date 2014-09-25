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

  function bind(sel, data) {
    var ts = Graft.timeseries(data),
      $graphs = Graft.graphs(ts);

    scale($graphs);

    $graphs
      .addClass('bars')
      .appendTo($(sel))
      .on('click', '.name', Graft.toggle)
      .on('click', '.interval', function (e) {
        var $this = $(this),
          start = new Date($this.data('time')).toLocaleString(),
          end = new Date($this.data('time') + ts.interval).toLocaleString();

        $graphs.find('.interval').removeClass('active');
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
    bind: bind,
    scale: scale
  };
})();
