let URLS = []
for (let j = 77; j <= 99; j++)
  for (let i = 1; i <= 12; i++)
    i < 10 ? URLS.push('https://en.tutiempo.net/climate/0' + i + '-19' + j + '/ws-763930.html')
           : URLS.push('https://en.tutiempo.net/climate/' + i + '-19' + j + '/ws-763930.html')

for (let i = 0; i <= 17; i++) {
  for (let j = 1; j <= 12; j++) {
    if (i < 10 && j < 10)
      URLS.push('https://en.tutiempo.net/climate/0' + j + '-200' + i + '/ws-763930.html')
    else if (i >= 10 && j >= 10)
      URLS.push('https://en.tutiempo.net/climate/' + j + '-20' + i + '/ws-763930.html')
    else if (i < 10 && j >= 10)
      URLS.push('https://en.tutiempo.net/climate/' + j + '-200' + i + '/ws-763930.html')
    else if (i >= 10 && j < 10)
      URLS.push('https://en.tutiempo.net/climate/0' + j + '-20' + i + '/ws-763930.html')
  }
}

// ['https://en.tutiempo.net/climate/01-2017/ws-763930.html']

module.exports = URLS

