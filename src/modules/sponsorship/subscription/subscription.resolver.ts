import { Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/generated'

import { SubscriptionModel } from '@/src/modules/sponsorship/subscription/models/subscription.model'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { SubscriptionService } from './subscription.service'

@Resolver('Subscription')
export class SubscriptionResolver {
    public constructor(
        private readonly subscriptionService: SubscriptionService
    ) {}

    @Authorization()
    @Query(() => [SubscriptionModel], { name: 'findMySponsors' })
    public async findMySponsors(@Authorized() user: User) {
        return this.subscriptionService.findMySponsors(user)
    }
}
