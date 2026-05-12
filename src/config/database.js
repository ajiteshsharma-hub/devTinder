const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb://ajitesh_db_user:user1234@ac-cdsbrte-shard-00-00.dzeqrz7.mongodb.net:27017,ac-cdsbrte-shard-00-01.dzeqrz7.mongodb.net:27017,ac-cdsbrte-shard-00-02.dzeqrz7.mongodb.net:27017/?ssl=true&replicaSet=atlas-5n5x6d-shard-0&authSource=admin&appName=Cluster0/devTinder"
    );
};

module.exports = {
    connectDB
}

