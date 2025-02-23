import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class ChangeStreamInfoInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    title?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    categoryId?: string
}
