import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { ChatMessage } from '@/prisma/generated'

import { UserModel } from '../../auth/account/models/user.model'
import { StreamModel } from '../../stream/models/stream.model'

@ObjectType()
export class ChatMessageModel implements ChatMessage {
    @Field(() => ID)
    id: string

    @Field(() => String)
    text: string

    @Field(() => UserModel)
    user: UserModel

    @Field(() => String)
    userId: string

    @Field(() => StreamModel)
    stream: StreamModel

    @Field(() => String)
    streamId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
