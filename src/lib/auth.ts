import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    type User
} from 'firebase/auth';
import {auth} from './firebase';

export async function loginWithEmail(email:string, password: string) {
    try {
        const result =await signInWithEmailAndPassword(auth, email, password);
        const token = await result.user.getIdToken();
        return {success: true, token, user: result.user };
    } catch (error: any) {
        return {
            success: false,
            message: tratarErroFirebase(error.code)
        };
    }
}

export async function registerWithEmail(email:string, password: string) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const token = await result.user.getIdToken();
        return {success: true, token, user: result.user };
    } catch(error: any) {
        return {
            success: false,
            message: tratarErroFirebase(error.code)
        };
    }
}

export async function logout() {
    await signOut(auth);
}

function tratarErroFirebase(code: string): string {
    const erros: {[key: string]: string } = {
        'auth/email-already-in-use': 'Email já castrado',
        'auth/invalid-email': 'Email invalido',
        'auth/weak-password': 'Senha deve ter pelo menos 6 caracteres',
        'auth/user-not-found': 'Email não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
        'auth/operation-not-allowed': 'Operação não permitida',
    };

    return erros[code] || 'Erro ao processar. Tente novamente';
}