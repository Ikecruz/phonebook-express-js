const mongoose = require("mongoose")
const { mongo_db_url } = require("./config")

const start = async () => {

    try {
        await mongoose.connect(mongo_db_url)
        console.log("Database Is Connected")
    } catch(e) {
        console.error(e)
    }

}

module.exports = {
    start
}