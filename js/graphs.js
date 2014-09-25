/* global Graft, $: false */
'use strict';

Graft.graphs = function(ts, togglable) {
  var $graphs = $('<div class="graft">'),
    $sets = $('<div class="sets">');

  if (togglable) {
    $('<a class="toggle" href="#">Toggle')
      .appendTo($graphs);
  }

  $sets.appendTo($graphs);

  ts.sets.forEach(function (d) {
    var $set = $('<div class="set">'),
      $intervals = $('<div class="intervals">');

    $('<div><a class="name" href="#">' + d.name)
      .appendTo($set);

    $('<div class="max">')
      .html(d.max)
      .css('right', ts.rightEdge + '%')
      .appendTo($set);

    $intervals.appendTo($set);

    d.values.forEach(function (v) {
      $('<a class="interval" href="#">')
        .data({time: v[0], value: v[1]})
        .css('width', ts.intervalWidth + '%')
        .appendTo($intervals)
        .append('<div class="bar">');
    });

    $set
      .data({
        id: d.id,
        name: d.name,
        color: d.color,
        total: d.total,
        max: d.max
      })
      .addClass(d.color)
      .appendTo($sets)
      .append($intervals);
  });

  $('<div class="max">')
    .html(ts.max)
    .css('right', ts.rightEdge + '%')
    .appendTo($graphs);

  return $graphs
    .data({
      duration: ts.duration,
      interval: ts.interval,
      max: ts.max
    })
    .on('click', '.toggle', function () {
      $graphs.toggleClass('bars stack');

      if ($graphs.hasClass('bars')) {
        Graft.bars.scale($graphs);
      } else {
        Graft.stack.scale($graphs);
      }
      return false;
    });
};
