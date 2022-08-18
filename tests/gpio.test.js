/**
 * Run:
 *  npm run gpio
 * to test gpio modules in an isolated environment.
 */

const { runPump } = require('../alarmclock/gpio');

runPump('test');
