import {Controller, Injectable, Get, Request, Bind, Response} from '@nestjs/common';
import path from 'node:path'

@Injectable()
@Controller('public/cdn/*/:filename')
export class CDNController{
    constructor(){
        
    }
    @Get()
    @Bind(Request(), Response())
    getFile(req, res){
        res.sendFile(path.resolve(`public/cdn/${req.params['0']}/${req.params.filename}`))
    }
}