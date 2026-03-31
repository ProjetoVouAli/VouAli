import { AppDataSource } from '../db/data-source';
import { Usuario } from '../db/entities/Usuario';
import * as bcrypt from 'bcrypt';

export async function saveUserToDatabase(
    firebaseUid: string,
    email: string,
    senha: string,
    nome: string,
    sexo: 'M' | 'F' | 'O'
) {
    const userRepository = AppDataSource.getRepository(Usuario);

    // Verificar se email já existe
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário com uid do Firebase
    const usuario = userRepository.create({
        uid: firebaseUid,  // ✅ UID do Firebase
        email,
        senha: senhaHash,
        nome,
        sexo,
        estaAutenticado: true,
        eViajante: true,
        eAdministrador: false,
        eParceiro: false
    });

    await userRepository.save(usuario);
    return usuario;
}