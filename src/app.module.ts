import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BarsModule } from './bars/bars.module';
import { DistilleriesModule } from './distilleries/distilleries.module';
import { EventsModule } from './events/events.module';
import { BlogsModule } from './blogs/blogs.module';
import { HomepageModule } from './homepage/homepage.module';
import { UploadModule } from './upload/upload.module';

// Entities
import { User } from './users/entities/user.entity';
import { Bar } from './bars/entities/bar.entity';
import { Distillery } from './distilleries/entities/distillery.entity';
import { Event } from './events/entities/event.entity';
import { Blog } from './blogs/entities/blog.entity';
import { HomepageContent } from './homepage/entities/homepage-content.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_DATABASE || 'byfoods_cms'}`,
      entities: [User, Bar, Distillery, Event, Blog, HomepageContent],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    BarsModule,
    DistilleriesModule,
    EventsModule,
    BlogsModule,
    HomepageModule,
    UploadModule,
  ],
})
export class AppModule {}
