import {Controller, Bind, Body, Dependencies, Get, Post, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { MongoService } from '../mongo/mongo.service';
import { FilesystemService } from '../fliesystem/filesystem.service';
import { ObjectId } from 'mongodb';

@Controller('/categories')
@Dependencies(MongoService, FilesystemService)
export class CategoriesController{
    constructor(MongoService, FilesystemService){
        this.MongoService = MongoService;
        this.FilesystemService = FilesystemService;
    }
    @Get()
    getCategories(){
        return this.MongoService.getMany('categories', {})
    }
    @Post()
    @UseInterceptors(FileInterceptor('categoryImage'))
    @Bind(UploadedFile(), Body())
    postCategories(files, body){
        this.FilesystemService.saveFile('/categories', files.originalname.match(/\.([^.]+)$|$/)[1], files.buffer)
        .then((filename) => {
            const category = {
                name: body.name,
                image: filename
            }
            return this.MongoService.insert('categories', category, true)
        })
    }
    @Delete()
    @Bind(Body())
    deleteCategories(body){
        body._id = new ObjectId(body._id);
        this.MongoService.get('categories', body)
        .then((category) => {
            const filename = category.image;
            console.log(filename);
            return Promise.all([
                this.MongoService.delete('categories', body),
                this.FilesystemService.deleteFile(filename)
            ])
        })
    }
};