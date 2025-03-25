import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';



import { getGraphQLConfig } from '@/src/core/config/graphql.config';
import { getLiveKitConfig } from '@/src/core/config/livekit.config';
import { getStripeConfig } from '@/src/core/config/stripe.config';
import { AccountModule } from '@/src/modules/auth/account/account.module';
import { DeactivateModule } from '@/src/modules/auth/deactivate/deactivate.module';
import { PasswordRecoveryModule } from '@/src/modules/auth/password-recovery/password-recovery.module';
import { ProfileModule } from '@/src/modules/auth/profile/profile.module';
import { SessionModule } from '@/src/modules/auth/session/session.module';
import { TotpModule } from '@/src/modules/auth/totp/totp.module';
import { VerificationModule } from '@/src/modules/auth/verification/verification.module';
import { CategoryModule } from '@/src/modules/category/category.module';
import { ChannelModule } from '@/src/modules/channel/channel.module';
import { ChatModule } from '@/src/modules/chat/chat.module';
import { CronModule } from '@/src/modules/cron/cron.module';
import { FollowModule } from '@/src/modules/follow/follow.module';
import { LivekitModule } from '@/src/modules/libs/livekit/livekit.module';
import { MailModule } from '@/src/modules/libs/mail/mail.module';
import { StorageModule } from '@/src/modules/libs/storage/storage.module';
import { StripeModule } from '@/src/modules/libs/stripe/stripe.module';
import { TelegramModule } from '@/src/modules/libs/telegram/telegram.module';
import { NotificationModule } from '@/src/modules/notification/notification.module';
import { PlanModule } from '@/src/modules/sponsorship/plan/plan.module';
import { SubscriptionModule } from '@/src/modules/sponsorship/subscription/subscription.module';
import { TransactionModule } from '@/src/modules/sponsorship/transaction/transaction.module';
import { IngressModule } from '@/src/modules/stream/ingress/ingress.module';
import { StreamModule } from '@/src/modules/stream/stream.module';
import { WebhookModule } from '@/src/modules/webhook/webhook.module';
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util';



import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';





@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true
        }),
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule],
            useFactory: getGraphQLConfig,
            inject: [ConfigService]
        }),
        LivekitModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getLiveKitConfig,
            inject: [ConfigService]
        }),
        StripeModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getStripeConfig,
            inject: [ConfigService]
        }),
        PrismaModule,
        RedisModule,
        AccountModule,
        SessionModule,
        ProfileModule,
        VerificationModule,
        MailModule,
        CronModule,
        PasswordRecoveryModule,
        TotpModule,
        DeactivateModule,
        StorageModule,
        StreamModule,
        IngressModule,
        WebhookModule,
        CategoryModule,
        ChatModule,
        FollowModule,
        ChannelModule,
        NotificationModule,
        TelegramModule,
        PlanModule,
        TransactionModule,
        SubscriptionModule
    ]
})
export class CoreModule {}
