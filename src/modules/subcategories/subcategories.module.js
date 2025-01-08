import { Module } from "@nestjs/common";
import { MongoModule } from "../mongo/mongo.module";
import { FilesystemModule } from "../fliesystem/filesystem.module";
import SubcategoriesController from "./subcategories.controller";

@Module({
    imports: [MongoModule, FilesystemModule],
    controllers: [SubcategoriesController]
})
export class SubcategoriesModule{}