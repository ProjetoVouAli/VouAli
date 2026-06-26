# Fluxo de Imagens do Hero Banner (Resumo)

O Hero Banner inteligente possui um sistema de **"Cascata de Fallbacks"** (Camadas de Segurança) para garantir que a tela inicial nunca fique sem imagem. O sistema tenta sempre a opção mais personalizada e, se algo falhar, vai caindo para as camadas genéricas.

## Como a foto é escolhida? (Ordem de Prioridade)

### 1. Nível Mais Alto: Destino Próximo (Banco de Dados + Geolocalização)
- **Condição:** O usuário permitiu a geolocalização e temos destinos com fotos cadastradas no Banco de Dados.
- **O que acontece:** O sistema roda a função matemática *Haversine* para encontrar o destino fisicamente mais próximo da coordenada (Latitude/Longitude) do usuário.
- **Resultado na Tela:** O fundo mostra a foto exata desse destino, o título vira o nome do lugar (ex: "Saquarema - RJ") e o botão vira "Ver Destino" redirecionando para a página detalhada (`/destination/{slug}`).

### 2. Primeiro Fallback: Destino Aleatório (Banco de Dados, sem Geo)
- **Condição:** O usuário negou a localização ou o PC deu "Timeout" na busca (falha no hardware/rede), **MAS** ainda existem destinos cadastrados com fotos no Banco de Dados.
- **O que acontece:** Como o sistema não sabe a distância, ele ignora a geolocalização e pega o primeiro destino válido com foto.
- **Resultado na Tela:** Exibe um destino aleatório/destaque do banco, com o botão e título adaptados.

### 3. Segundo Fallback: Clima Atual (Tema Estático + Unsplash)
- **Condição:** O banco de dados está completamente vazio ou nenhum destino cadastrado possui imagem vinculada.
- **O que acontece:** O sistema descarta o Banco de Dados. Ele consulta o calendário (Mês) e a Região Geográfica (se disponível) para deduzir o clima ideal.
- **Resultado na Tela:** Carrega as fotos premium em alta qualidade configuradas estaticamente no `hero-themes.ts` (ex: Praia ao Pôr do Sol no Verão, Montanha Neblinosa no Inverno). Título genérico ("Descubra o Mundo").

### 4. Último Recurso (Ultimate Fallback)
- **Condição:** Falha sistêmica drástica (não conseguiu ler nem o mês do sistema).
- **O que acontece:** Carrega o tema `default`.
- **Resultado na Tela:** Foto neutra de montanhas com lago.

---
**Em resumo:** A geolocalização dita o "Clima/Tema Visual" (cores e ícones) da tela. Mas na hora da foto, o sistema prioriza destinos reais do seu sistema. Se der erro, ele se apoia nas fotos artísticas do Unsplash.
