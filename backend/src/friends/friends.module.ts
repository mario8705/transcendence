// import { Module } from '@nestjs/common';
// import { FriendsController } from './friends.controller';
// import { FriendsService } from './friends.service';
// import { PrismaModule } from '../prisma/prisma.module';

// @Module({
//   controllers: [FriendsController],
//   providers: [FriendsService],
//   imports: [PrismaModule],
// })
// export class FriendsModule {}

// import { Module } from '@nestjs/common';
// import { FriendsController } from './friends.controller';
// import { FriendsService } from './friends.service';
// import { PrismaModule } from 'src/prisma/prisma.module';
// import { PrismaClient } from '@prisma/client';
// // import { PrismaModule } from '../prisma/prisma.module';

// @Module({
//   imports: [PrismaModule],
//   controllers: [FriendsController],
//   providers: [PrismaService],
//   // providers: [FriendsService],
// })
// export class FriendsModule {}

// import { Module } from '@nestjs/common';
// import { PrismaService } from './prisma.service';

// @Module({
//  providers: [PrismaService],
//  exports: [PrismaService],
// })
// export class PrismaModule {}

// import { Module, forwardRef } from '@nestjs/common';
// // import { PrismaService } from './prisma.service';
// // import { FriendsModule } from '../friends/friends.module';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Module({
//   providers: [PrismaService],
//   exports: [PrismaService],
//   imports: [forwardRef(() => FriendsModule)],
// })
// export class PrismaModule {}

import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
