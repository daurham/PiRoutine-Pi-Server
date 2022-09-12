const checkTestLogs = ({
  alarm1,
  alarm2,
  aFewSecIntoAlarm1,
  aFewSecIntoAlarm2,
  isDisarmed,
  streakCount,
  skipThisDate,
}) => {
  console.log('|>>->_TEST_RUNNING--->>>>>');
  // console.log(theCurrentTime());
  console.log('alarmtime1', alarm1());
  console.log('alarmtime2', alarm2());
  console.log('fewSecAfterAlarm1Time', aFewSecIntoAlarm1());
  console.log('fewSecAfterAlarm2Time', aFewSecIntoAlarm2());
  console.log('isDisarmed', isDisarmed());
  console.log('streak', streakCount());
  console.log('skipThisDate', skipThisDate());
  // console.log('resetStreak', getStreakCount());
  // console.log('Increment Streak', incrementStreak());
  // console.log('Run Pump', runPump('test'));
  // console.log('Run Alarm', runAlarm());
  console.log('<-<<__TEST_RUNNING---<<<<<|');
};

module.exports = { checkTestLogs };
