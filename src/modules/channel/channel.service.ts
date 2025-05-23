import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class ChannelService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findRecommended() {
        return this.prismaService.user.findMany({
            where: {
                isDeactivated: false
            },
            orderBy: {
                followings: {
                    _count: 'desc'
                }
            },
            include: {
                stream: true
            },
            take: 7
        })
    }

    public async findByUsername(username: string) {
        const channel = await this.prismaService.user.findUnique({
            where: {
                username,
                isDeactivated: false
            },
            include: {
                socialLinks: {
                    orderBy: {
                        position: 'asc'
                    }
                },
                stream: {
                    include: {
                        category: true
                    }
                },
                followings: true,
                sponsorshipPlans: true,
                sponsorshipSubscriptions: true
            }
        })

        if (!channel) {
            throw new NotFoundException('Канал не найден')
        }

        return channel
    }

    public async findFollowersCountByChannel(channelId: string) {
        return this.prismaService.follow.count({
            where: {
                following: {
                    id: channelId
                }
            }
        })
    }

    public async findSponsorsByChannel(channelId: string) {
        const channel = await this.prismaService.user.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            throw new NotFoundException('Канал не найден')
        }

        return this.prismaService.sponsorshipSubscription.findMany({
            where: {
                channelId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                plan: true,
                user: true,
                channel: true
            }
        })
    }
}
