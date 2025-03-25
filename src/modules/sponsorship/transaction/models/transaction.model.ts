import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { type Transaction, TransactionStatus } from '@/prisma/generated'
import { UserModel } from '@/src/modules/auth/account/models/user.model'

registerEnumType(TransactionStatus, {
    name: 'TransactionStatus'
})

@ObjectType()
export class TransactionModel implements Transaction {
    @Field(() => ID)
    id: string

    @Field(() => Number)
    amount: number

    @Field(() => String)
    currency: string

    @Field(() => String)
    stripeSubscriptionId: string

    @Field(() => TransactionStatus)
    status: TransactionStatus

    @Field(() => UserModel)
    user: UserModel

    @Field(() => String)
    userId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
