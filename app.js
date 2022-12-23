const express = require('express')
const { start } = require('./config/db')
const Contact = require('./models/contact')
const app = express()

require('dotenv').config()

const PORT = 8080

start()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('Welcome to PhoneBook API')
})

app.get('/info', async (req, res) => {
    let contactCounts = await Contact.count({})
    const requestTime = (new Date()).toUTCString()

    res.status(200).send(
        ` 
            Phonebook has info for ${contactCounts} people
            ${requestTime}
        `
    )
})

app.get('/api/persons', async (req, res) => {
    const contacts = await Contact.find({})
    res.status(200).send(contacts)
})

app.get('/api/persons/:id', async (req, res) => {
    const { id } = req.params
    const contact = await Contact.findById(id)

    if (contact) {
        res.status(200).send(contact)
    } else{
        res.status(400).send({error: "No contact found"})
    }
})

app.delete('/api/persons/:id', async (req, res) => {
    const { id  } = req.params
    const contact = await Contact.findById(id)

    if (contact) {
        await Contact.deleteOne({ _id: id })
        res.status(200).send(contact)
    }
    else {
        res.status(400).send({error: "No contact found"})
    }

})

app.post('/api/persons', async (req, res) => {

    const { name, number } = req.body

    if (!name || !number){
        res.status(400).send({error: 'Invalid request body'})
    } else {

        const nameExists = await Contact.findOne({ name: name })
        const numberExists = await Contact.findOne({ number: number })

        if (nameExists || numberExists) {
            res.status(400).send({error: 'Contact with Name or Number already exists'})
            return
        }

        await Contact.create({ name, number })
        res.status(200).send({message: 'Contact added'})
    }

})

app.patch('/api/persons/:id', async (req, res) => {

    const { id } = req.params

    const { name, number } = req.body
    const contact = await Contact.findById(id)

    if (!contact) {
        res.status(400).send({error: "No contact found"})
        return
    }

    if (!name || !number){
        res.status(400).send({error: 'Invalid request body'})
    } else {

        const nameExists = await Contact.findOne({ name: name, _id: {$ne: id} })
        const numberExists = await Contact.findOne({ number: number,  _id: {$ne: id} })

        if (nameExists || numberExists) {
            res.status(400).send({error: 'Contact with Name or Number already exists'})
            return
        }

        await Contact.updateOne( {_id: id} ,{ name, number })
        res.status(200).send({message: 'Contact updated'})
    }

})

app.listen(PORT, () => {
    console.log(`
          ########  ########    ##       ## #########  
         ##         ##      ##  ##       ##        ##
        ##          ##       ## ##       ##       ## 
        ##          ##  ######  ##       ##     ## 
        ##          ##   ##     ##       ##   ##
         ##         ##    ##     ##     ##  ##
          ######### ##     ####   #######   #########
    `)
    console.log(`Server running at http://localhost:${PORT}`)
})