import { Optional } from '@nestjs/common'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Stream } from '@prisma/generated'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class StreamModel implements Stream {
    @Field(() => ID)
    id: string

    @Field(() => String)
    title: string

    @Optional()
    @Field(() => String, { nullable: true })
    thumbnailUrl: string

    @Optional()
    @Field(() => String, { nullable: true })
    ingressId: string

    @Optional()
    @Field(() => String, { nullable: true })
    serverUrl: string

    @Optional()
    @Field(() => String, { nullable: true })
    streamKey: string

    @Field(() => Boolean)
    isLive: boolean

    @Field(() => UserModel)
    user: UserModel

    @Field(() => String)
    userId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
