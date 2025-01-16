import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { TokenType, User } from '@prisma/generated'
import { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { VerificationInput } from '@/src/modules/auth/verification/inputs/verification.input'
import { MailService } from '@/src/modules/libs/mail/mail.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetaData } from '@/src/shared/utils/session-metadata.util'
import { saveSession } from '@/src/shared/utils/session.util'

@Injectable()
export class VerificationService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) {}

    public async verify(
        req: Request,
        input: VerificationInput,
        userAgent: string
    ) {
        const { token } = input

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.EMAIL_VERIFY
            }
        })

        if (!existingToken) throw new NotFoundException('Токен не найден')

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) throw new BadRequestException('Токен истёк')

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                isEmailVerified: true
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.EMAIL_VERIFY
            }
        })

        const metadata = getSessionMetaData(req, userAgent)

        return saveSession(req, user, metadata)
    }

    public async sendVerificationToken(user: User) {
        const verificationToken = await generateToken(
            this.prismaService,
            user,
            TokenType.EMAIL_VERIFY,
            true
        )

        await this.mailService.sendVerificationToken(
            user.email,
            verificationToken.token
        )

        return true
    }
}
