import properties from '../../../properties.json';
import {Injectable, Dependencies} from '@nestjs/common'
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

@Injectable()
export class MongoService{
    constructor(){
        this.MONGO_CONNECTION_STRING = properties.mongoString;
        this.CONNECTION = new MongoClient(this.MONGO_CONNECTION_STRING);
        // MongoClient.connect();
        // // this.DB = this.CONNECTION.db('everest');
    }
    async get(collectionName, properties){
        return new Promise((resolve, reject) => {
            this.getCollection(collectionName)
            .then((collection) => {
                resolve(collection.findOne(properties));
            })
        })
    }
    async getMany(collectionName, properties){
        return new Promise((resolve, reject) => {
            this.getCollection(collectionName)
            .then((collection) => {
                resolve(collection.find(properties).toArray());
            })
        })
    }
    async delete(collectionName, properties){
        const id = new ObjectId(properties._id)
        return new Promise((resolve, reject) => {
            this.getCollection(collectionName)
            .then((collection) => {
                resolve(collection.deleteOne({_id: id}))
            })
        })
    }
    async getCollection(collectionName){
        return new Promise((resolve, reject)=>{
            this.CONNECTION.connect();
            const db = this.CONNECTION.db('everest');
            resolve(db.collection(collectionName));
        })
    }
    async useNoRepeat(target, collection){
        return new Promise((resolve, reject)=>{
            new Promise((resolve, reject) => {
                const data = collection.findOne(target);
                resolve(data);
            })
            .then((data) => {
                const pushPromise = new Promise((resolve, reject) => {
                    if(data === null){
                        collection.insertOne(target)
                    }
                    resolve();
                })
                pushPromise.then(()=>{
                    resolve(data === null ? {status: true} : {status: false})
                })
            })
        })
    }

    //rule - правило noRepeat для записи в бд
    async insert(collectionName, data, rule){
        return new Promise((resolve, reject) => {
            this.getCollection(collectionName)
            .then((collection)=>{
                if(rule && rule !== undefined && rule !== null){
                    this.useNoRepeat(data, collection)
                    .then((status)=>{
                        resolve(status)
                    })
                }
                else{
                    new Promise((resolve, reject) => {
                        collection.insertOne(data)
                        resolve({status: true})
                    })
                   .then((status)=>{resolve(status)})
                }
            })
        })
    }
    async update(collectionName, properties, data){
        return new Promise((resolve, reject) => {
            this.getCollection(collectionName)
            .then((collection) => {
                resolve(collection.updateOne(properties, data))
            })
        })
    }
}