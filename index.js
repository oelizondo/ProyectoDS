const request = require('request')
const cheerio = require('cheerio')
const fs      = require('fs')

const URLS = require('./URLS')
const format = require('./formatter')

const get = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error) reject(url)
      resolve([html, url])
    })
  })
}

const filterTableRows = (table, url) => {
  return new Promise((resolve, reject) => {
    let row = null
    let values = []
    for (let i = 1; i <= 9; i++) {
      row = table.children[i]
      if (typeof row !== 'undefined')
        values.push(row.children[0]['data'])
    }

    values.push(url.substr(32,7))
    resolve(values)
    reject('Error')
  })
}

const getTable = (response) => {
  const [html, url] = response
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html)
    let table = $('table').children()
    resolve([table['3'], url])
    reject('Error')
  })
}

const extractData = (response) => {
  const [table, url] = response
  return new Promise((resolve, reject) => {
    let csv = []
    if (typeof table === 'undefined')
      reject()

    table.children.shift()
    table.children.pop()
    table.children.pop()
    table.children.map(async (tr) => {
      const cleanedRow = await filterTableRows(tr, url)
      csv.push(cleanedRow)
    })
    resolve(csv)
    reject('Error')
  })
}

const writeToFile = (data) => {
  fs.appendFile('data.csv', data + ',\n', (error) => {
    if (error) console.log(error)
  })
}

const spliceDataset = (data) => {
  return new Promise((resolve, reject) => {
    data.map(writeToFile)
    resolve()
    reject('Error')
  })
}

/* MAIN */
URLS.map((url) => {
  get(url).then(getTable)
          .then(extractData)
          .then(spliceDataset)
          .then(format)
          .catch((error) => console.log(error))
})
