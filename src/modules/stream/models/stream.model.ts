import { Optional } from '@nestjs/common';
import { Field, ID, ObjectType } from '@nestjs/graphql';



import type { Stream } from '@/prisma/generated'

import { UserModel } from '../../auth/account/models/user.model'
import { CategoryModel } from '../../category/models/category.model'
import { ChatMessageModel } from '../../chat/models/chat-message.model'





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

    @Field(() => Boolean)
    isChatEnabled: boolean

    @Field(() => Boolean)
    isChatFollowersOnly: boolean

    @Field(() => Boolean)
    isChatPremiumFollowersOnly: boolean

    @Field(() => UserModel)
    user: UserModel

    @Field(() => String)
    userId: string

    @Optional()
    @Field(() => CategoryModel, { nullable: true })
    category: CategoryModel

    @Optional()
    @Field(() => String, { nullable: true })
    categoryId: string

    @Field(() => [ChatMessageModel])
    chatMessages: ChatMessageModel[]

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
