const mongoose = require("mongoose")

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

console.log("connecting to database")
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log("connected to mongoDB")
    })
    .catch(error => {
        console.log("error connecting to mongoDB", error)
    })
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => /^\d\d\d?-\d*$/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, "person phone number is required"]
    },
})
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('person', personSchema)
