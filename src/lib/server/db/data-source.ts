// src/lib/server/db/data-source.ts
import { DataSource } from 'typeorm';

// Pegando a URL do banco das variáveis de ambiente do SvelteKit
import { env } from '$env/dynamic/private'; 
import { Destination } from './entities/Destination';
import { DestinationImage } from './entities/DestinationImage';
import { DestinationCategory } from './entities/DestinationCategory';
import { Usuario } from './entities/Usuario';
import { SolicitacaoParceiro } from './entities/SolicitacaoParceiro';
import { TentativaSolicitacaoParceiro } from './entities/TentativaSolicitacaoParceiro';
import { Review } from './entities/Review';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: isProduction ? env.DATABASE_URL_NEON : env.DATABASE_URL, 
  ssl: isProduction ? true : false,
  extra: isProduction ? {
    ssl: {
      rejectUnauthorized: false
    }
  } : undefined,
  synchronize: true, // ATENÇÃO: use apenas em desenvolvimento!
  logging: ['error'], // Mostra apenas erros, não as queries
  entities: [
    Destination, 
    DestinationImage, 
    DestinationCategory, 
    Usuario,
    SolicitacaoParceiro,
    TentativaSolicitacaoParceiro,
    Review,
  ],
  subscribers: [],
  migrations: [],
});