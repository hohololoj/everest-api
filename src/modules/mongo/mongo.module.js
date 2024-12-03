import { Module } from "@nestjs/common";
import properties from '../../properties.json';
import mongoose from "mongoose";

@Module({

})
export class MongoModule{
    constructor(){
        this.MONGO_CONNECTION_STRING = properties.mongoString;
        this.CONNECTION = mongoose.connect(MONGO_CONNECTION_STRING);
    }
    get(collectionName, properties){
        return new Promise((resolve, reject) => {
            const collection = this.CONNECTION.collection(collectionName);
            resolve(collection.findOne(properties));
        })
    }
    getMany(collectionName, properties){
        return new Promise((resolve, reject) => {
            const collection = this.CONNECTION.collection(collectionName);
            resolve(collection.findMany(properties));
        })
    }
    insert(){

    }
};