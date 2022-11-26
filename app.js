const express = require('express')
const app = express()

const PORT = 8080

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('Welcome to PhoneBook API')
})

app.get('/info', (req, res) => {
    const contactCounts = contacts.length
    const requestTime = (new Date()).toUTCString()

    res.status(200).send(
        ` 
            Phonebook has info for ${contactCounts} people
            ${requestTime}
        `
    )
})

app.get('/api/persons', (req, res) => {
    res.status(200).send(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const contact = contacts.find( cont => cont.id == id)

    if (contact) {
        res.status(200).send(contact)
    } else{
        res.status(400).send({error: "No contact found"})
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const { id  } = req.params
    const contact = contacts.find( cont => cont.id == id)
    
    if (contact) {
        contacts = contacts.filter(cont => cont.id != id)
        res.status(200).send({message: "Contact deleted"})
    } else{
        res.status(400).send({error: "No contact found"})
    }

})

app.post('/api/persons', (req, res) => {

    const { name, number } = req.body

    if (!name || !number){
        res.status(400).send({error: 'Invalid request body'})
    } else {

        const contact = contacts.find( cont => cont.name == name)

        if (contact) {
            res.status(400).send({error: 'Name already exists'})
        } else{
            const newContact = { ...req.body, id: uid() }
            contacts.push(newContact)
            res.status(200).send({message: 'Contact added'})
        }

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