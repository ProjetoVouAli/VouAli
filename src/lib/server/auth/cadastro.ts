import { AppDataSource } from '../db/data-source';
import { Usuario, TipoUsuario } from '../db/entities/Usuario';

export async function saveUserToDatabase(
    firebaseUid: string,
    email: string,
    nome: string,
    sexo: 'M' | 'F' | 'O'
) {
    const userRepository = AppDataSource.getRepository(Usuario);

    // Verificar se email já existe
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email já cadastrado');
    }

    // Criar usuário com uid do Firebase (Firebase gerencia a senha)
    const usuario = userRepository.create({
        uid: firebaseUid,  // ✅ UID do Firebase
        email,
        nome,
        sexo,
        estaAutenticado: true,
        papeis: [TipoUsuario.VIAJANTE]
    });

    await userRepository.save(usuario);
    return usuario;
}