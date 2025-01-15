import {
    type CanActivate,
    type ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class GqlAuthGuard implements CanActivate {
    public constructor(private readonly prismaService: PrismaService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const request = ctx.getContext().req
        if (typeof request.session.userId === 'undefined') {
            throw new UnauthorizedException('Пользователь не авторизован')
        }

        request.user = await this.prismaService.user.findUnique({
            where: {
                id: request.session.userId
            }
        })

        return true
    }
}
