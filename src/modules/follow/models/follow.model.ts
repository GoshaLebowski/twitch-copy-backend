import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Follow } from '@prisma/generated'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class FollowModel implements Follow {
    @Field(() => ID)
    id: string

    @Field(() => UserModel)
    follower: UserModel

    @Field(() => String)
    followerId: string

    @Field(() => UserModel)
    following: UserModel

    @Field(() => String)
    followingId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
