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

    const { SolicitacaoParceiro, StatusSolicitacao } = await import('../db/entities/SolicitacaoParceiro');
    const solicitacaoRepo = AppDataSource.getRepository(SolicitacaoParceiro);
    const solicitacao = await solicitacaoRepo.findOne({
        where: { emailResponsavel: email, status: StatusSolicitacao.APROVADA }
    });

    const papeis = [TipoUsuario.VIAJANTE];
    if (solicitacao) {
        papeis.push(TipoUsuario.PARCEIRO);
        console.log(`[AUTOMAÇÃO] Conta criada e promovida a Parceiro automaticamente (${email})`);
    }

    // Criar usuário com uid do Firebase (Firebase gerencia a senha)
    const usuario = userRepository.create({
        uid: firebaseUid,  // ✅ UID do Firebase
        email,
        nome,
        sexo,
        estaAutenticado: true,
        papeis: papeis
    });

    await userRepository.save(usuario);
    return usuario;
}