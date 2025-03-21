import { Injectable } from '@nestjs/common'
import { NotificationType, TokenType, type User } from '@prisma/generated'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeNotificationsSettingsInput } from '@/src/modules/notification/inputs/change-notifications-settings.input'
import { generateToken } from '@/src/shared/utils/generate-token.util'

@Injectable()
export class NotificationService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findUnreadCount(user: User) {
        return this.prismaService.notification.count({
            where: {
                isRead: false,
                userId: user.id
            }
        })
    }

    public async findByUser(user: User) {
        await this.prismaService.notification.updateMany({
            where: {
                isRead: false,
                userId: user.id
            },
            data: {
                isRead: true
            }
        })

        return this.prismaService.notification.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    public async createStreamStart(userId: string, channel: User) {
        return this.prismaService.notification.create({
            data: {
                message: `<b className='font-medium'>Не пропустите!</b>
				<p>Присоединяйтесь к стриму на канале <a href='/${channel.username}' className='font-semibold'>${channel.displayName}</a>.</p>`,
                type: NotificationType.STREAM_START,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    public async createNewFollowing(userId: string, follower: User) {
        return this.prismaService.notification.create({
            data: {
                message: `<b className='font-medium'>У вас новый подписчик!</b>
				<p>Это пользователь <a href='/${follower.username}' className='font-semibold'>${follower.displayName}</a>.</p>`,
                type: NotificationType.NEW_FOLLOWER,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    public async createEnableTwoFactor(userId: string) {
        return this.prismaService.notification.create({
            data: {
                message: `<b className='font-medium'>Обеспечьте свою безопасность!</b>
				<p>Включите двухфакторную аутентификацию в настройках вашего аккаунта, чтобы повысить уровень защиты.</p>`,
                type: NotificationType.ENABLE_TWO_FACTOR,
                userId
            }
        })
    }

    public async createVerifyChannel(userId: string) {
        return this.prismaService.notification.create({
            data: {
                message: `<b className='font-medium'>Поздравляем!</b>
			  <p>Ваш канал верифицирован, и теперь рядом с вашим каналом будет галочка.</p>`,
                type: NotificationType.VERIFIED_CHANNEL,
                userId
            }
        })
    }

    public async changeSettings(
        user: User,
        input: ChangeNotificationsSettingsInput
    ) {
        const { siteNotifications, telegramNotifications } = input

        const notificationSettings =
            await this.prismaService.notificationSettings.upsert({
                where: {
                    userId: user.id
                },
                create: {
                    siteNotifications,
                    telegramNotifications,
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                },
                update: {
                    siteNotifications,
                    telegramNotifications
                },
                include: {
                    user: true
                }
            })

        if (
            notificationSettings.telegramNotifications &&
            !notificationSettings.user.telegramId
        ) {
            const telegramAuthToken = await generateToken(
                this.prismaService,
                user,
                TokenType.TELEGRAM_AUTH,
                true
            )

            return {
                notificationSettings,
                telegramAuthToken: telegramAuthToken.token
            }
        }

        if (
            !notificationSettings.telegramNotifications &&
            notificationSettings.user.telegramId
        ) {
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    telegramId: null
                }
            })

            return { notificationSettings }
        }

        return { notificationSettings }
    }
}
