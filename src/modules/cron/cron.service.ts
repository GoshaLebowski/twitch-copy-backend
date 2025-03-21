import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';



import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';





@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailService,
        private readonly storageService: StorageService,
        private readonly telegramService: TelegramService
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
            },
            include: {
                notificationSettings: true,
                stream: true
            }
        })

        for (const user of deactivatedAccount) {
            await this.mailerService.sendAccountDeletion(user.email)

            if (
                user.notificationSettings.telegramNotifications &&
                user.telegramId
            ) {
                await this.telegramService.sendAccountDeletion(user.telegramId)
            }

            if (user.avatar) {
                await this.storageService.remove(user.avatar)
            }

            if (user.stream.thumbnailUrl) {
                await this.storageService.remove(user.stream.thumbnailUrl)
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
