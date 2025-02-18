import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';



import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';





@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailService,
        private readonly storageService: StorageService
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
            if (user.avatar) {
                await this.storageService.remove(user.avatar)
            }
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
