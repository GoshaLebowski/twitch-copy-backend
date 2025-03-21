import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import type { User } from '@prisma/generated';



import { SocialLinkModel } from '@/src/modules/auth/profile/models/social-link.model';
import { FollowModel } from '@/src/modules/follow/models/follow.model';
import { NotificationSettingsModel } from '@/src/modules/notification/models/notification-settings.model';
import { NotificationModel } from '@/src/modules/notification/models/notification.model';
import { StreamModel } from '@/src/modules/stream/models/stream.model';





@ObjectType()
export class UserModel implements Omit<User, 'password'> {
    @Field(() => ID)
    id: string

    @Field(() => String)
    email: string

    @Field(() => String)
    username: string

    @Field(() => String)
    displayName: string

    @HideField()
    password?: string

    @Field(() => String, { nullable: true })
    avatar: string

    @Field(() => String, { nullable: true })
    telegramId: string

    @Field(() => String, { nullable: true })
    bio: string

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
    deactivateAt: Date

    @Field(() => [SocialLinkModel])
    socialLinks: SocialLinkModel[]

    @Field(() => StreamModel)
    stream: StreamModel

    @Field(() => [NotificationModel])
    notifications: NotificationModel[]

    @Field(() => NotificationSettingsModel)
    notificationSettings: NotificationSettingsModel

    @Field(() => FollowModel)
    followers: FollowModel[]

    @Field(() => [FollowModel])
    followings: FollowModel[]

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
