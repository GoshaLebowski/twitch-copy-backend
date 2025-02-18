import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';



import { getGraphQLConfig } from '@/src/core/config/graphql.config';
import { AccountModule } from '@/src/modules/auth/account/account.module';
import { DeactivateModule } from '@/src/modules/auth/deactivate/deactivate.module';
import { PasswordRecoveryModule } from '@/src/modules/auth/password-recovery/password-recovery.module';
import { SessionModule } from '@/src/modules/auth/session/session.module';
import { TotpModule } from '@/src/modules/auth/totp/totp.module';
import { VerificationModule } from '@/src/modules/auth/verification/verification.module';
import { CronModule } from '@/src/modules/cron/cron.module';
import { MailModule } from '@/src/modules/libs/mail/mail.module';
import { StorageModule } from '@/src/modules/libs/storage/storage.module';
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
        PrismaModule,
        RedisModule,
        AccountModule,
        SessionModule,
        VerificationModule,
        MailModule,
        CronModule,
        PasswordRecoveryModule,
        TotpModule,
        DeactivateModule,
        StorageModule
    ]
})
export class CoreModule {}
