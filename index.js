const express = require('express');
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
// app.use(morgan(function(tokens, req, res) {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms',
//         tokens.post_data
//     ].join(' ')
// }))
morgan.token('post-data', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data"))
let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    return String(Math.floor(Math.random() * (2 ** 32)))
}

app.get("/api/persons", (req, res) => {
    return res.json(persons)
})

app.get("/info", (req, res) => {
    return res.send(`
        <h1>Phonebook has info for ${persons.length} people</h1>
        <p>${Date()}</p>
        `)
})
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (!person) {
        return res.status(404).end()
    }

    return res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    console.log('what is this?')
    persons = persons.filter(p => p.id !== id)

    return res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    if ((!body.name || !body.number) || persons.find(p => p.name == body.name)) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    const person = {
        name: body.name,
        number: body.number || "",
        id: generateId(),
    }

    persons = persons.concat(person)
    return res.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})
