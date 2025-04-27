import { Field, ID, ObjectType } from '@nestjs/graphql';



import type { User } from '@/prisma/generated';
import { FollowModel } from '@/src/modules/follow/models/follow.model';
import { NotificationSettingsModel } from '@/src/modules/notification/models/notification-settings.model';
import { NotificationModel } from '@/src/modules/notification/models/notification.model';
import { PlanModel } from '@/src/modules/sponsorship/plan/models/plan.model';
import { SubscriptionModel } from '@/src/modules/sponsorship/subscription/models/subscription.model';
import { StreamModel } from '@/src/modules/stream/models/stream.model';



import { SocialLinkModel } from '../../profile/models/social-link.model';





@ObjectType()
export class UserModel implements User {
    @Field(() => ID)
    id: string

    @Field(() => String)
    email: string

    @Field(() => String)
    password: string

    @Field(() => String)
    username: string

    @Field(() => String)
    displayName: string

    @Field(() => String, { nullable: true })
    avatar: string

    @Field(() => String, { nullable: true })
    bio: string

    @Field(() => String, { nullable: true })
    telegramId: string

    @Field(() => Boolean)
    isVerified: boolean

    @Field(() => Boolean)
    isEmailVerified: boolean

    @Field(() => Boolean)
    isTotpEnabled: boolean

    @Field(() => String, { nullable: true })
    totpSecret: string

    @Field(() => Boolean)
    isDeactivated: boolean

    @Field(() => Date, { nullable: true })
    deactivatedAt: Date

    @Field(() => [SocialLinkModel])
    socialLinks: SocialLinkModel[]

    @Field(() => StreamModel)
    stream: StreamModel

    @Field(() => [NotificationModel])
    notifications: NotificationModel[]

    @Field(() => NotificationSettingsModel)
    notificationSettings: NotificationSettingsModel

    @Field(() => [FollowModel])
    followers: FollowModel[]

    @Field(() => [FollowModel])
    followings: FollowModel[]

    @Field(() => [PlanModel])
    sponsorshipPlans: PlanModel[]

    @Field(() => [SubscriptionModel])
    sponsorshipSubscriptions: SubscriptionModel[]

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}