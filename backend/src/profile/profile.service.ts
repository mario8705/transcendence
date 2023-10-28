/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaClient) {}
    
    async getProfileInfos(pseudo: string): Promise<any> {
        return this.prisma.user.findUnique({
            where: { pseudo: pseudo },
            include: { achievements: true },
        });
    }
}