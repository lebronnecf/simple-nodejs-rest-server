const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const defaultPort = 8080

const books = require('./books.json')

app.get('/books', (req,res) => {
    const author = req.query.author
    if (author === undefined) {
        res.status(200).json(books)
    } else {
        const authBooks = books.filter(b => b.author === author)
        if (authBooks.length === 0) {res.status(204).send()}
        else {res.status(200).json(authBooks)}
    }
})

app.get('/books/:id', (req,res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        res.status(400).send('An id must be an integer')
        return
    }
    const book = findById(books, id)
    if (book === undefined) {
        res.status(404).send('No book with this id: ' + id)
    } else {
        res.status(200).json(book)
    }
})

app.post('/books', (req,res) => {
    const id = req.body.id
    if (id === undefined || isNaN(id)) {res.status(400).send("You must provide an integer 'id'")}
    else if (req.body.author === undefined || req.body.title === undefined) { res.status(400).send("A book must have a title and an author")}
    else if (findById(books, id) !== undefined) { res.status(400).send("A book with this id already exists: ") }
    else {
        books.push(req.body)
        res.status(201).json(findById(books, id))
    }
})

app.post('/books', (req,res) => {
    const id = req.body.id
    if (id === undefined || isNaN(id)) {res.status(400).send("You must provide an integer 'id'")}
    else if (req.body.author === undefined || req.body.title === undefined) { res.status(400).send("A book must have a title and an author")}
    else if (findById(books, id) !== undefined) { res.status(400).send("A book with this id already exists: ") }
    else {
        books.push(req.body)
        res.status(201).json(findById(books, id))
    }
})

app.put('/books/:id', (req,res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) { res.status(400).send("You must provide an integer 'id'") } 
    else {
        const book = findById(books, id)
        if (book === undefined) { res.status(404).send('No book with this id: ' + id) }
        else if (req.body.author === undefined || req.body.title === undefined) { res.status(400).send("A book must have a title and an author")} 
        else {
            book.title = req.body.title
            book.author = req.body.author
            res.status(200).json(book)
        }
    }
})

app.delete('books/:id', (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) { res.status(400).send('An id must be an integer') } 
    else if (findById(books, id) === undefined) { res.status(404).send('No book with this id: ' + id) }
    else {
        books = books.filter(b => b.id !== id)
        res.status(200).json(books)
    }
})

// Démarrage du serveur
app.listen(process.env.PORT || defaultPort, 
    () => console.log("Server is running..."))

function findById(collection, id) {
    return collection.find(b => b.id === id)
}