const fs = require('fs'),
      _ = require('lodash'),
      path = require('path'),
      uuid = require('uuid'),
      dataBase = path.join(__dirname, '../data/data.json'),
      testDataBase = path.join(__dirname, '../data/test.json')

//Get all Flashcards in a Readable Format
exports.getCards = function(cb){
  fs.readFile(dataBase, (err, buffer) => {
    if(err) return cb(err)
      try{
        var cards = JSON.parse(buffer)
      } catch(e) {
        var cards = []
      }
      cb(null, cards)
  })
}

//Write whatever is fed in to JSON
exports.write = function(newData, cb) {
  let json = JSON.stringify(newData)
  fs.writeFile(dataBase, json, cb)
}

//Create a new flashcard
exports.create = function(newCard, cb) {
  exports.getCards((err, cards) => {
    if(err) return cb(err)
    newCard.id = uuid()
    cards.push(newCard)
    exports.write(cards, cb)
  })
}

exports.getCat = function(category, cb) {
  exports.getCards((err, cards) => {
    let catCards = []
    if(err) return cb(err) 
    cards.forEach((card) => {
      if(category.includes(card.category) || card.category === category){
       catCards.push(card)
      }
    })
    cb(null, catCards)
    testObj = {
      testDeck: _.shuffle(catCards),
      next: false
    }
    testDeck = JSON.stringify(testObj)
    fs.writeFile(testDataBase, testDeck)
  })
}

//Update card by ID
exports.editCard = function(newCard, cb) {
  const { id, question, answer, category } = newCard
  exports.getCards((err, cards) => {
    if(err) return cb(err)
    let editedDeck = cards.map((card, index) => {
      if(id === card.id) {
        card.category = category
        card.question = question
        card.answer = answer
        return card
      } else {
        return card
      }
    })
    exports.write(editedDeck)
  })
}

//Delete card by ID
exports.deleteCard = function(deleteID, cb) {
  exports.getCards((err, cards) => {
    if(err) return cb(err)
    let newDeck = cards.filter((card, index) => {
      if(deleteID !== card.id){
        return card
      } 
    })
    exports.write(newDeck)  
  })
  cb()
}
