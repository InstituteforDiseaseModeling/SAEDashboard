/**
 * check to see if input string is a json string
 * @param {*} str
 * @return {bool} true if input string is a json string and false otherwise.
 */
export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
