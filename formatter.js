const fs = require('fs')

const parseBuffer = () => {
  return new Promise((resolve, reject) => {
    const bufferData = fs.readFileSync('data.csv')
    resolve(bufferData.toString().split('\n'))
    reject('Error')
  })
}

const removeEmptyRows = (rawData) => {
  return new Promise((resolve, reject) => {
    const polishedData = rawData.filter((row) => {
      let hyphens = 0
      row.split('').forEach((number) => {
        if (number == '-') hyphens++
      })
      return hyphens < 3
    })
    resolve(polishedData)
    reject('Error')
  })
}

const writeToFile = (polishedData) => {
  fs.writeFileSync('cleanData.csv', polishedData.join('\n'))
}

module.exports = function () {
  return new Promise((resolve, reject) => {
    parseBuffer().then(removeEmptyRows)
                 .then(writeToFile)
                 .catch((error) => console.log(error))
    resolve()
    reject()
  })
}