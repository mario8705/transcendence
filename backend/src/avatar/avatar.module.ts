// /* eslint-disable prettier/prettier */
// import { Module } from "@nestjs/common";
// import { AvatarController } from "./avatar.controller";
// import { AvatarService } from "./avatar.service";
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from "path";
// import { PrismaClient } from "@prisma/client";

// @Module({
//     controllers: [AvatarController],
//     providers: [
//         AvatarService,
//         PrismaClient
//     ],
//     imports: [
//         ServeStaticModule.forRoot({
//             rootPath: join(process.cwd(), 'uploads'),
//             serveRoot: '/static/',
//         }),
//     ],
// })
// export class AvatarModule {}