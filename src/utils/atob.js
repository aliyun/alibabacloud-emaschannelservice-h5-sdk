// https://github.com/davidchambers/Base64.js/blob/master/base64.js
export default (input) => {
  try {
    if (typeof window !== 'undefined' && atob) {
      // miniapp里这里会报错
      return atob(input)
    }  
  } catch(e) { console.log(e); }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
  if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
  let output = '';
  for (
    // initialize result and counters
    let bc = 0, bs, buffer, idx = 0;
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
  return output;
};