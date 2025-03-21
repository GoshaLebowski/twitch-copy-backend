import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/generated';



import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationService } from '@/src/modules/notification/notification.service';





@Injectable()
export class FollowService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly notificationService: NotificationService
    ) {}

    public async findMyFollowers(user: User) {
        return this.prismaService.follow.findMany({
            where: {
                followingId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                follower: true
            }
        })
    }

    public async findMyFollowings(user: User) {
        return this.prismaService.follow.findMany({
            where: {
                followerId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                following: true
            }
        })
    }

    public async follow(user: User, channelId: string) {
        const channel = await this.prismaService.user.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            throw new NotFoundException('Канал не найден')
        }

        if (channel.id === user.id) {
            throw new ConflictException('Нельзя подписаться на себя')
        }

        const existingFollow = await this.prismaService.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id
            }
        })

        if (existingFollow) {
            throw new ConflictException('Вы уже подписаны на этот канал')
        }

        const follow = await this.prismaService.follow.create({
            data: {
                followerId: user.id,
                followingId: channel.id
            },
            include: {
                follower: true,
                following: {
                    include: {
                        notificationSettings: true
                    }
                }
            }
        })

        if (follow.following.notificationSettings.siteNotifications === true) {
            await this.notificationService.createNewFollowing(
                follow.following.id,
                follow.follower
            )
        }

        return true
    }

    public async unfollow(user: User, channelId: string) {
        const channel = await this.prismaService.user.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            throw new NotFoundException('Канал не найден')
        }

        if (channel.id === user.id) {
            throw new ConflictException('Нельзя отписаться на себя')
        }

        const existingFollow = await this.prismaService.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id
            }
        })

        if (!existingFollow) {
            throw new ConflictException('Вы не подписаны на этот канал')
        }

        await this.prismaService.follow.delete({
            where: {
                id: existingFollow.id,
                followerId: user.id,
                followingId: channel.id
            }
        })

        return true
    }
}
