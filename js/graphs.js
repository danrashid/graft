/* global Graft, $: false, Mustache: false */
'use strict';

Graft.graphs = (function() {
  var template = Graft.template('graphs');

  function bind(ts, togglable) {
    var html = Mustache.render(template, $.extend(ts, {
        togglable: togglable
      })),
      $graphs = $(html);

    $graphs.find('.info').each(function (i) {
      $(this).data({id: ts.sets[i].id});
    });

    $graphs.find('.set').each(function (i) {
      var set = ts.sets[i];

      $(this)
        .addClass(i === 0 ? 'first' : null)
        .data({
          id: set.id,
          name: set.name,
          color: set.color,
          total: set.total,
          max: set.max
        })
        .find('.interval').each(function (i) {
          var v = set.values[i];

          $(this).data({time: v[0], value: v[1]});
        });
    });

    $graphs.data({
      duration: ts.duration,
      interval: ts.interval,
      max: ts.max
    });

    return $graphs;
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
