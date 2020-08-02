// const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;
const url = "mongodb+srv://dieudv:dieudv@cluster0.tp6vh.mongodb.net/test?retryWrites=true&w=majority";

module.exports = {
    url: url
};