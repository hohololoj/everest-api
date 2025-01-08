import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { MongoModule } from "../mongo/mongo.module";
import { FilesystemModule } from "../fliesystem/filesystem.module";

@Module({
    imports: [MongoModule, FilesystemModule],
    controllers: [CategoriesController]
})
export class CategoriesModule{};