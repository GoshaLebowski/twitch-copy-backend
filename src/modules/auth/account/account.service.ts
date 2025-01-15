import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';



import { PrismaService } from '@/src/core/prisma/prisma.service';
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input';





@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async me(id: string) {
        return this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }

    public async create(input: CreateUserInput) {
        const { username, email, password } = input
        const isUserNameExists = await this.prismaService.user.findUnique({
            where: { username }
        })

        if (isUserNameExists)
            throw new ConflictException('Это имя пользователя уже занято')

        const isUserEmailExists = await this.prismaService.user.findUnique({
            where: { email }
        })

        if (isUserEmailExists)
            throw new ConflictException('Это почта уже занят')

        await this.prismaService.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                displayName: username
            }
        })

        return true
    }
}
