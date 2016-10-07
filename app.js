const PORT = 8000,
      express = require('express'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      Flashies = require('./models/flashcards.js'),
      Test = require('./models/test.js'),
      app = express()

//MIDDLEWARE
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Get's a list of ALL the cards
app.get('/cards', (req, res) => {
  Flashies.getCards((err, cards) => {
    if(err) {
      return res.status(400).send(err)
    }
    res.send(cards)
  })
})

//Get questions by category
app.get('/test', (req, res) => {
  let category = req.query.category
  if(category) {
    Flashies.getCat(category, (err, catCards) => {
      if(err) {
        return res.status(404).send(err)
      }
      res.send(catCards)
    })
  } else {
    Test.startTest((err, currentView) => {
      if(err) {
        return res.status(404).send('Deck is Empty')
      }
      res.send(currentView)
    })
  }
})

//Create a flashcard with Category, Question, Answer
app.post('/cards', (req, res) => {
  Flashies.create(req.body, err => {
    if(err) return res.status(400).send(err)
  })
  res.send('New Card Created')
})

//Edit a card 
app.put('/cards/:id', (req, res) => {
  let id = req.params.id
  const { category, question, answer } = req.body
  const newCard = { category, question, answer, id }
  Flashies.editCard(newCard, (err) => {
    if(err) return res.status(404).send(err)
  })
  res.send(`Your card ID: ${newCard.id} has been updated`)
})

//Delete card by id
app.delete('/cards/:id', (req, res) => {
  let deleteID = req.params.id
  Flashies.deleteCard(deleteID, (err) => {
    if(err) return res.status(404).send(err)
  })
  res.send(`Card ${deleteID}, was deleted from your deck`)
})

app.listen(PORT, err => {
  console.log(err || `Express Listening on PORT ${8000}`)
})

