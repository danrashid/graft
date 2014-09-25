/* global Graft, $: false */
'use strict';

Graft.graphs = function(ts) {
  var $graphs = $('<div class="graft">');

  ts.sets.forEach(function (d) {
    var $set = $('<div class="set">');

    $('<div><a class="name" href="#">' + d.name)
      .appendTo($set);

    d.values.forEach(function (v) {
      $('<a class="interval" href="#">')
        .data({time: v[0], value: v[1]})
        .css('width', ts.intervalWidth + '%')
        .appendTo($set)
        .append('<div class="bar">');
    });


    $('<div class="max">')
      .html(d.max)
      .css('right', ts.rightEdge + '%')
      .appendTo($set);

    $set
      .data({
        id: d.id,
        name: d.name,
        color: d.color,
        total: d.total,
        max: d.max
      })
      .addClass(d.color)
      .appendTo($graphs);
  });

  $('<div class="max">')
    .html(ts.max)
    .css('right', ts.rightEdge + '%')
    .appendTo($graphs);

  return $graphs.data({
    duration: ts.duration,
    interval: ts.interval,
    max: ts.max
  });
};
