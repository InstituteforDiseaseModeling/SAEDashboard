; window.NREUM || (NREUM = {}); NREUM.init = {distributed_tracing: {enabled: true}, privacy: {cookies_enabled: false}, ajax: {deny_list: ['bam.nr-data.net']}};

;NREUM.loader_config={accountID: '1457659', trustKey: '1457659', agentID: '1134254271', licenseKey: 'eb64bef4dd', applicationID: '1134254271'}
;NREUM.info={beacon: 'bam.nr-data.net', errorBeacon: 'bam.nr-data.net', licenseKey: 'eb64bef4dd', applicationID: '1134254271', sa: 1};

window.NREUM || (NREUM = {}), __nr_require = function(t, e, n) {
  function r(n) {
    if (!e[n]) {
      const o = e[n] = {exports: {}}; t[n][0].call(o.exports, function(e) {
        const o = t[n][1][e]; return r(o || e);
      }, o, o.exports);
    } return e[n].exports;
  } if ('function' == typeof __nr_require) return __nr_require; for (let o = 0; o < n.length; o++)r(n[o]); return r;
}({'1': [function(t, e, n) {
  function r(t) {
    try {
      s.console && console.log(t);
    } catch (e) { }
  } let o; const i = t('ee'); const a = t(31); var s = {}; try {
    o = localStorage.getItem('__nr_flags').split(','), console && 'function' == typeof console.log && (s.console = !0, o.indexOf('dev') !== -1 && (s.dev = !0), o.indexOf('nr_dev') !== -1 && (s.nrDev = !0));
  } catch (c) { } s.nrDev && i.on('internal-error', function(t) {
    r(t.stack);
  }), s.dev && i.on('fn-err', function(t, e, n) {
    r(n.stack);
  }), s.dev && (r('NR AGENT IN DEVELOPMENT MODE'), r('flags: ' + a(s, function(t, e) {
    return t;
  }).join(', ')));
}, {}], '2': [function(t, e, n) {
  function r(t, e, n, r, s) {
    try {
 l ? l -= 1 : o(s || new UncaughtException(t, e, n), !0);
    } catch (f) {
      try {
        i('ierr', [f, c.now(), !0]);
      } catch (d) { }
    } return 'function' == typeof u && u.apply(this, a(arguments));
  } function UncaughtException(t, e, n) {
    this.message = t || 'Uncaught error with no additional information', this.sourceURL = e, this.line = n;
  } function o(t, e) {
    const n = e ? null : c.now(); i('err', [t, n]);
  } var i = t('handle'); var a = t(32); const s = t('ee'); var c = t('loader'); const f = t('gos'); var u = window.onerror; let d = !1; const p = 'nr@seenError'; if (!c.disabled) {
    var l = 0; c.features.err = !0, t(1), window.onerror = r; try {
      throw new Error;
    } catch (h) {
      'stack' in h && (t(14), t(13), 'addEventListener' in window && t(7), c.xhrWrappable && t(15), d = !0);
    } s.on('fn-start', function(t, e, n) {
      d && (l += 1);
    }), s.on('fn-err', function(t, e, n) {
      d && !n[p] && (f(n, p, function() {
        return !0;
      }), this.thrown = !0, o(n));
    }), s.on('fn-end', function() {
      d && !this.thrown && l > 0 && (l -= 1);
    }), s.on('internal-error', function(t) {
      i('ierr', [t, c.now(), !0]);
    });
  }
}, {}], '3': [function(t, e, n) {
  const r = t('loader'); r.disabled || (r.features.ins = !0);
}, {}], '4': [function(t, e, n) {
  function r() {
    U++, L = g.hash, this[u] = y.now();
  } function o() {
    U--, g.hash !== L && i(0, !0); const t = y.now(); this[h] = ~~this[h] + t - this[u], this[d] = t;
  } function i(t, e) {
    E.emit('newURL', ['' + g, e]);
  } function a(t, e) {
    t.on(e, function() {
      this[e] = y.now();
    });
  } const s = '-start'; const c = '-end'; const f = '-body'; var u = 'fn' + s; var d = 'fn' + c; const p = 'cb' + s; const l = 'cb' + c; var h = 'jsTime'; const m = 'fetch'; const v = 'addEventListener'; const w = window; var g = w.location; var y = t('loader'); if (w[v] && y.xhrWrappable && !y.disabled) {
    const x = t(11); const b = t(12); var E = t(9); const R = t(7); const O = t(14); const T = t(8); const S = t(15); const P = t(10); const M = t('ee'); const C = M.get('tracer'); const N = t(23); t(17), y.features.spa = !0; var L; var U = 0; M.on(u, r), b.on(p, r), P.on(p, r), M.on(d, o), b.on(l, o), P.on(l, o), M.buffer([u, d, 'xhr-resolved']), R.buffer([u]), O.buffer(['setTimeout' + c, 'clearTimeout' + s, u]), S.buffer([u, 'new-xhr', 'send-xhr' + s]), T.buffer([m + s, m + '-done', m + f + s, m + f + c]), E.buffer(['newURL']), x.buffer([u]), b.buffer(['propagate', p, l, 'executor-err', 'resolve' + s]), C.buffer([u, 'no-' + u]), P.buffer(['new-jsonp', 'cb-start', 'jsonp-error', 'jsonp-end']), a(T, m + s), a(T, m + '-done'), a(P, 'new-jsonp'), a(P, 'jsonp-end'), a(P, 'cb-start'), E.on('pushState-end', i), E.on('replaceState-end', i), w[v]('hashchange', i, N(!0)), w[v]('load', i, N(!0)), w[v]('popstate', function() {
      i(0, U > 1);
    }, N(!0));
  }
}, {}], '5': [function(t, e, n) {
  function r() {
    const t = new PerformanceObserver(function(t, e) {
      const n = t.getEntries(); s(v, [n]);
    }); try {
      t.observe({entryTypes: ['resource']});
    } catch (e) { }
  } function o(t) {
    if (s(v, [window.performance.getEntriesByType(w)]), window.performance['c' + p]) {
      try {
        window.performance[h](m, o, !1);
      } catch (t) { }
    } else {
      try {
        window.performance[h]('webkit' + m, o, !1);
      } catch (t) { }
    }
  } function i(t) { } if (window.performance && window.performance.timing && window.performance.getEntriesByType) {
    const a = t('ee'); var s = t('handle'); const c = t(14); const f = t(13); const u = t(6); const d = t(23); var p = 'learResourceTimings'; const l = 'addEventListener'; var h = 'removeEventListener'; var m = 'resourcetimingbufferfull'; var v = 'bstResource'; var w = 'resource'; const g = '-start'; const y = '-end'; const x = 'fn' + g; const b = 'fn' + y; const E = 'bstTimer'; const R = 'pushState'; const O = t('loader'); if (!O.disabled) {
      O.features.stn = !0, t(9), 'addEventListener' in window && t(7); const T = NREUM.o.EV; a.on(x, function(t, e) {
        const n = t[0]; n instanceof T && (this.bstStart = O.now());
      }), a.on(b, function(t, e) {
        const n = t[0]; n instanceof T && s('bst', [n, e, this.bstStart, O.now()]);
      }), c.on(x, function(t, e, n) {
        this.bstStart = O.now(), this.bstType = n;
      }), c.on(b, function(t, e) {
        s(E, [e, this.bstStart, O.now(), this.bstType]);
      }), f.on(x, function() {
        this.bstStart = O.now();
      }), f.on(b, function(t, e) {
        s(E, [e, this.bstStart, O.now(), 'requestAnimationFrame']);
      }), a.on(R + g, function(t) {
        this.time = O.now(), this.startPath = location.pathname + location.hash;
      }), a.on(R + y, function(t) {
        s('bstHist', [location.pathname + location.hash, this.startPath, this.time]);
      }), u() ? (s(v, [window.performance.getEntriesByType('resource')]), r()) : l in window.performance && (window.performance['c' + p] ? window.performance[l](m, o, d(!1)) : window.performance[l]('webkit' + m, o, d(!1))), document[l]('scroll', i, d(!1)), document[l]('keypress', i, d(!1)), document[l]('click', i, d(!1));
    }
  }
}, {}], '6': [function(t, e, n) {
  e.exports = function() {
    return 'PerformanceObserver' in window && 'function' == typeof window.PerformanceObserver;
  };
}, {}], '7': [function(t, e, n) {
  function r(t) {
    for (var e = t; e && !e.hasOwnProperty(u);)e = Object.getPrototypeOf(e); e && o(e);
  } function o(t) {
    s.inPlace(t, [u, d], '-', i);
  } function i(t, e) {
    return t[1];
  } const a = t('ee').get('events'); var s = t('wrap-function')(a, !0); const c = t('gos'); const f = XMLHttpRequest; var u = 'addEventListener'; var d = 'removeEventListener'; e.exports = a, 'getPrototypeOf' in Object ? (r(document), r(window), r(f.prototype)) : f.prototype.hasOwnProperty(u) && (o(window), o(f.prototype)), a.on(u + '-start', function(t, e) {
    const n = t[1]; if (null !== n && ('function' == typeof n || 'object' == typeof n)) {
      const r = c(n, 'nr@wrapped', function() {
        function t() {
          if ('function' == typeof n.handleEvent) return n.handleEvent.apply(n, arguments);
        } const e = {'object': t, 'function': n}[typeof n]; return e ? s(e, 'fn-', null, e.name || 'anonymous') : n;
      }); this.wrapped = t[1] = r;
    }
  }), a.on(d + '-start', function(t) {
    t[1] = this.wrapped || t[1];
  });
}, {}], '8': [function(t, e, n) {
  function r(t, e, n) {
    const r = t[e]; 'function' == typeof r && (t[e] = function() {
      const t = i(arguments); const e = {}; o.emit(n + 'before-start', [t], e); let a; e[m] && e[m].dt && (a = e[m].dt); const s = r.apply(this, t); return o.emit(n + 'start', [t, a], s), s.then(function(t) {
        return o.emit(n + 'end', [null, t], s), t;
      }, function(t) {
        throw (o.emit(n + 'end', [t], s), t);
      });
    });
  } var o = t('ee').get('fetch'); var i = t(32); const a = t(31); e.exports = o; const s = window; const c = 'fetch-'; const f = c + 'body-'; const u = ['arrayBuffer', 'blob', 'json', 'text', 'formData']; const d = s.Request; const p = s.Response; const l = s.fetch; const h = 'prototype'; var m = 'nr@context'; d && p && l && (a(u, function(t, e) {
    r(d[h], e, f), r(p[h], e, f);
  }), r(s, 'fetch', c), o.on(c + 'end', function(t, e) {
    const n = this; if (e) {
      const r = e.headers.get('content-length'); null !== r && (n.rxSize = r), o.emit(c + 'done', [null, e], n);
    } else o.emit(c + 'done', [t], n);
  }));
}, {}], '9': [function(t, e, n) {
  const r = t('ee').get('history'); const o = t('wrap-function')(r); e.exports = r; const i = window.history && window.history.constructor && window.history.constructor.prototype; let a = window.history; i && i.pushState && i.replaceState && (a = i), o.inPlace(a, ['pushState', 'replaceState'], '-');
}, {}], '10': [function(t, e, n) {
  function r(t) {
    function e() {
      f.emit('jsonp-end', [], l), t.removeEventListener('load', e, c(!1)), t.removeEventListener('error', n, c(!1));
    } function n() {
      f.emit('jsonp-error', [], l), f.emit('jsonp-end', [], l), t.removeEventListener('load', e, c(!1)), t.removeEventListener('error', n, c(!1));
    } const r = t && 'string' == typeof t.nodeName && 'script' === t.nodeName.toLowerCase(); if (r) {
      const o = 'function' == typeof t.addEventListener; if (o) {
        const a = i(t.src); if (a) {
          const d = s(a); const p = 'function' == typeof d.parent[d.key]; if (p) {
            var l = {}; u.inPlace(d.parent, [d.key], 'cb-', l), t.addEventListener('load', e, c(!1)), t.addEventListener('error', n, c(!1)), f.emit('new-jsonp', [t.src], l);
          }
        }
      }
    }
  } function o() {
    return 'addEventListener' in window;
  } function i(t) {
    const e = t.match(d); return e ? e[1] : null;
  } function a(t, e) {
    const n = t.match(l); const r = n[1]; const o = n[3]; return o ? a(o, e[r]) : e[r];
  } function s(t) {
    const e = t.match(p); return e && e.length >= 3 ? {key: e[2], parent: a(e[1], window)} : {key: t, parent: window};
  } var c = t(23); var f = t('ee').get('jsonp'); var u = t('wrap-function')(f); if (e.exports = f, o()) {
    var d = /[?&](?:callback|cb)=([^&#]+)/; var p = /(.*)\.([^.]+)/; var l = /^(\w+)(\.|$)(.*)$/; const h = ['appendChild', 'insertBefore', 'replaceChild']; Node && Node.prototype && Node.prototype.appendChild ? u.inPlace(Node.prototype, h, 'dom-') : (u.inPlace(HTMLElement.prototype, h, 'dom-'), u.inPlace(HTMLHeadElement.prototype, h, 'dom-'), u.inPlace(HTMLBodyElement.prototype, h, 'dom-')), f.on('dom-start', function(t) {
      r(t[0]);
    });
  }
}, {}], '11': [function(t, e, n) {
  const r = t('ee').get('mutation'); const o = t('wrap-function')(r); const i = NREUM.o.MO; e.exports = r, i && (window.MutationObserver = function(t) {
    return this instanceof i ? new i(o(t, 'fn-')) : i.apply(this, arguments);
  }, MutationObserver.prototype = i.prototype);
}, {}], '12': [function(t, e, n) {
  function r(t) {
    const e = i.context(); const n = s(t, 'executor-', e, null, !1); const r = new f(n); return i.context(r).getCtx = function() {
      return e;
    }, r;
  } const o = t('wrap-function'); var i = t('ee').get('promise'); const a = t('ee').getOrSetContext; var s = o(i); const c = t(31); var f = NREUM.o.PR; e.exports = i, f && (window.Promise = r, ['all', 'race'].forEach(function(t) {
    const e = f[t]; f[t] = function(n) {
      function r(t) {
        return function() {
          i.emit('propagate', [null, !o], a, !1, !1), o = o || !t;
        };
      } var o = !1; c(n, function(e, n) {
        Promise.resolve(n).then(r('all' === t), r(!1));
      }); var a = e.apply(f, arguments); const s = f.resolve(a); return s;
    };
  }), ['resolve', 'reject'].forEach(function(t) {
    const e = f[t]; f[t] = function(t) {
      const n = e.apply(f, arguments); return t !== n && i.emit('propagate', [t, !0], n, !1, !1), n;
    };
  }), f.prototype['catch'] = function(t) {
    return this.then(null, t);
  }, f.prototype = Object.create(f.prototype, {constructor: {value: r}}), c(Object.getOwnPropertyNames(f), function(t, e) {
    try {
      r[e] = f[e];
    } catch (n) { }
  }), o.wrapInPlace(f.prototype, 'then', function(t) {
    return function() {
      const e = this; const n = o.argsToArray.apply(this, arguments); const r = a(e); r.promise = e, n[0] = s(n[0], 'cb-', r, null, !1), n[1] = s(n[1], 'cb-', r, null, !1); const c = t.apply(this, n); return r.nextPromise = c, i.emit('propagate', [e, !0], c, !1, !1), c;
    };
  }), i.on('executor-start', function(t) {
    t[0] = s(t[0], 'resolve-', this, null, !1), t[1] = s(t[1], 'resolve-', this, null, !1);
  }), i.on('executor-err', function(t, e, n) {
    t[1](n);
  }), i.on('cb-end', function(t, e, n) {
    i.emit('propagate', [n, !0], this.nextPromise, !1, !1);
  }), i.on('propagate', function(t, e, n) {
    this.getCtx && !e || (this.getCtx = function() {
      if (t instanceof Promise) var e = i.context(t); return e && e.getCtx ? e.getCtx() : this;
    });
  }), r.toString = function() {
    return '' + f;
  });
}, {}], '13': [function(t, e, n) {
  const r = t('ee').get('raf'); const o = t('wrap-function')(r); const i = 'equestAnimationFrame'; e.exports = r, o.inPlace(window, ['r' + i, 'mozR' + i, 'webkitR' + i, 'msR' + i], 'raf-'), r.on('raf-start', function(t) {
    t[0] = o(t[0], 'fn-');
  });
}, {}], '14': [function(t, e, n) {
  function r(t, e, n) {
    t[0] = a(t[0], 'fn-', null, n);
  } function o(t, e, n) {
    this.method = n, this.timerDuration = isNaN(t[1]) ? 0 : +t[1], t[0] = a(t[0], 'fn-', this, n);
  } const i = t('ee').get('timer'); var a = t('wrap-function')(i); const s = 'setTimeout'; const c = 'setInterval'; const f = 'clearTimeout'; const u = '-start'; const d = '-'; e.exports = i, a.inPlace(window, [s, 'setImmediate'], s + d), a.inPlace(window, [c], c + d), a.inPlace(window, [f, 'clearImmediate'], f + d), i.on(c + u, r), i.on(s + u, o);
}, {}], '15': [function(t, e, n) {
  function r(t, e) {
    d.inPlace(e, ['onreadystatechange'], 'fn-', s);
  } function o() {
    const t = this; const e = u.context(t); t.readyState > 3 && !e.resolved && (e.resolved = !0, u.emit('xhr-resolved', [], t)), d.inPlace(t, y, 'fn-', s);
  } function i(t) {
    x.push(t), m && (E ? E.then(a) : w ? w(a) : (R = -R, O.data = R));
  } function a() {
    for (let t = 0; t < x.length; t++)r([], x[t]); x.length && (x = []);
  } function s(t, e) {
    return e;
  } function c(t, e) {
    for (const n in t) e[n] = t[n]; return e;
  } t(7); const f = t('ee'); var u = f.get('xhr'); var d = t('wrap-function')(u); const p = t(23); const l = NREUM.o; const h = l.XHR; var m = l.MO; const v = l.PR; var w = l.SI; const g = 'readystatechange'; var y = ['onload', 'onerror', 'onabort', 'onloadstart', 'onloadend', 'onprogress', 'ontimeout']; var x = []; e.exports = u; const b = window.XMLHttpRequest = function(t) {
    const e = new h(t); try {
      u.emit('new-xhr', [e], e), e.addEventListener(g, o, p(!1));
    } catch (n) {
      try {
        u.emit('internal-error', [n]);
      } catch (r) { }
    } return e;
  }; if (c(h, b), b.prototype = h.prototype, d.inPlace(b.prototype, ['open', 'send'], '-xhr-', s), u.on('send-xhr-start', function(t, e) {
    r(t, e), i(e);
  }), u.on('open-xhr-start', r), m) {
    var E = v && v.resolve(); if (!w && !v) {
      var R = 1; var O = document.createTextNode(R); new m(a).observe(O, {characterData: !0});
    }
  } else {
    f.on('fn-end', function(t) {
      t[0] && t[0].type === g || a();
    });
  }
}, {}], '16': [function(t, e, n) {
  function r(t) {
    if (!s(t)) return null; const e = window.NREUM; if (!e.loader_config) return null; const n = (e.loader_config.accountID || '').toString() || null; const r = (e.loader_config.agentID || '').toString() || null; const f = (e.loader_config.trustKey || '').toString() || null; if (!n || !r) return null; const h = l.generateSpanId(); const m = l.generateTraceId(); const v = Date.now(); const w = {spanId: h, traceId: m, timestamp: v}; return (t.sameOrigin || c(t) && p()) && (w.traceContextParentHeader = o(h, m), w.traceContextStateHeader = i(h, v, n, r, f)), (t.sameOrigin && !u() || !t.sameOrigin && c(t) && d()) && (w.newrelicHeader = a(h, m, v, n, r, f)), w;
  } function o(t, e) {
    return '00-' + e + '-' + t + '-01';
  } function i(t, e, n, r, o) {
    const i = 0; const a = ''; const s = 1; const c = ''; const f = ''; return o + '@nr=' + i + '-' + s + '-' + n + '-' + r + '-' + t + '-' + a + '-' + c + '-' + f + '-' + e;
  } function a(t, e, n, r, o, i) {
    const a = 'btoa' in window && 'function' == typeof window.btoa; if (!a) return null; const s = {v: [0, 1], d: {ty: 'Browser', ac: r, ap: o, id: t, tr: e, ti: n}}; return i && r !== i && (s.d.tk = i), btoa(JSON.stringify(s));
  } function s(t) {
    return f() && c(t);
  } function c(t) {
    let e = !1; let n = {}; if ('init' in NREUM && 'distributed_tracing' in NREUM.init && (n = NREUM.init.distributed_tracing), t.sameOrigin) e = !0; else if (n.allowed_origins instanceof Array) {
      for (let r = 0; r < n.allowed_origins.length; r++) {
        const o = h(n.allowed_origins[r]); if (t.hostname === o.hostname && t.protocol === o.protocol && t.port === o.port) {
          e = !0; break;
        }
      }
    } return e;
  } function f() {
    return 'init' in NREUM && 'distributed_tracing' in NREUM.init && !!NREUM.init.distributed_tracing.enabled;
  } function u() {
    return 'init' in NREUM && 'distributed_tracing' in NREUM.init && !!NREUM.init.distributed_tracing.exclude_newrelic_header;
  } function d() {
    return 'init' in NREUM && 'distributed_tracing' in NREUM.init && NREUM.init.distributed_tracing.cors_use_newrelic_header !== !1;
  } function p() {
    return 'init' in NREUM && 'distributed_tracing' in NREUM.init && !!NREUM.init.distributed_tracing.cors_use_tracecontext_headers;
  } var l = t(28); var h = t(18); e.exports = {generateTracePayload: r, shouldGenerateTrace: s};
}, {}], '17': [function(t, e, n) {
  function r(t) {
    const e = this.params; const n = this.metrics; if (!this.ended) {
      this.ended = !0; for (let r = 0; r < p; r++)t.removeEventListener(d[r], this.listener, !1); return e.protocol && 'data' === e.protocol ? void g('Ajax/DataUrl/Excluded') : void (e.aborted || (n.duration = a.now() - this.startTime, this.loadCaptureCalled || 4 !== t.readyState ? null == e.status && (e.status = 0) : i(this, t), n.cbTime = this.cbTime, s('xhr', [e, n, this.startTime, this.endTime, 'xhr'], this)));
    }
  } function o(t, e) {
    const n = c(e); const r = t.params; r.hostname = n.hostname, r.port = n.port, r.protocol = n.protocol, r.host = n.hostname + ':' + n.port, r.pathname = n.pathname, t.parsedOrigin = n, t.sameOrigin = n.sameOrigin;
  } function i(t, e) {
    t.params.status = e.status; const n = v(e, t.lastSize); if (n && (t.metrics.rxSize = n), t.sameOrigin) {
      const r = e.getResponseHeader('X-NewRelic-App-Data'); r && (t.params.cat = r.split(', ').pop());
    } t.loadCaptureCalled = !0;
  } var a = t('loader'); if (a.xhrWrappable && !a.disabled) {
    var s = t('handle'); var c = t(18); const f = t(16).generateTracePayload; const u = t('ee'); var d = ['load', 'error', 'abort', 'timeout']; var p = d.length; const l = t('id'); const h = t(24); const m = t(22); var v = t(19); const w = t(23); var g = t(25).recordSupportability; const y = NREUM.o.REQ; const x = window.XMLHttpRequest; a.features.xhr = !0, t(15), t(8), u.on('new-xhr', function(t) {
      const e = this; e.totalCbs = 0, e.called = 0, e.cbTime = 0, e.end = r, e.ended = !1, e.xhrGuids = {}, e.lastSize = null, e.loadCaptureCalled = !1, e.params = this.params || {}, e.metrics = this.metrics || {}, t.addEventListener('load', function(n) {
        i(e, t);
      }, w(!1)), h && (h > 34 || h < 10) || t.addEventListener('progress', function(t) {
        e.lastSize = t.loaded;
      }, w(!1));
    }), u.on('open-xhr-start', function(t) {
      this.params = {method: t[0]}, o(this, t[1]), this.metrics = {};
    }), u.on('open-xhr-end', function(t, e) {
      'loader_config' in NREUM && 'xpid' in NREUM.loader_config && this.sameOrigin && e.setRequestHeader('X-NewRelic-ID', NREUM.loader_config.xpid); const n = f(this.parsedOrigin); if (n) {
        let r = !1; n.newrelicHeader && (e.setRequestHeader('newrelic', n.newrelicHeader), r = !0), n.traceContextParentHeader && (e.setRequestHeader('traceparent', n.traceContextParentHeader), n.traceContextStateHeader && e.setRequestHeader('tracestate', n.traceContextStateHeader), r = !0), r && (this.dt = n);
      }
    }), u.on('send-xhr-start', function(t, e) {
      const n = this.metrics; const r = t[0]; const o = this; if (n && r) {
        const i = m(r); i && (n.txSize = i);
      } this.startTime = a.now(), this.listener = function(t) {
        try {
          'abort' !== t.type || o.loadCaptureCalled || (o.params.aborted = !0), ('load' !== t.type || o.called === o.totalCbs && (o.onloadCalled || 'function' != typeof e.onload)) && o.end(e);
        } catch (n) {
          try {
            u.emit('internal-error', [n]);
          } catch (r) { }
        }
      }; for (let s = 0; s < p; s++)e.addEventListener(d[s], this.listener, w(!1));
    }), u.on('xhr-cb-time', function(t, e, n) {
      this.cbTime += t, e ? this.onloadCalled = !0 : this.called += 1, this.called !== this.totalCbs || !this.onloadCalled && 'function' == typeof n.onload || this.end(n);
    }), u.on('xhr-load-added', function(t, e) {
      const n = '' + l(t) + !!e; this.xhrGuids && !this.xhrGuids[n] && (this.xhrGuids[n] = !0, this.totalCbs += 1);
    }), u.on('xhr-load-removed', function(t, e) {
      const n = '' + l(t) + !!e; this.xhrGuids && this.xhrGuids[n] && (delete this.xhrGuids[n], this.totalCbs -= 1);
    }), u.on('xhr-resolved', function() {
      this.endTime = a.now();
    }), u.on('addEventListener-end', function(t, e) {
      e instanceof x && 'load' === t[0] && u.emit('xhr-load-added', [t[1], t[2]], e);
    }), u.on('removeEventListener-end', function(t, e) {
      e instanceof x && 'load' === t[0] && u.emit('xhr-load-removed', [t[1], t[2]], e);
    }), u.on('fn-start', function(t, e, n) {
      e instanceof x && ('onload' === n && (this.onload = !0), ('load' === (t[0] && t[0].type) || this.onload) && (this.xhrCbStart = a.now()));
    }), u.on('fn-end', function(t, e) {
      this.xhrCbStart && u.emit('xhr-cb-time', [a.now() - this.xhrCbStart, this.onload, e], e);
    }), u.on('fetch-before-start', function(t) {
      function e(t, e) {
        let n = !1; return e.newrelicHeader && (t.set('newrelic', e.newrelicHeader), n = !0), e.traceContextParentHeader && (t.set('traceparent', e.traceContextParentHeader), e.traceContextStateHeader && t.set('tracestate', e.traceContextStateHeader), n = !0), n;
      } let n; const r = t[1] || {}; 'string' == typeof t[0] ? n = t[0] : t[0] && t[0].url ? n = t[0].url : window.URL && t[0] && t[0] instanceof URL && (n = t[0].href), n && (this.parsedOrigin = c(n), this.sameOrigin = this.parsedOrigin.sameOrigin); const o = f(this.parsedOrigin); if (o && (o.newrelicHeader || o.traceContextParentHeader)) {
        if ('string' == typeof t[0] || window.URL && t[0] && t[0] instanceof URL) {
          const i = {}; for (const a in r) i[a] = r[a]; i.headers = new Headers(r.headers || {}), e(i.headers, o) && (this.dt = o), t.length > 1 ? t[1] = i : t.push(i);
        } else t[0] && t[0].headers && e(t[0].headers, o) && (this.dt = o);
      }
    }), u.on('fetch-start', function(t, e) {
      this.params = {}, this.metrics = {}, this.startTime = a.now(), this.dt = e, t.length >= 1 && (this.target = t[0]), t.length >= 2 && (this.opts = t[1]); let n; const r = this.opts || {}; const i = this.target; if ('string' == typeof i ? n = i : 'object' == typeof i && i instanceof y ? n = i.url : window.URL && 'object' == typeof i && i instanceof URL && (n = i.href), o(this, n), 'data' !== this.params.protocol) {
        const s = ('' + (i && i instanceof y && i.method || r.method || 'GET')).toUpperCase(); this.params.method = s, this.txSize = m(r.body) || 0;
      }
    }), u.on('fetch-done', function(t, e) {
      if (this.endTime = a.now(), this.params || (this.params = {}), 'data' === this.params.protocol) return void g('Ajax/DataUrl/Excluded'); this.params.status = e ? e.status : 0; let n; 'string' == typeof this.rxSize && this.rxSize.length > 0 && (n = +this.rxSize); const r = {txSize: this.txSize, rxSize: n, duration: a.now() - this.startTime}; s('xhr', [this.params, r, this.startTime, this.endTime, 'fetch'], this);
    });
  }
}, {}], '18': [function(t, e, n) {
  const r = {}; e.exports = function(t) {
    if (t in r) return r[t]; if (0 === (t || '').indexOf('data:')) return {protocol: 'data'}; const e = document.createElement('a'); const n = window.location; const o = {}; e.href = t, o.port = e.port; const i = e.href.split('://'); !o.port && i[1] && (o.port = i[1].split('/')[0].split('@').pop().split(':')[1]), o.port && '0' !== o.port || (o.port = 'https' === i[0] ? '443' : '80'), o.hostname = e.hostname || n.hostname, o.pathname = e.pathname, o.protocol = i[0], '/' !== o.pathname.charAt(0) && (o.pathname = '/' + o.pathname); const a = !e.protocol || ':' === e.protocol || e.protocol === n.protocol; const s = e.hostname === document.domain && e.port === n.port; return o.sameOrigin = a && (!e.hostname || s), '/' === o.pathname && (r[t] = o), o;
  };
}, {}], '19': [function(t, e, n) {
  function r(t, e) {
    const n = t.responseType; return 'json' === n && null !== e ? e : 'arraybuffer' === n || 'blob' === n || 'json' === n ? o(t.response) : 'text' === n || '' === n || void 0 === n ? o(t.responseText) : void 0;
  } var o = t(22); e.exports = r;
}, {}], '20': [function(t, e, n) {
  function r() { } function o(t, e, n, r) {
    return function() {
      return u.recordSupportability('API/' + e + '/called'), i(t + e, [f.now()].concat(s(arguments)), n ? null : this, r), n ? void 0 : this;
    };
  } var i = t('handle'); const a = t(31); var s = t(32); const c = t('ee').get('tracer'); var f = t('loader'); var u = t(25); const d = NREUM; 'undefined' == typeof window.newrelic && (newrelic = d); const p = ['setPageViewName', 'setCustomAttribute', 'setErrorHandler', 'finished', 'addToTrace', 'inlineHit', 'addRelease']; const l = 'api-'; const h = l + 'ixn-'; a(p, function(t, e) {
    d[e] = o(l, e, !0, 'api');
  }), d.addPageAction = o(l, 'addPageAction', !0), d.setCurrentRouteName = o(l, 'routeName', !0), e.exports = newrelic, d.interaction = function() {
    return (new r).get();
  }; const m = r.prototype = {createTracer: function(t, e) {
    const n = {}; const r = this; const o = 'function' == typeof e; return i(h + 'tracer', [f.now(), t, n], r), function() {
      if (c.emit((o ? '' : 'no-') + 'fn-start', [f.now(), r, o], n), o) {
        try {
          return e.apply(this, arguments);
        } catch (t) {
          throw (c.emit('fn-err', [arguments, this, t], n), t);
        } finally {
          c.emit('fn-end', [f.now()], n);
        }
      }
    };
  }}; a('actionText,setName,setAttribute,save,ignore,onEnd,getContext,end,get'.split(','), function(t, e) {
    m[e] = o(h, e);
  }), newrelic.noticeError = function(t, e) {
    'string' == typeof t && (t = new Error(t)), u.recordSupportability('API/noticeError/called'), i('err', [t, f.now(), !1, e]);
  };
}, {}], '21': [function(t, e, n) {
  function r(t) {
    if (NREUM.init) {
      for (var e = NREUM.init, n = t.split('.'), r = 0; r < n.length - 1; r++) if (e = e[n[r]], 'object' != typeof e) return; return e = e[n[n.length - 1]];
    }
  } e.exports = {getConfiguration: r};
}, {}], '22': [function(t, e, n) {
  e.exports = function(t) {
    if ('string' == typeof t && t.length) return t.length; if ('object' == typeof t) {
      if ('undefined' != typeof ArrayBuffer && t instanceof ArrayBuffer && t.byteLength) return t.byteLength; if ('undefined' != typeof Blob && t instanceof Blob && t.size) return t.size; if (!('undefined' != typeof FormData && t instanceof FormData)) {
        try {
          return JSON.stringify(t).length;
        } catch (e) {
          return;
        }
      }
    }
  };
}, {}], '23': [function(t, e, n) {
  let r = !1; try {
    const o = Object.defineProperty({}, 'passive', {get: function() {
      r = !0;
    }}); window.addEventListener('testPassive', null, o), window.removeEventListener('testPassive', null, o);
  } catch (i) { } e.exports = function(t) {
    return r ? {passive: !0, capture: !!t} : !!t;
  };
}, {}], '24': [function(t, e, n) {
  let r = 0; const o = navigator.userAgent.match(/Firefox[\/\s](\d+\.\d+)/); o && (r = +o[1]), e.exports = r;
}, {}], '25': [function(t, e, n) {
  function r(t, e) {
    const n = [a, t, {name: t}, e]; return i('storeMetric', n, null, 'api'), n;
  } function o(t, e) {
    const n = [s, t, {name: t}, e]; return i('storeEventMetrics', n, null, 'api'), n;
  } var i = t('handle'); var a = 'sm'; var s = 'cm'; e.exports = {constants: {SUPPORTABILITY_METRIC: a, CUSTOM_METRIC: s}, recordSupportability: r, recordCustom: o};
}, {}], '26': [function(t, e, n) {
  function r() {
    return s.exists && performance.now ? Math.round(performance.now()) : (i = Math.max((new Date).getTime(), i)) - a;
  } function o() {
    return i;
  } var i = (new Date).getTime(); var a = i; var s = t(33); e.exports = r, e.exports.offset = a, e.exports.getLastTimestamp = o;
}, {}], '27': [function(t, e, n) {
  function r(t, e) {
    const n = t.getEntries(); n.forEach(function(t) {
 'first-paint' === t.name ? l('timing', ['fp', Math.floor(t.startTime)]) : 'first-contentful-paint' === t.name && l('timing', ['fcp', Math.floor(t.startTime)]);
    });
  } function o(t, e) {
    const n = t.getEntries(); if (n.length > 0) {
      const r = n[n.length - 1]; if (f && f < r.startTime) return; const o = [r]; const i = a({}); i && o.push(i), l('lcp', o);
    }
  } function i(t) {
    t.getEntries().forEach(function(t) {
      t.hadRecentInput || l('cls', [t]);
    });
  } function a(t) {
    const e = navigator.connection || navigator.mozConnection || navigator.webkitConnection; if (e) return e.type && (t['net-type'] = e.type), e.effectiveType && (t['net-etype'] = e.effectiveType), e.rtt && (t['net-rtt'] = e.rtt), e.downlink && (t['net-dlink'] = e.downlink), t;
  } function s(t) {
    if (t instanceof w && !y) {
      let e = Math.round(t.timeStamp); const n = {type: t.type}; a(n), e <= h.now() ? n.fid = h.now() - e : e > h.offset && e <= Date.now() ? (e -= h.offset, n.fid = h.now() - e) : e = h.now(), y = !0, l('timing', ['fi', e, n]);
    }
  } function c(t) {
    'hidden' === t && (f = h.now(), l('pageHide', [f]));
  } if (!('init' in NREUM && 'page_view_timing' in NREUM.init && 'enabled' in NREUM.init.page_view_timing && NREUM.init.page_view_timing.enabled === !1)) {
    var f; let u; let d; let p; var l = t('handle'); var h = t('loader'); const m = t(30); const v = t(23); var w = NREUM.o.EV; if ('PerformanceObserver' in window && 'function' == typeof window.PerformanceObserver) {
      u = new PerformanceObserver(r); try {
        u.observe({entryTypes: ['paint']});
      } catch (g) { } d = new PerformanceObserver(o); try {
        d.observe({entryTypes: ['largest-contentful-paint']});
      } catch (g) { } p = new PerformanceObserver(i); try {
        p.observe({type: 'layout-shift', buffered: !0});
      } catch (g) { }
    } if ('addEventListener' in document) {
      var y = !1; const x = ['click', 'keydown', 'mousedown', 'pointerdown', 'touchstart']; x.forEach(function(t) {
        document.addEventListener(t, s, v(!1));
      });
    } m(c);
  }
}, {}], '28': [function(t, e, n) {
  function r() {
    function t() {
      return e ? 15 & e[n++] : 16 * Math.random() | 0;
    } var e = null; var n = 0; const r = window.crypto || window.msCrypto; r && r.getRandomValues && (e = r.getRandomValues(new Uint8Array(31))); for (var o, i = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', a = '', s = 0; s < i.length; s++)o = i[s], 'x' === o ? a += t().toString(16) : 'y' === o ? (o = 3 & t() | 8, a += o.toString(16)) : a += o; return a;
  } function o() {
    return a(16);
  } function i() {
    return a(32);
  } function a(t) {
    function e() {
      return n ? 15 & n[r++] : 16 * Math.random() | 0;
    } var n = null; var r = 0; const o = window.crypto || window.msCrypto; o && o.getRandomValues && Uint8Array && (n = o.getRandomValues(new Uint8Array(t))); for (var i = [], a = 0; a < t; a++)i.push(e().toString(16)); return i.join('');
  } e.exports = {generateUuid: r, generateSpanId: o, generateTraceId: i};
}, {}], '29': [function(t, e, n) {
  function r(t, e) {
    if (!o) return !1; if (t !== o) return !1; if (!e) return !0; if (!i) return !1; for (let n = i.split('.'), r = e.split('.'), a = 0; a < r.length; a++) if (r[a] !== n[a]) return !1; return !0;
  } var o = null; var i = null; const a = /Version\/(\S+)\s+Safari/; if (navigator.userAgent) {
    const s = navigator.userAgent; const c = s.match(a); c && s.indexOf('Chrome') === -1 && s.indexOf('Chromium') === -1 && (o = 'Safari', i = c[1]);
  } e.exports = {agent: o, version: i, match: r};
}, {}], '30': [function(t, e, n) {
  function r(t) {
    function e() {
      t(s && document[s] ? document[s] : document[i] ? 'hidden' : 'visible');
    } 'addEventListener' in document && a && document.addEventListener(a, e, o(!1));
  } var o = t(23); e.exports = r; let i; let a; let s; 'undefined' != typeof document.hidden ? (i = 'hidden', a = 'visibilitychange', s = 'visibilityState') : 'undefined' != typeof document.msHidden ? (i = 'msHidden', a = 'msvisibilitychange') : 'undefined' != typeof document.webkitHidden && (i = 'webkitHidden', a = 'webkitvisibilitychange', s = 'webkitVisibilityState');
}, {}], '31': [function(t, e, n) {
  function r(t, e) {
    const n = []; let r = ''; let i = 0; for (r in t) o.call(t, r) && (n[i] = e(r, t[r]), i += 1); return n;
  } var o = Object.prototype.hasOwnProperty; e.exports = r;
}, {}], '32': [function(t, e, n) {
  function r(t, e, n) {
    e || (e = 0), 'undefined' == typeof n && (n = t ? t.length : 0); for (var r = -1, o = n - e || 0, i = Array(o < 0 ? 0 : o); ++r < o;)i[r] = t[e + r]; return i;
  } e.exports = r;
}, {}], '33': [function(t, e, n) {
  e.exports = {exists: 'undefined' != typeof window.performance && window.performance.timing && 'undefined' != typeof window.performance.timing.navigationStart};
}, {}], 'ee': [function(t, e, n) {
  function r() { } function o(t) {
    function e(t) {
      return t && t instanceof r ? t : t ? f(t, c, a) : a();
    } function n(n, r, o, i, a) {
      if (a !== !1 && (a = !0), !l.aborted || i) {
        t && a && t(n, r, o); for (var s = e(o), c = m(n), f = c.length, u = 0; u < f; u++)c[u].apply(s, r); const p = d[y[n]]; return p && p.push([x, n, r, s]), s;
      }
    } function i(t, e) {
      g[t] = m(t).concat(e);
    } function h(t, e) {
      const n = g[t]; if (n) for (let r = 0; r < n.length; r++)n[r] === e && n.splice(r, 1);
    } function m(t) {
      return g[t] || [];
    } function v(t) {
      return p[t] = p[t] || o(n);
    } function w(t, e) {
      l.aborted || u(t, function(t, n) {
        e = e || 'feature', y[n] = e, e in d || (d[e] = []);
      });
    } var g = {}; var y = {}; var x = {on: i, addEventListener: i, removeEventListener: h, emit: n, get: v, listeners: m, context: e, buffer: w, abort: s, aborted: !1}; return x;
  } function i(t) {
    return f(t, c, a);
  } function a() {
    return new r;
  } function s() {
    (d.api || d.feature) && (l.aborted = !0, d = l.backlog = {});
  } var c = 'nr@context'; var f = t('gos'); var u = t(31); var d = {}; var p = {}; var l = e.exports = o(); e.exports.getOrSetContext = i, l.backlog = d;
}, {}], 'gos': [function(t, e, n) {
  function r(t, e, n) {
    if (o.call(t, e)) return t[e]; const r = n(); if (Object.defineProperty && Object.keys) {
      try {
        return Object.defineProperty(t, e, {value: r, writable: !0, enumerable: !1}), r;
      } catch (i) { }
    } return t[e] = r, r;
  } var o = Object.prototype.hasOwnProperty; e.exports = r;
}, {}], 'handle': [function(t, e, n) {
  function r(t, e, n, r) {
    o.buffer([t], r), o.emit(t, e, n);
  } var o = t('ee').get('handle'); e.exports = r, r.ee = o;
}, {}], 'id': [function(t, e, n) {
  function r(t) {
    const e = typeof t; return !t || 'object' !== e && 'function' !== e ? -1 : t === window ? 0 : a(t, i, function() {
      return o++;
    });
  } var o = 1; var i = 'nr@id'; var a = t('gos'); e.exports = r;
}, {}], 'loader': [function(t, e, n) {
  function r() {
    if (!T++) {
      const t = O.info = NREUM.info; const e = m.getElementsByTagName('script')[0]; if (setTimeout(f.abort, 3e4), !(t && t.licenseKey && t.applicationID && e)) return f.abort(); c(E, function(e, n) {
        t[e] || (t[e] = n);
      }); const n = a(); s('mark', ['onload', n + O.offset], null, 'api'), s('timing', ['load', n]); const r = m.createElement('script'); 0 === t.agent.indexOf('http://') || 0 === t.agent.indexOf('https://') ? r.src = t.agent : r.src = l + '://' + t.agent, e.parentNode.insertBefore(r, e);
    }
  } function o() {
    'complete' === m.readyState && i();
  } function i() {
    s('mark', ['domContent', a() + O.offset], null, 'api');
  } var a = t(26); var s = t('handle'); var c = t(31); var f = t('ee'); const u = t(29); const d = t(21); const p = t(23); var l = d.getConfiguration('ssl') === !1 ? 'http' : 'https'; const h = window; var m = h.document; const v = 'addEventListener'; const w = 'attachEvent'; const g = h.XMLHttpRequest; const y = g && g.prototype; const x = !1; NREUM.o = {ST: setTimeout, SI: h.setImmediate, CT: clearTimeout, XHR: g, REQ: h.Request, EV: h.Event, PR: h.Promise, MO: h.MutationObserver}; const b = '' + location; var E = {beacon: 'bam.nr-data.net', errorBeacon: 'bam.nr-data.net', agent: 'js-agent.newrelic.com/nr-spa-1216.min.js'}; const R = g && y && y[v] && !/CriOS/.test(navigator.userAgent); var O = e.exports = {offset: a.getLastTimestamp(), now: a, origin: b, features: {}, xhrWrappable: R, userAgent: u, disabled: x}; if (!x) {
    t(20), t(27), m[v] ? (m[v]('DOMContentLoaded', i, p(!1)), h[v]('load', r, p(!1))) : (m[w]('onreadystatechange', o), h[w]('onload', r)), s('mark', ['firstbyte', a.getLastTimestamp()], null, 'api'); var T = 0;
  }
}, {}], 'wrap-function': [function(t, e, n) {
  function r(t, e) {
    function n(e, n, r, c, f) {
      function nrWrapper() {
        let i; let a; let u; let p; try {
          a = this, i = d(arguments), u = 'function' == typeof r ? r(i, a) : r || {};
        } catch (l) {
          o([l, '', [i, a, c], u], t);
        } s(n + 'start', [i, a, c], u, f); try {
          return p = e.apply(a, i);
        } catch (h) {
          throw (s(n + 'err', [i, a, h], u, f), h);
        } finally {
          s(n + 'end', [i, a, p], u, f);
        }
      } return a(e) ? e : (n || (n = ''), nrWrapper[p] = e, i(e, nrWrapper, t), nrWrapper);
    } function r(t, e, r, o, i) {
      r || (r = ''); let s; let c; let f; const u = '-' === r.charAt(0); for (f = 0; f < e.length; f++)c = e[f], s = t[c], a(s) || (t[c] = n(s, u ? c + r : r, o, c, i));
    } function s(n, r, i, a) {
      if (!h || e) {
        const s = h; h = !0; try {
          t.emit(n, r, i, e, a);
        } catch (c) {
          o([c, n, r, i], t);
        } h = s;
      }
    } return t || (t = u), n.inPlace = r, n.flag = p, n;
  } function o(t, e) {
    e || (e = u); try {
      e.emit('internal-error', t);
    } catch (n) { }
  } function i(t, e, n) {
    if (Object.defineProperty && Object.keys) {
      try {
        const r = Object.keys(t); return r.forEach(function(n) {
          Object.defineProperty(e, n, {get: function() {
            return t[n];
          }, set: function(e) {
            return t[n] = e, e;
          }});
        }), e;
      } catch (i) {
        o([i], n);
      }
    } for (const a in t) l.call(t, a) && (e[a] = t[a]); return e;
  } function a(t) {
    return !(t && t instanceof Function && t.apply && !t[p]);
  } function s(t, e) {
    const n = e(t); return n[p] = t, i(t, n, u), n;
  } function c(t, e, n) {
    const r = t[e]; t[e] = s(r, n);
  } function f() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; ++n)e[n] = arguments[n]; return e;
  } var u = t('ee'); var d = t(32); var p = 'nr@original'; var l = Object.prototype.hasOwnProperty; var h = !1; e.exports = r, e.exports.wrapFunction = s, e.exports.wrapInPlace = c, e.exports.argsToArray = f;
}, {}]}, {}, ['loader', 2, 17, 5, 3, 4]);
