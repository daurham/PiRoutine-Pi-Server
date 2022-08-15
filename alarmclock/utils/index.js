const convert = require('./convert');

const getTime = () => new Date().toLocaleTimeString();

function getSecUnit(start = -4) { return this.slice(start, -3); }
String.prototype.secUnit = getSecUnit;
function getHr() { return this.slice(0, this.indexOf(':')); }
String.prototype.hr = getHr;
function getMin() { return this.slice(this.indexOf(':') + 1, this.indexOf(':', 3)); }
String.prototype.min = getMin;
function getTOD() { return this.slice(-2, this.length); }
String.prototype.tod = getTOD;

module.exports = {
  convert,
  getTime,
};
