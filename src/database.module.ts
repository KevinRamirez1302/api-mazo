import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: (): Pool => {
        return new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        });
      },
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
