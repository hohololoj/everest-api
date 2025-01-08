import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { MongoModule } from "../mongo/mongo.module";
import { FilesystemModule } from "../fliesystem/filesystem.module";

@Module({
    imports : [MongoModule, FilesystemModule],
    controllers: [NewsController]
})
export class NewsModule{}