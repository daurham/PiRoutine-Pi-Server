/**
 * TEST can be ran with:
 *    npm run test -- test.test.js
 * @param {number} a
 * @param {number} b
 * @returns number
 */
const sum = (a, b) => a + b;

for (let i = 0; i <= 5; i += 1) {
  for (let j = 0; j <= 5; j += 1) {
    test('adding numbers ' + i + ' & ' + j + ' toBe:' + (i + j) + '' , () => {
      expect(sum(i, j)).toBe(i + j);
    });
  }
}
