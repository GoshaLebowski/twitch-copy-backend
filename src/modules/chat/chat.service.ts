import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import type { User } from '@prisma/generated'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeChatSettingsInput } from '@/src/modules/chat/input/change-chat-settings.input'
import { SendMessageInput } from '@/src/modules/chat/input/send-message.input'

@Injectable()
export class ChatService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findByStream(streamId: string) {
        return this.prismaService.chatMessage.findMany({
            where: {
                streamId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        })
    }

    public async sendMessage(userId: string, input: SendMessageInput) {
        const { text, streamId } = input

        const stream = await this.prismaService.stream.findUnique({
            where: {
                id: streamId
            }
        })

        if (!stream) {
            throw new NotFoundException('Стрим не найден')
        }

        if (!stream.isLive) {
            throw new BadRequestException('Стрим не в режиме живого вещания')
        }

        return this.prismaService.chatMessage.create({
            data: {
                text,
                user: {
                    connect: {
                        id: userId
                    }
                },
                stream: {
                    connect: {
                        id: streamId
                    }
                }
            },
            include: {
                stream: true,
                user: true
            }
        })
    }

    public async changeSettings(user: User, input: ChangeChatSettingsInput) {
        const {
            isChatEnabled,
            isChatFollowersOnly,
            isChatPremiumFollowersOnly
        } = input

        await this.prismaService.stream.update({
            where: {
                userId: user.id
            },
            data: {
                isChatEnabled,
                isChatFollowersOnly,
                isChatPremiumFollowersOnly
            }
        })

        return true
    }
}
