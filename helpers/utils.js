// const average = (nums) => Math.round(nums.reduce((a, b) => a + b) / nums.length)
const average = (nums) => nums.reduce((a, b) => a + b) / nums.length

module.exports = { average }
