import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input'
import { ResetPasswordInput } from '@/src/modules/auth/password-recovery/inputs/reset-password.input'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorators'
import { GqlContext } from '@/src/shared/types/gql-context.types'

import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
    public constructor(
        private readonly passwordRecoveryService: PasswordRecoveryService
    ) {}

    @Mutation(() => Boolean, { name: 'resetPassword' })
    public async resetPassword(
        @Context() { req }: GqlContext,
        @Args('data') input: ResetPasswordInput,
        @UserAgent() userAgent: string
    ) {
        return this.passwordRecoveryService.resetPassword(req, input, userAgent)
    }

    @Mutation(() => Boolean, { name: 'newPassword' })
    public async newPassword(@Args('data') input: NewPasswordInput) {
        return this.passwordRecoveryService.newPassword(input)
    }
}
