import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import path from 'node:path';

@Injectable()
export class FilesystemService{
    constructor(){
        this.BASE_DIR = 'public/cdn';
    }
    generateFileName(){
        const chars = `abcdefghijklmnopqrstuvwxyz123456789`;
        let name = '';
        for(let i = 0; i < 9; i++){
            const rand = Math.floor(Math.random() * (chars.length)) + 0
            name += chars[rand]; 
        }
        return name
    }
    saveFile(dir, ext, buffer){
        return new Promise((resolve, reject) => {
            const randName = this.generateFileName();
            fs.writeFile(`${this.BASE_DIR}${dir}/${randName}.${ext}`, buffer, (err)=>{
                if(err) console.log(err);
                resolve(`${this.BASE_DIR}${dir}/${randName}.${ext}`)
            })  
        })
    }
    deleteFile(filename){
        return new Promise((resolve, reject) => {
            fs.unlink(path.resolve(filename), (err)=>{
                if(err) console.log(err);
                resolve();
            })
        })
    }
}