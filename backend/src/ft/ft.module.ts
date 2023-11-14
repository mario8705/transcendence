/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FortyTwoService } from './ft.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [
        FortyTwoService,
    ],
    imports: [
        HttpModule.registerAsync({
            useFactory: async () => ({
                timeout: 5000,
                maxRedirects: 5,
                baseURL: 'https://api.intra.42.fr',
            }),
        }),
    ],
    exports: [
        FortyTwoService,
    ]
})
export class FortyTwoModule {}
