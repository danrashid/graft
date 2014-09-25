/* global Graft */
'use strict';

Graft.timeseries = function (data) {
  var times = data[0].values.map(function (v) {
      return v[0];
    }),
    ret = {
      sets: data.map(function (d, i) {
        return {
          id: i,
          name: d.name,
          color: d.color,
          values: d.values,
          total: d.values.reduce(function (a, b) {
            return a + b[1];
          }, 0),
          max: d.values.reduce(function (a, b) {
            return Math.max(a, b[1]);
          }, 0)
        };
      }),
      duration: times[times.length - 1] - times[0],
      interval: times[1] - times[0]
    };

  ret.max = times.map(function (t, i) {
    return data.reduce(function (a, b) {
      return a + b.values[i][1];
    }, 0);
  }).reduce(function (a, b) {
    return Math.max(a, b);
  }, 0);

  ret.sets.sort(function (a, b) {
    return b.total - a.total;
  });

  return ret;
};
