import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'

import {
    StripeOptionsSymbol,
    type TypeStripeOptions
} from '@/src/modules/libs/stripe/types/strip.types'

@Injectable()
export class StripeService extends Stripe {
    public constructor(
        @Inject(StripeOptionsSymbol)
        private readonly options: TypeStripeOptions
    ) {
        super(options.apiKey, options.config)
    }
}
