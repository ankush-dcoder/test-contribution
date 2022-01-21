const axios = require('axios')

module.exports.run = async () => {
  const res = await axios.get('https://jsonplaceholdr.typicode.com/todos/1')
  console.log(res.data)
  return res.data
}
