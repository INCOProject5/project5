const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

module.exports = {
  hbsHelpers: {
    getDay: (value) => weekdays[value - 1],
    truncTime: (value) => value.slice(0, 5),
    ConvertRateTo5stars: (value) => Math.floor(Math.round(value) / 2),
    printChecked: (userValue, inputValue) => {
      console.log(userValue, '---', inputValue)
      return userValue === inputValue ? 'checked="checked"' : ''
    },
  },
}
