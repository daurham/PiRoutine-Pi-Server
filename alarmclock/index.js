/**
 * Intiate the alarmclock by running Clock.
 *  We pass in an empty options argument for default run.
 *
 *
 * Clock({ options? });
 *
 * options = {
 *   noPump: boolean
 *   reasonToStop: function
 *   clockCallback: function
 *   isTest: boolean | object {
 *                      alarmOne: string
 *                      alarmTwo: string
 *                      fsewSecIntoAlarmOne = string
 *                   }
 * }
 */
require('./Clock').Clock({ noPump: true });
