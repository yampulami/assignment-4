const express = require('express'),
  app = express()

app.use(express.static('public'))

app.get('/breeds', (req, res) => {
  res
    .contentType('application/json')
    .status(200)
    .send({
      message: {
        african: [],
        airedale: [],
        australian: ['shepherd'],
        buhund: ['norwegian'],
        bulldog: ['boston', 'english', 'french'],
        greyhound: ['italian']
      }
    })
})

const images = {
  african: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
  airedale: ['1.jpg', '2.jpg', '3.jpg'],
  australian: {
    shepherd: ['1.jpg', '2.jpg', '3.jpg']
  },
  buhund: {
    norwegian: ['1.jpg', '2.jpg', '3.jpg']
  },
  bulldog: {
    boston: ['1.jpg', '2.jpg', '3.jpg'],
    english: ['1.jpg', '2.jpg', '3.jpg'],
    french: ['1.jpg', '2.jpg', '3.jpg']
  },
  greyhound: {
    italian: ['1.jpg', '2.jpg', '3.jpg']
  }
}

app.get('/image/:breed', (req, res) => {
  const { breed } = req.params

  if (breed in images && images[breed]?.length > 1) {
    res
      .status(200)
      .contentType('application/json')
      .send({
        status: 'success',
        message:
          `/img/${breed}/${getRandomItemFromArray(images[breed])}`
      })
  } else {
    res.status(404).send({ message: 'Breed not found', status: 'error' })
  }
})

app.get('/image/:breed/:type', (req, res) => {
  const { breed, type } = req.params

  if (breed in images && type in images[breed]) {
    res
      .status(200)
      .contentType('application/json')
      .send({
        status: 'success',
        message:
          `/img/${breed}-${type}/${getRandomItemFromArray(images[breed][type])}`
      })
  } else {
    res.status(404).send({ message: 'Breed not found', status: 'error' })
  }
})

app.listen(3000, () => {
  console.log('Listening on port 3000: http://localhost:3000')
})

const randInt = (n) => Math.floor(n * Math.random()) // returns random integer between 0 and n, not including n
const getRandomItemFromArray = (arr) => arr[randInt(arr.length)] // returns a random item from an array
