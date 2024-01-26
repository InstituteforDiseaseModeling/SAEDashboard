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


/**
 *
 * @param {*} lower - starting value
 * @param {*} upper - ending value
 * @return {*} integer array from starting value to ending value
 */
export function createArray(lower, upper) {
  const result = [];

  for (let i=lower; i<=upper; i++) {
    result.push(i);
  }

  return result;
}
