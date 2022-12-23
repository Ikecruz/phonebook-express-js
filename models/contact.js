const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
    name: String,
    number: String,
})

const Contact = model("Contact", contactSchema)

module.exports = Contact