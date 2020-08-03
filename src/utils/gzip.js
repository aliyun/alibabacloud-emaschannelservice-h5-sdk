// 修改挂载 window 对象为模块
let gzip = null;

! function (a) {
  function b(d) {
    if (c[d]) return c[d].exports;
    var e = c[d] = {
      exports: {},
      id: d,
      loaded: !1
    };
    return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports
  }
  var c = {};
  return b.m = a, b.c = c, b.p = "", b(0)
}([function (a, b, c) {
  (function (a) {
    "use strict";

    function b(a) {
      return a && a.__esModule ? a : {
        "default": a
      }
    }
    var d = c(1),
      e = b(d);
      // 修改挂载 window 对象为模块
    gzip = e["default"]
  }).call(b, function () {
    return this
  }())
}, function (a, b, c) {
  "use strict";
  ! function () {
    function b(a, b) {
      b.push(255 & a)
    }

    function d(a, b) {
      b.push(255 & a), b.push(a >>> 8)
    }

    function e(a, b) {
      d(65535 & a, b), d(a >>> 16, b)
    }

    function f(a, c) {
      var d, e = a.length;
      for (d = 0; e > d; d += 1) b(a.charCodeAt(d), c)
    }

    function g(a) {
      return a.shift()
    }

    function h(a) {
      return a.shift() | a.shift() << 8
    }

    function i(a) {
      var b = h(a),
        c = h(a);
      return c > 32768 ? (c -= 32768, (c << 16 | b) + 32768 * Math.pow(2, 16)) : c << 16 | b
    }

    function j(a) {
      for (var b = []; 0 !== a[0];) b.push(String.fromCharCode(a.shift()));
      return a.shift(), b.join("")
    }

    function k(a, b) {
      var c, d = [];
      for (c = 0; b > c; c += 1) d.push(a.shift());
      return d
    }

    function l(a, c) {
      var d, g = 0,
        h = [];
      return c || (c = {}), d = c.level || v, "string" == typeof a && (a = Array.prototype.map.call(a,
        function (a) {
          return a.charCodeAt(0)
        })), b(p, h), b(q, h), b(r.deflate, h), c.name && (g |= s.FNAME), b(g, h), e(c.timestamp ||
          parseInt(Date.now() / 1e3, 10), h), 1 === d ? b(4, h) : 9 === d ? b(2, h) : b(0, h), b(t[u],
            h), c.name && (f(c.name.substring(c.name.lastIndexOf("/") + 1), h), b(0, h)), o.deflate(a,
              d).forEach(function (a) {
                b(a, h)
              }), e(parseInt(n(a), 16), h), e(a.length, h), h
    }

    function m(a, b) {
      var c, d, e, f, l, m, u, v, w, x = Array.prototype.slice.call(a, 0);
      if (g(x) !== p || g(x) !== q) throw "Not a GZIP file";
      if (c = g(x), c = Object.keys(r).some(function (a) {
        return d = a, r[a] === c
      }), !c) throw "Unsupported compression method";
      if (e = g(x), f = i(x), l = g(x), c = g(x), Object.keys(t).some(function (a) {
        return t[a] === c ? (m = a, !0) : void 0
      }), Object.keys(s), e & s.FEXTRA && (c = h(x), k(x, c)), e & s.FNAME && j(x), e & s.FCOMMENT && j(x), e & s.FHCRC &&
        h(x), "deflate" === d && (w = o.inflate(x.splice(0, x.length - 8))), e & s.FTEXT && (w = Array.prototype
          .map.call(w, function (a) {
            return String.fromCharCode(a)
          }).join("")), u = i(x), u !== parseInt(n(w), 16)) throw "Checksum does not match";
      if (v = i(x), v !== w.length) throw "Size of decompressed file not correct";
      return w
    }
    var n = c(2),
      o = c(3),
      p = 31,
      q = 139,
      r = {
        deflate: 8
      },
      s = {
        FTEXT: 1,
        FHCRC: 2,
        FEXTRA: 4,
        FNAME: 8,
        FCOMMENT: 16
      },
      t = {
        fat: 0,
        amiga: 1,
        vmz: 2,
        unix: 3,
        "vm/cms": 4,
        atari: 5,
        hpfs: 6,
        macintosh: 7,
        "z-system": 8,
        cplm: 9,
        "tops-20": 10,
        ntfs: 11,
        qdos: 12,
        acorn: 13,
        vfat: 14,
        vms: 15,
        beos: 16,
        tandem: 17,
        theos: 18
      },
      u = "unix",
      v = 6;
    a.exports = {
      zip: l,
      unzip: m,
      get DEFAULT_LEVEL() {
        return v
      }
    }
  }()
}, function (a, b) {
  "use strict";
  ! function () {
    function b() {
      var a, b, c;
      for (b = 0; 256 > b; b += 1) {
        for (a = b, c = 0; 8 > c; c += 1) 1 & a ? a = g ^ a >>> 1 : a >>>= 1;
        f[b] = a >>> 0
      }
    }

    function c(a) {
      return Array.prototype.map.call(a, function (a) {
        return a.charCodeAt(0)
      })
    }

    function d(a) {
      var b, c, d, e, f = -1;
      for (b = 0, d = a.length; d > b; b += 1) {
        for (e = 255 & (f ^ a[b]), c = 0; 8 > c; c += 1) 1 === (1 & e) ? e = e >>> 1 ^ g : e >>>= 1;
        f = f >>> 8 ^ e
      }
      return -1 ^ f
    }

    function e(a, b) {
      var c, d, g;
      if ("undefined" != typeof e.crc && b && a || (e.crc = -1, a)) {
        for (c = e.crc, d = 0, g = a.length; g > d; d += 1) c = c >>> 8 ^ f[255 & (c ^ a[d])];
        return e.crc = c, -1 ^ c
      }
    }
    var f = [],
      g = 3988292384;
    b(), a.exports = function (a, b) {
      var a = "string" == typeof a ? c(a) : a,
        f = b ? d(a) : e(a);
      return (f >>> 0).toString(16)
    }, a.exports.direct = d, a.exports.table = e
  }()
}, function (a, b, c) {
  "use strict";
  ! function () {
    a.exports = {
      inflate: c(4),
      deflate: c(5)
    }
  }()
}, function (a, b) {
  "use strict";
  ! function () {
    function b() {
      this.next = null, this.list = null
    }

    function c() {
      this.e = 0, this.b = 0, this.n = 0, this.t = null
    }

    function d(a, d, e, f, g, h) {
      this.BMAX = 16, this.N_MAX = 288, this.status = 0, this.root = null, this.m = 0;
      var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z = [],
        A = [],
        B = new c,
        C = [],
        D = [],
        E = [];
      for (y = this.root = null, n = 0; n < this.BMAX + 1; n++) z[n] = 0;
      for (n = 0; n < this.BMAX + 1; n++) A[n] = 0;
      for (n = 0; n < this.BMAX; n++) C[n] = null;
      for (n = 0; n < this.N_MAX; n++) D[n] = 0;
      for (n = 0; n < this.BMAX + 1; n++) E[n] = 0;
      j = d > 256 ? a[256] : this.BMAX, q = a, r = 0, n = d;
      do z[q[r]]++, r++; while (--n > 0);
      if (z[0] === d) return this.root = null, this.m = 0, void (this.status = 0);
      for (o = 1; o <= this.BMAX && 0 === z[o]; o++);
      for (p = o, o > h && (h = o), n = this.BMAX; 0 !== n && 0 === z[n]; n--);
      for (l = n, h > n && (h = n), v = 1 << o; n > o; o++, v <<= 1)
        if ((v -= z[o]) < 0) return this.status = 2, void (this.m = h);
      if ((v -= z[n]) < 0) return this.status = 2, void (this.m = h);
      for (z[n] += v, E[1] = o = 0, q = z, r = 1, u = 2; --n > 0;) E[u++] = o += q[r++];
      q = a, r = 0, n = 0;
      do 0 !== (o = q[r++]) && (D[E[o]++] = n); while (++n < d);
      for (d = E[l], E[0] = n = 0, q = D, r = 0, m = -1, t = A[0] = 0, s = null, w = 0, null; l >= p; p++)
        for (i = z[p]; i-- > 0;) {
          for (; p > t + A[1 + m];) {
            if (t += A[1 + m], m++, w = (w = l - t) > h ? h : w, (k = 1 << (o = p - t)) > i + 1)
              for (k -= i + 1, u = p; ++o < w && !((k <<= 1) <= z[++u]);) k -= z[u];
            for (t + o > j && j > t && (o = j - t), w = 1 << o, A[1 + m] = o, s = [], x = 0; w > x; x++)
              s[x] = new c;
            y = y ? y.next = new b : this.root = new b, y.next = null, y.list = s, C[m] = s, m > 0 &&
              (E[m] = n, B.b = A[m], B.e = 16 + o, B.t = s, o = (n & (1 << t) - 1) >> t - A[m], C[
                m - 1][o].e = B.e, C[m - 1][o].b = B.b, C[m - 1][o].n = B.n, C[m - 1][o].t =
                B.t)
          }
          for (B.b = p - t, r >= d ? B.e = 99 : q[r] < e ? (B.e = q[r] < 256 ? 16 : 15, B.n = q[r++]) :
            (B.e = g[q[r] - e], B.n = f[q[r++] - e]), k = 1 << p - t, o = n >> t; w > o; o += k) s[
              o].e = B.e, s[o].b = B.b, s[o].n = B.n, s[o].t = B.t;
          for (o = 1 << p - 1; 0 !== (n & o); o >>= 1) n ^= o;
          for (n ^= o;
            (n & (1 << t) - 1) !== E[m];) t -= A[m], m--
        }
      this.m = A[1], this.status = 0 !== v && 1 !== l ? 1 : 0
    }

    function e() {
      return E.length === F ? -1 : 255 & E[F++]
    }

    function f(a) {
      for (; a > v;) u |= e() << v, v += 8
    }

    function g(a) {
      return u & N[a]
    }

    function h(a) {
      u >>= a, v -= a
    }

    function i(a, b, c) {
      var d, e, i;
      if (0 === c) return 0;
      for (i = 0; ;) {
        for (f(C), e = A.list[g(C)], d = e.e; d > 16;) {
          if (99 === d) return -1;
          h(e.b), d -= 16, f(d), e = e.t[g(d)], d = e.e
        }
        if (h(e.b), 16 !== d) {
          if (15 === d) break;
          for (f(d), y = e.n + g(d), h(d), f(D), e = B.list[g(D)], d = e.e; d > 16;) {
            if (99 === d) return -1;
            h(e.b), d -= 16, f(d), e = e.t[g(d)], d = e.e
          }
          for (h(e.b), f(d), z = q - e.n - g(d), h(d); y > 0 && c > i;) y--, z &= G - 1, q &= G - 1,
            a[b + i++] = p[q++] = p[z++];
          if (i === c) return c
        } else if (q &= G - 1, a[b + i++] = p[q++] = e.n, i === c) return c
      }
      return w = -1, i
    }

    function j(a, b, c) {
      var d;
      if (d = 7 & v, h(d), f(16), d = g(16), h(16), f(16), d !== (65535 & ~u)) return -1;
      for (h(16), y = d, d = 0; y > 0 && c > d;) y--, q &= G - 1, f(8), a[b + d++] = p[q++] = g(8), h(8);
      return 0 === y && (w = -1), d
    }

    function k(a, b, c) {
      if (!M) {
        var e, f, g = [];
        for (e = 0; 144 > e; e++) g[e] = 8;
        for (null; 256 > e; e++) g[e] = 9;
        for (null; 280 > e; e++) g[e] = 7;
        for (null; 288 > e; e++) g[e] = 8;
        if (s = 7, f = new d(g, 288, 257, O, P, s), 0 !== f.status) return console.error(
          "HufBuild error: " + f.status), -1;
        for (M = f.root, s = f.m, e = 0; 30 > e; e++) g[e] = 5;
        if (t = 5, f = new d(g, 30, 0, Q, R, t), f.status > 1) return M = null, console.error(
          "HufBuild error: " + f.status), -1;
        r = f.root, t = f.m
      }
      return A = M, B = r, C = s, D = t, i(a, b, c)
    }

    function l(a, b, c) {
      var e, j, k, l, m, n, o, p, q, r = [];
      for (e = 0; 316 > e; e++) r[e] = 0;
      if (f(5), o = 257 + g(5), h(5), f(5), p = 1 + g(5), h(5), f(4), n = 4 + g(4), h(4), o > 286 || p >
        30) return -1;
      for (j = 0; n > j; j++) f(3), r[S[j]] = g(3), h(3);
      for (null; 19 > j; j++) r[S[j]] = 0;
      if (C = 7, q = new d(r, 19, 19, null, null, C), 0 !== q.status) return -1;
      for (A = q.root, C = q.m, l = o + p, e = k = 0; l > e;)
        if (f(C), m = A.list[g(C)], j = m.b, h(j), j = m.n, 16 > j) r[e++] = k = j;
        else if (16 === j) {
          if (f(2), j = 3 + g(2), h(2), e + j > l) return -1;
          for (; j-- > 0;) r[e++] = k
        } else if (17 === j) {
          if (f(3), j = 3 + g(3), h(3), e + j > l) return -1;
          for (; j-- > 0;) r[e++] = 0;
          k = 0
        } else {
          if (f(7), j = 11 + g(7), h(7), e + j > l) return -1;
          for (; j-- > 0;) r[e++] = 0;
          k = 0
        }
      if (C = K, q = new d(r, o, 257, O, P, C), 0 === C && (q.status = 1), 0 !== q.status && 1 !== q.status)
        return -1;
      for (A = q.root, C = q.m, e = 0; p > e; e++) r[e] = r[e + o];
      return D = L, q = new d(r, p, 0, Q, R, D), B = q.root, D = q.m, 0 === D && o > 257 ? -1 : 0 !== q.status ?
        -1 : i(a, b, c)
    }

    function m() {
      p || (p = []), q = 0, u = 0, v = 0, w = -1, x = !1, y = z = 0, A = null
    }

    function n(a, b, c) {
      var d, e;
      for (d = 0; c > d;) {
        if (x && -1 === w) return d;
        if (y > 0) {
          if (w !== H)
            for (; y > 0 && c > d;) y--, z &= G - 1, q &= G - 1, a[b + d++] = p[q++] = p[z++];
          else {
            for (; y > 0 && c > d;) y--, q &= G - 1, f(8), a[b + d++] = p[q++] = g(8), h(8);
            0 === y && (w = -1)
          }
          if (d === c) return d
        }
        if (-1 === w) {
          if (x) break;
          f(1), 0 !== g(1) && (x = !0), h(1), f(2), w = g(2), h(2), A = null, y = 0
        }
        switch (w) {
          case H:
            e = j(a, b + d, c - d);
            break;
          case I:
            e = A ? i(a, b + d, c - d) : k(a, b + d, c - d);
            break;
          case J:
            e = A ? i(a, b + d, c - d) : l(a, b + d, c - d);
            break;
          default:
            e = -1
        }
        if (-1 === e) return x ? 0 : -1;
        d += e
      }
      return d
    }

    function o(a) {
      var b, c = [];
      m(), E = a, F = 0;
      do b = n(c, c.length, 1024); while (b > 0);
      return E = null, c
    }
    var p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G = 32768,
      H = 0,
      I = 1,
      J = 2,
      K = 9,
      L = 6,
      M = null,
      N = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535],
      O = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131,
        163, 195, 227, 258, 0, 0],
      P = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99],
      Q = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
        2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
      R = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13,
        13],
      S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    a.exports = o
  }()
}, function (a, b) {
  "use strict";
  ! function () {
    function b() {
      this.fc = 0, this.dl = 0
    }

    function c() {
      this.dyn_tree = null, this.static_tree = null, this.extra_bits = null, this.extra_base = 0, this.elems =
        0, this.max_length = 0, this.max_code = 0
    }

    function d(a, b, c, d) {
      this.good_length = a, this.max_lazy = b, this.nice_length = c, this.max_chain = d
    }

    function e() {
      this.next = null, this.len = 0, this.ptr = [], this.off = 0
    }

    function f(a) {
      var d;
      if (a ? 1 > a ? a = 1 : a > 9 && (a = 9) : a = Xa, pa = a, U = !1, la = !1, null === Bb) {
        for (R = S = T = null, Bb = [], Y = [], Z = [], $ = [], _ = [], sa = [], d = 0; zb > d; d++) sa[
          d] = new b;
        for (ta = [], d = 0; 2 * ub + 1 > d; d++) ta[d] = new b;
        for (ua = [], d = 0; tb + 2 > d; d++) ua[d] = new b;
        for (va = [], d = 0; ub > d; d++) va[d] = new b;
        for (wa = [], d = 0; 2 * vb + 1 > d; d++) wa[d] = new b;
        xa = new c, ya = new c, za = new c, Aa = [], Ba = [], Ea = [], Fa = [], Ga = [], Ha = [], Ia = [],
          Ja = []
      }
    }

    function g(a) {
      a.next = R, R = a
    }

    function h() {
      var a;
      return null !== R ? (a = R, R = R.next) : a = new e, a.next = null, a.len = a.off = 0, a
    }

    function i(a) {
      return _[Ta + a]
    }

    function j(a, b) {
      return _[Ta + a] = b
    }

    function k(a) {
      Bb[W + V++] = a, W + V === $a && P()
    }

    function l(a) {
      a &= 65535, $a - 2 > W + V ? (Bb[W + V++] = 255 & a, Bb[W + V++] = a >>> 8) : (k(255 & a), k(a >>>
        8))
    }

    function m() {
      da = (da << Ab ^ 255 & Y[ja + ab - 1]) & hb, ea = i(da), _[ja & ib] = ea, j(da, ja)
    }

    function n(a, b) {
      M(b[a].fc, b[a].dl)
    }

    function o(a) {
      return 255 & (256 > a ? Ga[a] : Ga[256 + (a >> 7)])
    }

    function p(a, b, c) {
      return a[b].fc < a[c].fc || a[b].fc === a[c].fc && Ea[b] <= Ea[c]
    }

    function q(a, b, c) {
      var d;
      for (d = 0; c > d && Sa < Ra.length; d++) a[b + d] = 255 & Ra[Sa++];
      return d
    }

    function r() {
      var a;
      for (a = 0; gb > a; a++) _[Ta + a] = 0;
      if (oa = Gb[pa].max_lazy, qa = Gb[pa].good_length, Ya || (ra = Gb[pa].nice_length), na = Gb[pa].max_chain,
        ja = 0, ca = 0, ma = q(Y, 0, 2 * Ta), 0 >= ma) return la = !0, void (ma = 0);
      for (la = !1; lb > ma && !la;) t();
      for (da = 0, a = 0; ab - 1 > a; a++) da = (da << Ab ^ 255 & Y[a]) & hb
    }

    function s(a) {
      var b, c, d, e, f = na,
        g = ja,
        h = ia,
        i = ja > mb ? ja - mb : jb,
        j = ja + bb,
        k = Y[g + h - 1],
        l = Y[g + h];
      ia >= qa && (f >>= 2);
      do
        if (b = a, Y[b + h] === l && Y[b + h - 1] === k && Y[b] === Y[g] && Y[++b] === Y[g + 1]) {
          for (g += 2, b++; j > g;) {
            for (e = !1, d = 0; 8 > d; d += 1)
              if (g += 1, b += 1, Y[g] !== Y[b]) {
                e = !0;
                break
              } if (e) break
          }
          if (c = bb - (j - g), g = j - bb, c > h) {
            if (ka = a, h = c, Ya) {
              if (c >= bb) break
            } else if (c >= ra) break;
            k = Y[g + h - 1], l = Y[g + h]
          }
        } while ((a = _[a & ib]) > i && 0 !== --f);
      return h
    }

    function t() {
      var a, b, c = _a - ma - ja;
      if (-1 === c) c--;
      else if (ja >= Ta + mb) {
        for (a = 0; Ta > a; a++) Y[a] = Y[a + Ta];
        for (ka -= Ta, ja -= Ta, ca -= Ta, a = 0; gb > a; a++) b = i(a), j(a, b >= Ta ? b - Ta : jb);
        for (a = 0; Ta > a; a++) b = _[a], _[a] = b >= Ta ? b - Ta : jb;
        c += Ta
      }
      la || (a = q(Y, ja + ma, c), 0 >= a ? la = !0 : ma += a)
    }

    function u() {
      for (; 0 !== ma && null === S;) {
        var a;
        if (m(), ea !== jb && mb >= ja - ea && (ha = s(ea), ha > ma && (ha = ma)), ha >= ab)
          if (a = K(ja - ka, ha - ab), ma -= ha, oa >= ha) {
            ha--;
            do ja++, m(); while (0 !== --ha);
            ja++
          } else ja += ha, ha = 0, da = 255 & Y[ja], da = (da << Ab ^ 255 & Y[ja + 1]) & hb;
        else a = K(0, 255 & Y[ja]), ma--, ja++;
        for (a && (J(0), ca = ja); lb > ma && !la;) t()
      }
    }

    function v() {
      for (; 0 !== ma && null === S;) {
        if (m(), ia = ha, fa = ka, ha = ab - 1, ea !== jb && oa > ia && mb >= ja - ea && (ha = s(ea),
          ha > ma && (ha = ma), ha === ab && ja - ka > kb && ha--), ia >= ab && ia >= ha) {
          var a;
          a = K(ja - 1 - fa, ia - ab), ma -= ia - 1, ia -= 2;
          do ja++, m(); while (0 !== --ia);
          ga = !1, ha = ab - 1, ja++, a && (J(0), ca = ja)
        } else ga ? (K(0, 255 & Y[ja - 1]) && (J(0), ca = ja), ja++, ma--) : (ga = !0, ja++, ma--);
        for (; lb > ma && !la;) t()
      }
    }

    function w() {
      la || (aa = 0, ba = 0, z(), r(), S = null, V = 0, W = 0, 3 >= pa ? (ia = ab - 1, ha = 0) : (ha = ab -
        1, ga = !1), X = !1)
    }

    function x(a, b, c) {
      var d;
      return U || (w(), U = !0, 0 !== ma) ? (d = y(a, b, c), d === c ? c : X ? d : (3 >= pa ? u() : v(),
        0 === ma && (ga && K(0, 255 & Y[ja - 1]), J(1), X = !0), d + y(a, d + b, c - d))) : (X = !0,
          0)
    }

    function y(a, b, c) {
      var d, e, f;
      for (d = 0; null !== S && c > d;) {
        for (e = c - d, e > S.len && (e = S.len), f = 0; e > f; f++) a[b + d + f] = S.ptr[S.off + f];
        if (S.off += e, S.len -= e, d += e, 0 === S.len) {
          var h;
          h = S, S = S.next, g(h)
        }
      }
      if (d === c) return d;
      if (V > W) {
        for (e = c - d, e > V - W && (e = V - W), f = 0; e > f; f++) a[b + d + f] = Bb[W + f];
        W += e, d += e, V === W && (V = W = 0)
      }
      return d
    }

    function z() {
      var a, b, c, d, e;
      if (0 === va[0].dl) {
        for (xa.dyn_tree = sa, xa.static_tree = ua, xa.extra_bits = Cb, xa.extra_base = rb + 1, xa.elems =
          tb, xa.max_length = ob, xa.max_code = 0, ya.dyn_tree = ta, ya.static_tree = va, ya.extra_bits =
          Db, ya.extra_base = 0, ya.elems = ub, ya.max_length = ob, ya.max_code = 0, za.dyn_tree = wa,
          za.static_tree = null, za.extra_bits = Eb, za.extra_base = 0, za.elems = vb, za.max_length =
          pb, za.max_code = 0, c = 0, d = 0; qb - 1 > d; d++)
          for (Ha[d] = c, a = 0; a < 1 << Cb[d]; a++) Fa[c++] = d;
        for (Fa[c - 1] = d, e = 0, d = 0; 16 > d; d++)
          for (Ia[d] = e, a = 0; a < 1 << Db[d]; a++) Ga[e++] = d;
        for (e >>= 7; ub > d; d++)
          for (Ia[d] = e << 7, a = 0; a < 1 << Db[d] - 7; a++) Ga[256 + e++] = d;
        for (b = 0; ob >= b; b++) Aa[b] = 0;
        for (a = 0; 143 >= a;) ua[a++].dl = 8, Aa[8]++;
        for (; 255 >= a;) ua[a++].dl = 9, Aa[9]++;
        for (; 279 >= a;) ua[a++].dl = 7, Aa[7]++;
        for (; 287 >= a;) ua[a++].dl = 8, Aa[8]++;
        for (D(ua, tb + 1), a = 0; ub > a; a++) va[a].dl = 5, va[a].fc = N(a, 5);
        A()
      }
    }

    function A() {
      var a;
      for (a = 0; tb > a; a++) sa[a].fc = 0;
      for (a = 0; ub > a; a++) ta[a].fc = 0;
      for (a = 0; vb > a; a++) wa[a].fc = 0;
      sa[sb].fc = 1, Pa = Qa = 0, Ka = La = Ma = 0, Na = 0, Oa = 1
    }

    function B(a, b) {
      for (var c = Ba[b], d = b << 1; Ca >= d && (Ca > d && p(a, Ba[d + 1], Ba[d]) && d++, !p(a, c, Ba[d]));)
        Ba[b] = Ba[d], b = d, d <<= 1;
      Ba[b] = c
    }

    function C(a) {
      var b, c, d, e, f, g, h = a.dyn_tree,
        i = a.extra_bits,
        j = a.extra_base,
        k = a.max_code,
        l = a.max_length,
        m = a.static_tree,
        n = 0;
      for (e = 0; ob >= e; e++) Aa[e] = 0;
      for (h[Ba[Da]].dl = 0, b = Da + 1; zb > b; b++) c = Ba[b], e = h[h[c].dl].dl + 1, e > l && (e = l,
        n++), h[c].dl = e, c > k || (Aa[e]++, f = 0, c >= j && (f = i[c - j]), g = h[c].fc, Pa += g *
          (e + f), null !== m && (Qa += g * (m[c].dl + f)));
      if (0 !== n) {
        do {
          for (e = l - 1; 0 === Aa[e];) e--;
          Aa[e]--, Aa[e + 1] += 2, Aa[l]--, n -= 2
        } while (n > 0);
        for (e = l; 0 !== e; e--)
          for (c = Aa[e]; 0 !== c;) d = Ba[--b], d > k || (h[d].dl !== e && (Pa += (e - h[d].dl) * h[
            d].fc, h[d].fc = e), c--)
      }
    }

    function D(a, b) {
      var c, d, e = [],
        f = 0;
      for (c = 1; ob >= c; c++) f = f + Aa[c - 1] << 1, e[c] = f;
      for (d = 0; b >= d; d++) {
        var g = a[d].dl;
        0 !== g && (a[d].fc = N(e[g]++, g))
      }
    }

    function E(a) {
      var b, c, d = a.dyn_tree,
        e = a.static_tree,
        f = a.elems,
        g = -1,
        h = f;
      for (Ca = 0, Da = zb, b = 0; f > b; b++) 0 !== d[b].fc ? (Ba[++Ca] = g = b, Ea[b] = 0) : d[b].dl =
        0;
      for (; 2 > Ca;) {
        var i = Ba[++Ca] = 2 > g ? ++g : 0;
        d[i].fc = 1, Ea[i] = 0, Pa--, null !== e && (Qa -= e[i].dl)
      }
      for (a.max_code = g, b = Ca >> 1; b >= 1; b--) B(d, b);
      do b = Ba[nb], Ba[nb] = Ba[Ca--], B(d, nb), c = Ba[nb], Ba[--Da] = b, Ba[--Da] = c, d[h].fc = d[b].fc +
        d[c].fc, Ea[b] > Ea[c] + 1 ? Ea[h] = Ea[b] : Ea[h] = Ea[c] + 1, d[b].dl = d[c].dl = h, Ba[nb] =
        h++, B(d, nb); while (Ca >= 2);
      Ba[--Da] = Ba[nb], C(a), D(d, g)
    }

    function F(a, b) {
      var c, d, e = -1,
        f = a[0].dl,
        g = 0,
        h = 7,
        i = 4;
      for (0 === f && (h = 138, i = 3), a[b + 1].dl = 65535, c = 0; b >= c; c++) d = f, f = a[c + 1].dl,
        ++g < h && d === f || (i > g ? wa[d].fc += g : 0 !== d ? (d !== e && wa[d].fc++, wa[wb].fc++) :
          10 >= g ? wa[xb].fc++ : wa[yb].fc++, g = 0, e = d, 0 === f ? (h = 138, i = 3) : d === f ? (
            h = 6, i = 3) : (h = 7, i = 4))
    }

    function G(a, b) {
      var c, d, e = -1,
        f = a[0].dl,
        g = 0,
        h = 7,
        i = 4;
      for (0 === f && (h = 138, i = 3), c = 0; b >= c; c++)
        if (d = f, f = a[c + 1].dl, !(++g < h && d === f)) {
          if (i > g) {
            do n(d, wa); while (0 !== --g)
          } else 0 !== d ? (d !== e && (n(d, wa), g--), n(wb, wa), M(g - 3, 2)) : 10 >= g ? (n(xb, wa),
            M(g - 3, 3)) : (n(yb, wa), M(g - 11, 7));
          g = 0, e = d, 0 === f ? (h = 138, i = 3) : d === f ? (h = 6, i = 3) : (h = 7, i = 4)
        }
    }

    function H() {
      var a;
      for (F(sa, xa.max_code), F(ta, ya.max_code), E(za), a = vb - 1; a >= 3 && 0 === wa[Fb[a]].dl; a--);
      return Pa += 3 * (a + 1) + 5 + 5 + 4, a
    }

    function I(a, b, c) {
      var d;
      for (M(a - 257, 5), M(b - 1, 5), M(c - 4, 4), d = 0; c > d; d++) M(wa[Fb[d]].dl, 3);
      G(sa, a - 1), G(ta, b - 1)
    }

    function J(a) {
      var b, c, d, e, f;
      if (e = ja - ca, Ja[Ma] = Na, E(xa), E(ya), d = H(), b = Pa + 3 + 7 >> 3, c = Qa + 3 + 7 >> 3, b >=
        c && (b = c), b >= e + 4 && ca >= 0)
        for (M((Ua << 1) + a, 3), O(), l(e), l(~e), f = 0; e > f; f++) k(Y[ca + f]);
      else c === b ? (M((Va << 1) + a, 3), L(ua, va)) : (M((Wa << 1) + a, 3), I(xa.max_code + 1, ya.max_code +
        1, d + 1), L(sa, ta));
      A(), 0 !== a && O()
    }

    function K(a, b) {
      if ($[Ka++] = b, 0 === a ? sa[b].fc++ : (a--, sa[Fa[b] + rb + 1].fc++, ta[o(a)].fc++, Z[La++] = a,
        Na |= Oa), Oa <<= 1, 0 === (7 & Ka) && (Ja[Ma++] = Na, Na = 0, Oa = 1), pa > 2 && 0 === (
          4095 & Ka)) {
        var c, d = 8 * Ka,
          e = ja - ca;
        for (c = 0; ub > c; c++) d += ta[c].fc * (5 + Db[c]);
        if (d >>= 3, La < parseInt(Ka / 2, 10) && d < parseInt(e / 2, 10)) return !0
      }
      return Ka === db - 1 || La === fb
    }

    function L(a, b) {
      var c, d, e, f, g = 0,
        h = 0,
        i = 0,
        j = 0;
      if (0 !== Ka)
        do 0 === (7 & g) && (j = Ja[i++]), d = 255 & $[g++], 0 === (1 & j) ? n(d, a) : (e = Fa[d], n(e +
          rb + 1, a), f = Cb[e], 0 !== f && (d -= Ha[e], M(d, f)), c = Z[h++], e = o(c), n(e,
            b), f = Db[e], 0 !== f && (c -= Ia[e], M(c, f))), j >>= 1; while (Ka > g);
      n(sb, a)
    }

    function M(a, b) {
      ba > Hb - b ? (aa |= a << ba, l(aa), aa = a >> Hb - ba, ba += b - Hb) : (aa |= a << ba, ba += b)
    }

    function N(a, b) {
      var c = 0;
      do c |= 1 & a, a >>= 1, c <<= 1; while (--b > 0);
      return c >> 1
    }

    function O() {
      ba > 8 ? l(aa) : ba > 0 && k(aa), aa = 0, ba = 0
    }

    function P() {
      var a, b;
      if (0 !== V) {
        for (a = h(), null === S ? S = T = a : T = T.next = a, a.len = V - W, b = 0; b < a.len; b++) a.ptr[
          b] = Bb[W + b];
        V = W = 0
      }
    }

    function Q(a, b) {
      var c, d;
      Ra = a, Sa = 0, "undefined" == typeof b && (b = Xa), f(b), d = [];
      do c = x(d, d.length, 1024); while (c > 0);
      return Ra = null, d
    }
    var R, S, T, U, V, W, X, Y, Z, $, _, aa, ba, ca, da, ea, fa, ga, ha, ia, ja, ka, la, ma, na, oa, pa, qa,
      ra, sa, ta, ua, va, wa, xa, ya, za, Aa, Ba, Ca, Da, Ea, Fa, Ga, Ha, Ia, Ja, Ka, La, Ma, Na, Oa, Pa,
      Qa, Ra, Sa, Ta = 32768,
      Ua = 0,
      Va = 1,
      Wa = 2,
      Xa = 6,
      Ya = !1,
      Za = 32768,
      $a = 8192,
      _a = 2 * Ta,
      ab = 3,
      bb = 258,
      cb = 16,
      db = 8192,
      eb = 15,
      fb = db,
      gb = 1 << eb,
      hb = gb - 1,
      ib = Ta - 1,
      jb = 0,
      kb = 4096,
      lb = bb + ab + 1,
      mb = Ta - lb,
      nb = 1,
      ob = 15,
      pb = 7,
      qb = 29,
      rb = 256,
      sb = 256,
      tb = rb + 1 + qb,
      ub = 30,
      vb = 19,
      wb = 16,
      xb = 17,
      yb = 18,
      zb = 2 * tb + 1,
      Ab = parseInt((eb + ab - 1) / ab, 10),
      Bb = null;
    db > Za && console.error("error: INBUFSIZ is too small"), Ta << 1 > 1 << cb && console.error(
      "error: WSIZE is too large"), eb > cb - 1 && console.error("error: HASH_BITS is too large"), (8 >
        eb || 258 !== bb) && console.error("error: Code too clever");
    var Cb = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
      Db = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13,
        13],
      Eb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
      Fb = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
      Gb = [new d(0, 0, 0, 0), new d(4, 4, 8, 4), new d(4, 5, 16, 8), new d(4, 6, 32, 32), new d(4, 4, 16,
        16), new d(8, 16, 32, 32), new d(8, 16, 128, 128), new d(8, 32, 128, 256), new d(32, 128,
          258, 1024), new d(32, 258, 258, 4096)],
      Hb = 16;
    a.exports = Q, a.exports.DEFAULT_LEVEL = Xa
  }()
}]);

// 修改挂载 window 对象为模块
export default gzip;