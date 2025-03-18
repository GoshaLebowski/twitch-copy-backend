import { Optional } from '@nestjs/common'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Category } from '@prisma/generated'

import { StreamModel } from '@/src/modules/stream/models/stream.model'

@ObjectType()
export class CategoryModel implements Category {
    @Field(() => ID)
    id: string

    @Field(() => String)
    title: string

    @Field(() => String)
    slug: string

    @Optional()
    @Field(() => String, { nullable: true })
    description: string

    @Field(() => [StreamModel])
    streams: StreamModel[]

    @Field(() => String)
    thumbnailUrl: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
