import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { hash } from 'argon2';



import { DefaultArgs } from '@/prisma/generated/runtime/library';



import { Prisma, PrismaClient } from '../../../prisma/generated';



import { CATEGORIES } from './data/categories.data';
import { STREAMS } from './data/streams.data';
import { USERNAMES } from './data/users.data';





const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
})

ConfigModule.forRoot()
const configService = new ConfigService()
const ownerEmail = `${configService.getOrThrow<string>('OWNER_EMAIL')}`
const ownerPassword = `${configService.getOrThrow<string>('OWNER_PASSWORD')}`
const ownerUsername = `${configService.getOrThrow<string>('OWNER_USERNAME')}`

function getRandomCategory(categories: { id: string; slug: string }[]) {
    if (!categories.length) throw new Error('Нет доступных категорий')
    return categories[Math.floor(Math.random() * categories.length)]
}

async function createUserAndStream(
    tx: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >,
    username: string,
    password: string | Buffer<ArrayBufferLike>,
    categories: { id: string; slug: string }[]
) {
    const randomCategory = getRandomCategory(categories)
    const userExists = await tx.user.findUnique({ where: { username } })
    if (userExists) return

    const createdUser = await tx.user.create({
        data: {
            email: `${username}@teastream.ru`,
            password: await hash(password),
            username,
            displayName: username,
            avatar: `/channels/${username}.webp`,
            isEmailVerified: true,
            socialLinks: {
                createMany: {
                    data: [
                        {
                            title: 'Telegram',
                            url: `https://t.me/${username}`,
                            position: 1
                        },
                        {
                            title: 'YouTube',
                            url: `https://youtube.com/@${username}`,
                            position: 2
                        }
                    ]
                }
            }
        }
    })

    const randomTitle = (
        STREAMS[randomCategory.slug] || ['Стрим без названия']
    ).sort(() => Math.random() - 0.5)[0]

    await tx.stream.create({
        data: {
            title: randomTitle,
            thumbnailUrl: `/streams/${createdUser.username}.webp`,
            user: { connect: { id: createdUser.id } },
            category: { connect: { id: randomCategory.id } }
        }
    })

    await tx.notificationSettings.create({
        data: {
            siteNotifications: true,
            telegramNotifications: false,
            userId: createdUser.id
        }
    })
    Logger.log(
        `Пользователь "${createdUser.username}" и его стрим, а также настройка уведомлений успешно созданы`
    )
}

async function main() {
    try {
        Logger.log('Начало заполнения базы данных')
        await prisma.$transaction([
            prisma.user.deleteMany(),
            prisma.socialLink.deleteMany(),
            prisma.stream.deleteMany(),
            prisma.category.deleteMany()
        ])
        await prisma.category.createMany({ data: CATEGORIES })
        Logger.log('Категории успешно созданы')
        const categories = await prisma.category.findMany()

        await prisma.$transaction(async tx => {
            for (const username of USERNAMES) {
                await createUserAndStream(tx, username, '12345678', categories)
            }

            Logger.log('Создание основного пользователя')
            const ownerUser = await tx.user.create({
                data: {
                    email: ownerEmail,
                    password: await hash(ownerPassword),
                    username: ownerUsername,
                    displayName: ownerUsername,
                    avatar: `/channels/${ownerUsername}.webp`,
                    isEmailVerified: true,
                    socialLinks: {
                        createMany: {
                            data: [
                                {
                                    title: 'Telegram',
                                    url: `https://t.me/${ownerUsername}`,
                                    position: 1
                                },
                                {
                                    title: 'YouTube',
                                    url: `https://youtube.com/@${ownerUsername}`,
                                    position: 2
                                }
                            ]
                        }
                    }
                }
            })

            const ownerCategory = getRandomCategory(categories)
            const ownerTitle = (
                STREAMS[ownerCategory.slug] || ['Стрим без названия']
            ).sort(() => Math.random() - 0.5)[0]

            await tx.stream.create({
                data: {
                    title: ownerTitle,
                    thumbnailUrl: `/streams/${ownerUser.username}.webp`,
                    user: { connect: { id: ownerUser.id } },
                    category: { connect: { id: ownerCategory.id } }
                }
            })

            await tx.notificationSettings.create({
                data: {
                    siteNotifications: true,
                    telegramNotifications: false,
                    userId: ownerUser.id
                }
            })
            Logger.log(
                `Основной пользователь "${ownerUser.username}" и его стрим, а также настройка уведомлений успешно созданы`
            )
        })
        Logger.log('Заполнение базы данных завершено успешно')
    } catch (error) {
        Logger.error(error)
        throw new BadRequestException('Ошибка при заполнении базы данных')
    } finally {
        Logger.log('Закрытие соединения с базой данных...')
        await prisma.$disconnect()
        Logger.log('Соединение с базой данных успешно закрыто')
    }
}

main()
