/* global Graft, $: false */
'use strict';

Graft.graphs = (function() {
  var $headingTemplate = $('.graft.templates .heading'),
    $infoTemplate = $('.graft.templates .info'),
    $setTemplate = $('.graft.templates .set');

  function bind(ts, togglable) {
    var $graphs = $('<table class="graft">'),
      $headingRow = $headingTemplate.clone().appendTo($graphs);

    if (!togglable) {
      $headingRow.find('.toggle').hide();
    }
    $headingRow.find('.max').html(ts.max);

    ts.sets.forEach(function (d, i) {
      var $infoRow = $infoTemplate.clone().appendTo($graphs).addClass(d.color).data({id: d.id}),
        $setRow = $setTemplate.clone().appendTo($graphs).addClass(i === 0 ? 'first' : null),
        $intervalRow = $setRow.find('tr');

      $infoRow.find('.name').html(d.name);
      $infoRow.find('.max').html(d.max);

      d.values.forEach(function (v) {
        var $cell = $('<td>').appendTo($intervalRow);

        $('<a class="interval" href="#">')
          .data({time: v[0], value: v[1]})
          .appendTo($cell)
          .append('<div class="bar">&nbsp;');
      });

      $setRow
        .data({
          id: d.id,
          name: d.name,
          color: d.color,
          total: d.total,
          max: d.max
        })
        .addClass(d.color);
    });

    return $graphs.data({
      duration: ts.duration,
      interval: ts.interval,
      max: ts.max
    });
  }

  $(document).on('click', '.graft .toggle', function () {
    var $graphs = $(this).closest('.graft'),
      $tables = $graphs.find('table'),
      height = $graphs.height();

    $graphs.toggleClass('bars stack');

    if ($graphs.hasClass('bars')) {
      $tables.css('height', null);
      Graft.bars.scale($graphs);
    } else {
      $tables.css('height', height);
      Graft.stack.scale($graphs);
    }
    return false;
  });

  return {
    bind: bind
  };
})();
