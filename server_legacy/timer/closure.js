const main = () => {

  let state = true;

  const f = () => {
      state = !state;
        return state
  }

  const f2 = () => {
    if (state) return 'yes'
    if (!state) return 'no'
  }

const f3 = () => {
  if (f2() === 'no') return 'ItsFALSE';
}
    // return () => {
    //   // console.log(state);
    // }

  return { f, f2, f3 };

}
const fn = main();

module.exports = { fn };