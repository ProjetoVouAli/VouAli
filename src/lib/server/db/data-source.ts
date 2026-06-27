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
import { AvailabilitySlot } from './entities/AvailabilitySlot';
import { City } from './entities/City';
import { PlatformConfig } from './entities/PlatformConfig';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL, 
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
    AvailabilitySlot,
    City,
    PlatformConfig,
  ],
  subscribers: [],
  migrations: [],
});
