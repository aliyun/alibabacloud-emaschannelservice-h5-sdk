// simple commonJS cookie reader, best perf according to http://jsperf.com/cookie-parsing
export default function(name) {
  var cookie = document.cookie,
    setPos = cookie.search(new RegExp('\\b' + name + '=')),
    stopPos = cookie.indexOf(';', setPos),
    res;
  if (!~setPos) return null;
  res = decodeURIComponent(cookie.substring(setPos, ~stopPos ? stopPos : undefined).split('=')[1]);
  return res;
};