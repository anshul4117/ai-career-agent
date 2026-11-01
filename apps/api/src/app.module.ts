import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { ResumesModule } from "./resumes/resumes.module";
import { JobsModule } from "./jobs/jobs.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    ResumesModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
