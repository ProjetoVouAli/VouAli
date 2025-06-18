import { ref } from 'vue';

export function useAutenticacao() {
    const usuario = ref<{ nome: string; email: string } | null>(null); // Você precisa declarar a variável reativa

    const login = async (email: string, senha: string) => {
        // SimulateGo (mock)
        if (email && senha) {
            usuario.value = { nome: 'Usuario', email };
        } else {
            throw new Error('Credenciais inválidas');
        }
    }

    const cadastrar = async (nome: string, email: string, senha: string) => {
        if (nome && email && senha) {
            usuario.value = { nome, email };
        } else {
            throw new Error('Campos inválidos');
        }
    }

    const logout = () => {
        usuario.value = null;
    }

    return {
        usuario,
        login,
        cadastrar,
        logout
    }
}