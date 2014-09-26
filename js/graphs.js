/* global Graft, $: false, Mustache: false */
'use strict';

Graft.graphs = (function() {
  var template = Graft.template('graphs');

  function bind(togglable) {
    Graft.data.sets.sort(function (a, b) {
      return b.total - a.total;
    });

    var $graphs = $(Mustache.render(template, Graft.data));

    if (!togglable) {
      $graphs.find('.toggle').hide();
    }

    $graphs.find('.set')
      .first()
        .addClass('first');

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
