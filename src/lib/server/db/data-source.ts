// src/lib/server/db/data-source.ts
import { DataSource } from 'typeorm';

// Pegando a URL do banco das variáveis de ambiente do SvelteKit
import { env } from '$env/dynamic/private'; 
import { Destination } from './entities/Destination';
import { DestinationImage } from './entities/DestinationImage';
import { DestinationCategory } from './entities/DestinationCategory';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL, 
  synchronize: false, // Deixe false em produção (use migrations)
  logging: true,
  entities: [
    Destination, 
    DestinationImage, 
    DestinationCategory, 
  ],
  subscribers: [],
  migrations: [],
});