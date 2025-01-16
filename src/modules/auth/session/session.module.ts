import { Module } from '@nestjs/common';



import { VerificationService } from '@/src/modules/auth/verification/verification.service';



import { SessionResolver } from './session.resolver';
import { SessionService } from './session.service';





@Module({
    providers: [SessionResolver, SessionService, VerificationService]
})
export class SessionModule {}
