import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.CINEMACTRL_DB_HOST ?? 'localhost',
      port: parseInt(process.env.CINEMACTRL_DB_PORT ?? "5432", 10),
      username: process.env.CINEMACTRL_DB_USER ?? 'user',
      password: process.env.CINEMACTRL_DB_PASSWORD ?? 'password',
      database: process.env.CINEMACTRL_DB_DATABASE ?? 'appdb',
      entities: [],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([]),
  ],
  controllers: [],
  providers: [],
})
export class UserServiceModule {}
