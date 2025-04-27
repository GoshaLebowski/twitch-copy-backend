import { Field, ID, ObjectType } from '@nestjs/graphql';



import { SponsorshipSubscription } from '@/prisma/generated';
import { UserModel } from '@/src/modules/auth/account/models/user.model'

import { PlanModel } from '../../plan/models/plan.model'





@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
    @Field(() => ID)
    id: string

    @Field(() => Date)
    expiresAt: Date

    @Field(() => PlanModel)
    plan: PlanModel

    @Field(() => String)
    planId: string

    @Field(() => UserModel)
    user: UserModel

    @Field(() => String)
    userId: string

    @Field(() => UserModel)
    channel: UserModel

    @Field(() => String)
    channelId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
