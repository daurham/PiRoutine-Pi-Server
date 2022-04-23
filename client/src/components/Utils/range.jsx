export default function range(s, e, st = 1) {
  let result = [s];
  if (s === e) { return [e] }
  if (s < e) { result = [...result, ...range(s + st, e)] }
  return result;
};