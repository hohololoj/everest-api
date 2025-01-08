import {Controller, Bind, Body, Dependencies, Get, Post, Delete, UseInterceptors, UploadedFile, Param} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { MongoService } from '../mongo/mongo.service';
import { FilesystemService } from '../fliesystem/filesystem.service';
import { ObjectId } from 'mongodb';
import path from 'node:path'

@Controller('/news')
@Dependencies(MongoService, FilesystemService)
export class NewsController{
    constructor(MongoService, FilesystemService){
        this.MongoService = MongoService;
        this.FilesystemService = FilesystemService;
    }
    getAllNews(){
        return new Promise((resolve, reject) => {
            const news = this.MongoService.getMany('news', {})
            resolve(news);
        })
    }
    getNewsItem(nid){
        this.MongoService.update('news', {_id: new ObjectId(nid)}, {$inc: {views: 1}});
        return new Promise((resolve, reject) => {
            const props = {_id: new ObjectId(nid)}
            const newsItem = this.MongoService.get('news', props)
            resolve(newsItem)
        })
    }
    @Get(':type')
    @Bind(Param())
    getNews(param){
        switch(param.type){
            case 'list':{
                return this.getAllNews();
            }
            default:{
                return this.getNewsItem(param.type);
            }
        }
    }
    @Post()
    @UseInterceptors(FileInterceptor('img'))
    @Bind(UploadedFile(), Body())
    addNews(file, body){
        return new Promise((resolve, reject) => {
            this.FilesystemService.saveFile('/news', file.originalname.match(/\.([^.]+)$|$/)[1], file.buffer)
            .then((filename) => {
                const tags = body.tags.split('#');
                tags.splice(0, 1);
                const newsItem = {
                    timestamp: Date.now(),
                    title: body.maintitle,
                    img: filename,
                    html: body.html,
                    tags: tags,
                    views: 0
                }
                this.MongoService.insert('news', newsItem)
                .then(()=>{
                    resolve();
                })
            })
        })
    }
    @Delete()
    @Bind(Body())
    deleteNews(body){
        const id = new ObjectId(body.nid);
        this.MongoService.get('news', {_id: id})
        .then((newsItem) => {
            return Promise.all([
                this.FilesystemService.deleteFile(newsItem.img),
                this.MongoService.delete('news', {_id: body.nid})
            ])
        })
    }
}