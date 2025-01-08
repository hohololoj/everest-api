import { Controller, Dependencies, Get, Post, Delete, Bind, Body, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { MongoService } from '../mongo/mongo.service';
import { FilesystemService } from '../fliesystem/filesystem.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongodb';

@Controller('subcategories')
@Dependencies(MongoService, FilesystemService)
export default class SubcategoriesController{
    constructor(MongoService, FilesystemService){
        this.MongoService = MongoService;
        this.FilesystemService = FilesystemService;
    }
    @Get(['', ':category'])
    @Bind(Param('category'))
    getSubcategories(category){
        switch(category){
            case undefined:{
                return new Promise((resolve, reject) => {
                    this.MongoService.getMany('subcategories', {})
                    .then((subcategories) => {
                        const subcategories_toReturn = {};
                        subcategories.map((subcategory) => {
                            const category = subcategory.category;
                            
                            if(subcategories_toReturn[category] === undefined){
                                subcategories_toReturn[category] = [];
                            }
                            subcategories_toReturn[category].push({_id: subcategory._id, name: subcategory.name, category: subcategory.category, image: subcategory.image})
                        })
                        resolve(subcategories_toReturn);
                    })
                })
            }
            default:{
                return new Promise((resolve, reject) => {
                    this.MongoService.getMany('subcategories', {category: category})
                    .then((subcategory) => {
                        resolve(subcategory);
                    })
                })
            }
        }
    }
    @Post()
    @UseInterceptors(FileInterceptor('subCategoryImage'))
    @Bind(UploadedFile(), Body())
    addSubcategory(file, body){
        this.FilesystemService.saveFile('/subcategories', file.originalname.match(/\.([^.]+)$|$/)[1], file.buffer)
        .then((filename) => {
            const subcategory = {
                name: body.name,
                category: body.category,
                image: filename
            }
            return this.MongoService.insert('subcategories', subcategory, true)
        })
        
    }
    @Delete()
    @Bind(Body())
    deleteSubcategory(body){
        body = {_id: new ObjectId(body._id)}
        this.MongoService.get('subcategories', body)
        .then((subcategory) => {
            const image = subcategory.image;
            return Promise.all([
                this.FilesystemService.deleteFile(image),
                this.MongoService.delete('subcategories', body)
            ])
        })
    }
}