import 'reflect-metadata'; // <-- DEVE SER A PRIMEIRA LINHA
import { AppDataSource } from '$lib/server/db/data-source';

await AppDataSource.initialize();