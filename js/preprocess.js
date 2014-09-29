/* global Graft */
'use strict';

Graft.preprocess = function (data) {
  var times = data[0].values.map(function (v) {
      return v[0];
    }),

    total = data.reduce(function (a, b) {
      return a + b.values.reduce(function (c, d) {
        return c + d[1];
      }, 0);
    }, 0),

    max = times.map(function (t, i) {
      return data.reduce(function (a, b) {
        return a + b.values[i][1];
      }, 0);
    }).reduce(function (a, b) {
      return Math.max(a, b);
    }, 0),

    duration = times[times.length - 1] - times[0],

    interval = times[1] - times[0],

    sets = data.map(function (d, i) {
      var setTotal = d.values.reduce(function (a, b) {
          return a + b[1];
        }, 0),
        ratio = setTotal / total;

      return {
        id: i,
        name: d.name,
        color: d.color,
        values: d.values,
        total: setTotal,
        ratio: ratio,
        percent: Graft.percent(ratio, 2),
        max: d.values.reduce(function (a, b) {
          return Math.max(a, b[1]);
        }, 0),
        sqrt: Math.sqrt(setTotal)
      };
    }),

    maxSetTotal = sets.reduce(function (a, b) {
      return Math.max(a, b.total);
    }, 0),

    maxSqrt = sets.reduce(function (a, b) {
      return Math.max(a, b.sqrt);
    }, 0);

  return {
    total: total,
    max: max,
    duration: duration,
    interval: interval,
    sets: sets,
    maxSetTotal: maxSetTotal,
    maxSqrt: maxSqrt
  };
};
