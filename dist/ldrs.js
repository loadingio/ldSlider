// Generated by LiveScript 1.3.1
var ldSlider, slice$ = [].slice;
ldSlider = function(opt){
  var root, el, mouse, this$ = this;
  opt == null && (opt = {});
  this.evtHandler = {};
  this.opt = import$({
    min: 0,
    max: 100,
    from: 0,
    step: 1
  }, opt);
  this.value = this.opt.from;
  this.root = root = typeof opt.root === 'string'
    ? document.querySelector(opt.root)
    : opt.root;
  if (this.root.tagName === 'INPUT') {
    this.input = this.root;
    ld$.attr(this.input, 'type', 'hidden');
    this.root = root = document.createElement("div");
    this.input.parentNode.insertBefore(this.root, this.input);
  }
  this.root._ldrs = this;
  this.root.classList.add('ldrs');
  this.root.innerHTML = "<div class=\"bar\">\n  <div class=\"cap\"></div>\n  <div class=\"cap\"></div>\n  <div class=\"bar-inner\">\n    <div class=\"bk\"></div>\n    <div class=\"fg\"></div>\n    <div class=\"ptr\"></div>\n    <div class=\"lock-line\"></div>\n    <div class=\"hint p\"></div>\n  </div>\n</div>\n<div class=\"hint l\"></div>\n<div class=\"hint lock\"></div>\n<div class=\"hint r\"></div>";
  this.el = el = {
    b: {
      fg: ld$.find(root, '.fg', 0)
    },
    p: ld$.find(root, '.ptr', 0),
    h: {
      p: ld$.find(root, '.hint.p', 0),
      l: ld$.find(root, '.hint.l', 0),
      r: ld$.find(root, '.hint.r', 0),
      lock: ld$.find(root, '.hint.lock', 0),
      lockLine: ld$.find(root, '.lock-line', 0)
    }
  };
  mouse = {
    move: function(e){
      return this$.repos(e.clientX, true, true);
    },
    up: function(){
      document.removeEventListener('mouseup', mouse.up);
      document.removeEventListener('mousemove', mouse.move);
      return this$.el.h.p.innerText = Math.round(10000 * this$.value) / 10000;
    },
    prepare: function(){
      document.addEventListener('mousemove', mouse.move);
      return document.addEventListener('mouseup', mouse.up);
    }
  };
  el.p.addEventListener('mousedown', mouse.prepare);
  root.addEventListener('click', mouse.move);
  root.addEventListener('mousedown', mouse.prepare);
  this.prepare();
  return this;
};
ldSlider.prototype = import$(Object.create(Object.prototype), {
  on: function(n, cb){
    var ref$;
    return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
  },
  fire: function(n){
    var v, i$, ref$, len$, cb, results$ = [];
    v = slice$.call(arguments, 1);
    for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
      cb = ref$[i$];
      results$.push(cb.apply(this, v));
    }
    return results$;
  },
  update: function(){
    return this.set(this.value);
  },
  prepare: function(){
    this.el.h.l.innerText = this.opt.min;
    this.el.h.r.innerText = this.opt.max;
    this.el.h.lock.innerHTML = "<i class=\"i-lock\"></i>";
    this.el.h.p.innerText = this.opt.from;
    this.root.classList[this.opt.limitMax != null ? 'add' : 'remove']('limit');
    return this.update();
  },
  setConfig: function(opt){
    opt == null && (opt = {});
    import$(this.opt, opt);
    return this.prepare();
  },
  set: function(v, forceNotify){
    forceNotify == null && (forceNotify = false);
    return this.repos(v, forceNotify);
  },
  get: function(){
    return this.value;
  }
  /* v is e.clientX or value, depends on is-event */,
  repos: function(v, forceNotify, isEvent){
    /* normalize value and position */
    var old, max, rbox, x, ref$, ref1$, ref2$, hbox;
    forceNotify == null && (forceNotify = false);
    isEvent == null && (isEvent = false);
    old = this.value;
    max = this.opt.limitMax != null
      ? this.opt.limitMax / 0.6
      : this.opt.max;
    rbox = this.el.p.parentNode.getBoundingClientRect();
    if (isEvent) {
      x = (ref$ = (ref2$ = v - rbox.x) > 0 ? ref2$ : 0) < (ref1$ = rbox.width) ? ref$ : ref1$;
      this.value = (max - this.opt.min) * (x / rbox.width) + this.opt.min;
    } else {
      this.value = v;
    }
    this.value = v = (ref$ = (ref1$ = Math.round(this.value / this.opt.step) * this.opt.step) > (ref2$ = this.opt.min) ? ref1$ : ref2$) < max ? ref$ : max;
    x = 100 * ((this.value - this.opt.min) / (max - this.opt.min));
    if (this.opt.limitMax != null) {
      if (x > 60) {
        x = 60;
      }
      if (this.value > this.opt.limitMax) {
        this.value = v = this.opt.limitMax;
      }
    }
    /* update value and position into view */
    hbox = this.el.h.p.getBoundingClientRect();
    this.el.h.p.innerText = Math.round(10000 * v) / 10000;
    this.el.h.p.style.left = 100 * (0.01 * x * rbox.width) / rbox.width + "%";
    this.el.h.p.style.transform = "translate(-50%,0)";
    this.el.p.style.left = x + "%";
    this.el.b.fg.style.width = x + "%";
    /* notification if necessary*/
    if (v !== old && forceNotify) {
      return this.fire('change', this.value);
    }
  }
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
