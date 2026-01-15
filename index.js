require("dotenv").config()
const express = require('express');
const Person = require("./models/person")
const morgan = require('morgan')

const app = express()
morgan.token('post-data', function(req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data"))

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        res.send(`
        <h1>Phonebook has info for ${persons.length} people</h1>
        <p>${Date()}</p>
        `)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(result)
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number || ""
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const { name, number } = req.body
    console.log(name, number)

    Person.findById(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(updatePerson => {
                res.json(updatePerson)
            })
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
