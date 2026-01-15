const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://raahimabdullah142_db_user:${password}@cluster0.9rozfor.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })
const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('phonebook', phonebookSchema)
if (process.argv.length < 5) {
    Phonebook.find({}).then(result => {
        result.forEach(phonebook => {
            console.log(phonebook)
        })
        mongoose.connection.close()
    })
} else {

    const name = process.argv[3]
    const number = process.argv[4]
    const phonebook = new Phonebook({
        name,
        number
    })
    phonebook.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
