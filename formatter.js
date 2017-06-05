const fs = require('fs')

const parseBuffer = () => {
  return new Promise((resolve, reject) => {
    const bufferData = fs.readFileSync('data.csv')
    resolve(bufferData.toString().split('\n'))
    reject('Error')
  })
}

const removeCommas = (stringedData) => {
  return new Promise((resolve, reject) => {
    const formattedData = stringedData.map((row) => {
      row.replace(/,,/, '')
      return row[0] == ',' ? row.slice(1, row.length) : row
    })
    resolve(formattedData)
    reject('Error')
  })
}

const removeUselessData = (rawData) => {
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

parseBuffer().then(removeCommas)
             .then(removeUselessData)
             .then(writeToFile)
             .catch((error) => console.log(error))