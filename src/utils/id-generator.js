export default function() {
  return Date.now() % 100000000 + '_' + Math.round(Math.random() * 10000)
};