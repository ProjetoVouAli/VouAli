import nodemailer from 'nodemailer';

// Serviço de envio de emails híbrido (Nodemailer + Resend)
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  secure: true, // true para porta 465
  port: 465,
  auth: {
    user: 'resend',
    pass: import.meta.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || '', 
  },
  tls: {
    // Evita erro de 'self-signed certificate in certificate chain' em redes locais/Windows
    rejectUnauthorized: false
  }
});

const DEFAULT_SENDER = 'VouAli <onboarding@resend.dev>'; // Substitua pelo seu domínio validado no Resend futuramente

/**
 * Envia o email informando que a empresa foi aprovada
 */
export async function sendPartnerApprovalEmail(email: string, nomeEmpresa: string, jaPossuiConta: boolean) {
  const subject = jaPossuiConta 
    ? 'Sua conta de Parceiro foi ativada!' 
    : 'Sua empresa foi aprovada! Crie sua conta.';

  // Usa a URL do ambiente (Produção ou Local)
  const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

  const html = jaPossuiConta 
    ? `
      <h2>Olá, ${nomeEmpresa}!</h2>
      <p>Temos uma ótima notícia: a sua solicitação de parceria no VouAli foi <strong>aprovada</strong>.</p>
      <p>Como você já possui um cadastro com o email ${email}, o seu perfil já foi atualizado com as permissões de PARCEIRO.</p>
      <p>Acesse o sistema e comece a adicionar seus destinos turísticos!</p>
      <a href="${baseUrl}/login" style="display:inline-block;padding:10px 20px;background-color:#000;color:#fff;text-decoration:none;border-radius:5px;">Acessar o VouAli</a>
    `
    : `
      <h2>Olá, ${nomeEmpresa}!</h2>
      <p>Temos uma ótima notícia: a sua solicitação de parceria no VouAli foi <strong>aprovada</strong>.</p>
      <p>Para ativar os seus benefícios e começar a postar seus destinos, basta criar a sua conta na plataforma utilizando este exato email (${email}).</p>
      <p>Nós detectaremos a sua conta automaticamente e liberaremos as permissões B2B.</p>
      <a href="${baseUrl}/cadastro" style="display:inline-block;padding:10px 20px;background-color:#000;color:#fff;text-decoration:none;border-radius:5px;">Criar Conta de Parceiro</a>
    `;

  try {
    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: email,
      subject,
      html,
    });
    console.log(`[EMAIL] Convite/Aviso enviado com sucesso para ${email}`);
  } catch (error) {
    console.error(`[EMAIL] Erro ao enviar email para ${email}:`, error);
    // Não vamos estourar erro (throw) para não travar a aprovação no painel admin, apenas logar.
  }
}
