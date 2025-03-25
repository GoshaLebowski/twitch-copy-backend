import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreatePlanInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    title: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    description?: string

    @Field(() => Number)
    @IsNotEmpty()
    @IsNumber()
    price: number
}
