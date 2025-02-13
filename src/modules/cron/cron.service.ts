import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { MailService } from '@/src/modules/libs/mail/mail.service'

@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailService
    ) {}

    @Cron('0 0 * * *')
    public async deleteDeactivateAccounts() {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const deactivatedAccount = await this.prismaService.user.findMany({
            where: {
                isDeactivated: true,
                deactivateAt: {
                    lte: sevenDaysAgo
                }
            }
        })

        for (const user of deactivatedAccount) {
            await this.mailerService.sendAccountDeletion(user.email)
        }

        await this.prismaService.user.deleteMany({
            where: {
                isDeactivated: true,
                deactivateAt: {
                    lte: sevenDaysAgo
                }
            }
        })
    }
}
