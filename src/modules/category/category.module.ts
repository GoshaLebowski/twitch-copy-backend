import { Module } from '@nestjs/common'

import { CategoryResolver } from '@/src/modules/category/category.resolver'

import { CategoryService } from './category.service'

@Module({
    providers: [CategoryService, CategoryResolver]
})
export class CategoryModule {}
