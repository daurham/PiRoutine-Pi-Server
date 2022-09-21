/**
 * Intiate the alarmclock by running Clock.
 *  We pass in an empty options argument for default run.
 *
 *
 * Clock({ options });
 *
 * options = {
 *   disablePump?: boolean
 *   reasonToStop?: function
 *   clockCallback?: function
 *   isTest?: boolean | object {
 *                      alarmOne: string
 *                      alarmTwo: string
 *                      fsewSecIntoAlarmOne = string
 *                   }
 * }
 */
require('./Clock').Clock({ disablePump: true });
