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
  this.root.innerHTML = "<div class=\"bar\">\n  <div class=\"cap\"></div>\n  <div class=\"bk\"></div>\n  <div class=\"fg\"></div>\n  <div class=\"cap\"></div>\n</div>\n<div class=\"ptr\"></div>\n<div class=\"hint l\"></div>\n<div class=\"hint r\"></div>\n<div class=\"hint p\"></div>";
  this.el = el = {
    b: {
      fg: ld$.find(root, '.fg', 0)
    },
    p: ld$.find(root, '.ptr', 0),
    h: {
      p: ld$.find(root, '.hint.p', 0),
      l: ld$.find(root, '.hint.l', 0),
      r: ld$.find(root, '.hint.r', 0)
    }
  };
  mouse = {
    move: function(e){
      return this$.tmp(e.clientX, true, true);
    },
    up: function(){
      document.removeEventListener('mouseup', mouse.up);
      return document.removeEventListener('mousemove', mouse.move);
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
    this.el.h.p.innerText = this.opt.from;
    return this.update();
  },
  setConfig: function(opt){
    opt == null && (opt = {});
    import$(this.opt, opt);
    return this.prepare();
  },
  set: function(v, forceNotify){
    forceNotify == null && (forceNotify = false);
    return this.tmp(v, forceNotify);
  },
  get: function(){
    return this.value;
  }
  /* v is e.clientX or value, depends on is-event */,
  tmp: function(v, forceNotify, isEvent){
    /* normalize value and position */
    var old, box, b, x, ref$, ref1$, ref2$, ref3$, toP;
    forceNotify == null && (forceNotify = false);
    isEvent == null && (isEvent = false);
    old = this.value;
    box = this.el.p.parentNode.getBoundingClientRect();
    b = [10, box.width - 10];
    if (isEvent) {
      x = (ref$ = (ref2$ = v - box.x) > (ref3$ = b[0]) ? ref2$ : ref3$) < (ref1$ = b[1]) ? ref$ : ref1$;
      this.value = (this.opt.max - this.opt.min) * ((x - b[0]) / (b[1] - b[0])) + this.opt.min;
    } else {
      this.value = v;
    }
    this.value = v = (ref$ = (ref2$ = Math.round(this.value / this.opt.step) * this.opt.step) > (ref3$ = this.opt.min) ? ref2$ : ref3$) < (ref1$ = this.opt.max) ? ref$ : ref1$;
    x = ((this.value - this.opt.min) / (this.opt.max - this.opt.min)) * (b[1] - b[0]) + b[0];
    /* update value and position into view */
    toP = function(it){
      return 100 * (it - b[0]) / (b[1] - b[0]);
    };
    this.el.h.p.innerText = Math.round(10000 * v) / 10000;
    box = this.el.h.p.getBoundingClientRect();
    this.el.h.p.style.left = toP(x - Math.round(box.width * 0.5) + 1) + "%";
    this.el.p.style.left = toP(x) + "%";
    this.el.b.fg.style.width = toP(x - 10) + "%";
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
