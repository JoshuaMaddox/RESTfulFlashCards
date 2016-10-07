const fs = require('fs'),
      path = require('path'),
      Flashies = require('./flashcards'),
      dataBase = path.join(__dirname, '../data/data.json'),
      testDataBase = path.join(__dirname, '../data/test.json')


//Get all Flashcards in a Readable Format
exports.getTestCards = function(cb){
  fs.readFile(testDataBase, (err, buffer) => {
    if(err) return cb(err)
      try {
        var testObj = JSON.parse(buffer)
      } catch(e) {
        var testObj = []
      }
      cb(null, testObj)
  })
}

//Writes to the test.json file 
exports.write = function(newData, cb) {
  console.log('newData: ', newData)
  let json = JSON.stringify(newData)
  fs.writeFile(testDataBase, json, cb)
}

//Runs the test
exports.startTest = function(cb){
  exports.getTestCards((err, testObj) => {
    const { testDeck, next } = testObj
    if(!testDeck[0]){
      cb(null, 'Test Deck is out of Cards. Go add more by using query strings. test?category=whateverCategory&category=whateverCategory')
    } else if (next === false){
      cb(null, testDeck[0].question)
      testObj.next = true
      exports.write(testObj)
    }
    if(next === true){
      cb(null, testDeck[0].answer)
      testDeck.shift()
      testObj.next = false
      exports.write(testObj)
    }
  })
}




