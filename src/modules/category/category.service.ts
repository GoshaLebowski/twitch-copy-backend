import { Injectable, NotFoundException } from '@nestjs/common'



import { PrismaService } from '@/src/core/prisma/prisma.service';





@Injectable()
export class CategoryService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findAll() {
        return this.prismaService.category.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true,
                    }
                }
            }
        })
    }

    public async findRandom() {
        const total = await this.prismaService.category.count()

        const randomIndexes = new Set<number>()

        while (randomIndexes.size < 7) {
            const randomIndex = Math.floor(Math.random() * total)
            randomIndexes.add(randomIndex)
        }

        const categories = await this.prismaService.category.findMany({
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true,
                    }
                }
            },
            take: total,
            skip: 0
        })

        return Array.from(randomIndexes).map(index => categories[index])
    }

    public async findBySlug(slug: string) {
        const category = await this.prismaService.category.findUnique({
            where: {
                slug
            },
            include: {
                streams: {
                    include: {
                        user: true,
                        category: true
                    }
                }
            }
        })

        if (!category) {
            throw new NotFoundException('Категория не найдена')
        }

        return category
    }
}
