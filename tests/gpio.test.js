/**
 * Run:
 *      npm run test --gpio.test.js
 *    To test gpio modules in an isolated environment.
 *
 * These tests are observation-based.
 */

//* Test Pi relay switch & runPump function
const { runPump } = require('../alarmclock/gpio');

runPump('test');
// */
