import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import type { GqlContext } from '@/src/shared/types/gql-context.types'

import { SessionService } from './session.service'
import { LoginUserInput } from '@/src/modules/auth/session/inputs/login-user.input'

@Resolver('Session')
export class SessionResolver {
    public constructor(private readonly sessionService: SessionService) {}

    @Mutation(() => UserModel, { name: 'loginUser' })
    public async login(
        @Context() { req }: GqlContext,
        @Args('data') input: LoginUserInput
    ) {
        return this.sessionService.login(req, input)
    }

    @Mutation(() => Boolean, { name: 'logoutUser' })
    public async logout(@Context() { req }: GqlContext) {
        return this.sessionService.logout(req)
    }
}
