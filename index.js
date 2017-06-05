const request = require('request')
const cheerio = require('cheerio')
const fs      = require('fs')

const URLS = require('./URLS')
const format = require('./formatter')

const get = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error) reject(error)
      resolve([html, url])
    })
  })
}

const filterTableRows = (table, url) => {
  return new Promise((resolve, reject) => {
    let row = null
    let values = []
    for (let i = 0; i <= 9; i++) {
      row = table.children[i]
      if (typeof row === 'undefined')
        continue
      values.push(row.children[0]['data'])
    }
    values.push(url.substr(32,7))
    resolve(values)
    reject('Error')
  })
}

const getTable = (response) => {
  const html = response[0]
  const url  = response[1]
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html)
    let table = $('table').children()
    resolve([table['3'], url])
    reject('Error')
  })
}

const extractData = (response) => {
  const table = response[0]
  const url   = response[1]
  return new Promise((resolve, reject) => {
    let csv = []
    if (typeof table === 'undefined')
      reject('Hung up')

    table.children.map(async (tr, index) => {
      let cleanedRow = null
      if (index != 0 && (index != 32 || index != 33)) {
        cleanedRow = await filterTableRows(tr, url)
        csv.push(cleanedRow)
      }
    })
    resolve(csv)
    reject('Error')
  })
}

const spliceDataset = (data) => {
  return new Promise((resolve, reject) => {
    let flatData = []
    data.map((row) => row.map((data) =>  flatData.push(data)))
    for (let i = 11; i < flatData.length; i+=11)
      flatData.splice(i, 1, '\n')

    resolve(flatData)
    reject('Error')
  })
}

const writeToFile = (data) => {
  fs.appendFile('data.csv', data, (error) => {
    if (error) console.log(error)
    console.log('Done')
  })
}


/* MAIN */
URLS.map((url) => {
  get(url).then(getTable)
          .then(extractData)
          .then(spliceDataset)
          .then(writeToFile)
          .catch((error) => console.log(error))
})