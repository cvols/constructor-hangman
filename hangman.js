var inquirer = require('inquirer')
var isLetter = require('is-letter')

var Word = require('./word.js')
var Game = require('./game.js')

var hangManDisplay = Game.newWord.hangman

var wordBank = Game.newWord.wordList
var guessesRemaining = 10
var guessedLetters = []
var display = 0
var currentWord

startGame()

function startGame() {
    console.log('---------------------------------------------------------')
    console.log('')
    console.log('Welcome to NHL Hangman!')
    console.log('')
    console.log('---------------------------------------------------------')

    // clears guessedLetters before a new game starts if it's not already empty.
    if (guessedLetters.length > 0) {
        guessedLetters = []
    }

    inquirer.prompt([
        {
            name: 'play',
            type: 'confirm',
            message: 'Ready to play?'
        }
    ]).then(function (answer) {
        if (answer.play) {
            console.log('')            
            console.log('You get 10 guesses to guess the right NHL team name.')
            console.log('Good Luck!')
            newGame()
        } else {
            console.log('Good then leave you little biotch')
        }
    })
}

function newGame() {
    if (guessesRemaining === 10) {
        console.log('---------------------------------------------------------')

        // generates random number based on the wordBank
        var randNum = Math.floor(Math.random() * wordBank.length)
        currentWord = new Word(wordBank[randNum])
        currentWord.getLetters()

        // displays current word as blanks.
        console.log('')
        console.log(currentWord.wordRender())
        console.log('')
        keepPromptingUser()
    } else {
        resetGuessesRemaining()
        newGame()
    }
}

function resetGuessesRemaining() {
    guessesRemaining = 10
}

function keepPromptingUser() {
    inquirer.prompt([
        {
            name: 'chosenLetter',
            type: 'input',
            message: 'Choose a letter',
            validate: function(value) {
                if (isLetter(value)) {
                    return true
                } else {
                    return false
                }
            }
        }
    ]).then(function(ltr) {
        var letterReturned = (ltr.chosenLetter).toUpperCase()

        var guessedAlready = false
        for (var i = 0; i < guessedLetters.length; i++) {
            if(letterReturned === guessedLetters[i]) {
                guessedAlready = true
            }
        }

        if (guessedAlready === false) {
            guessedLetters.push(letterReturned)

            var found = currentWord.checkIfLetterFound(letterReturned)

            if (found === 0) {
                console.log('Haha wrong guess!')

                guessesRemaining--
                display++

                console.log('Guesses reamaining: ' + guessesRemaining)
                console.log(hangManDisplay[display - 1])

                console.log('---------------------------------------------------------')
                console.log('')
                console.log(currentWord.wordRender())
                console.log('')
                console.log('---------------------------------------------------------')
                console.log('Letters guessed: ' + guessedLetters)
            } else {
                console.log('Yes! You are correct!!')

                if (currentWord.checkWord() === true) {
                    console.log('')
                    console.log(currentWord.wordRender())
                    console.log('')
                    console.log('----- YOU WIN -----')
                    startGame()
                } else {
                    console.log('Guesses remaining: ' + guessesRemaining)
                    console.log('')
                    console.log(currentWord.wordRender())
                    console.log('')
                    console.log('---------------------------------------------------------')
                    console.log('Letters guessed: ' + guessedLetters)
                }
            }

            if (guessesRemaining > 0 && currentWord.wordFound === false) {
                keepPromptingUser();
            } else if (guessesRemaining === 0) {
                console.log('')                
                console.log('----- GAME OVER -----')
                console.log('')
                console.log('The word you were trying to guess was: ' + currentWord.word)
                console.log('')                
            }
        } else {
            console.log('You"ve guessed that letter already, try again.')
            keepPromptingUser();
        }
    })
}