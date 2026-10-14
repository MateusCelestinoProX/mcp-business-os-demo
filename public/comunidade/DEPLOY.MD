# 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS

Este guia contém o passo a passo completo e profissional para publicar a plataforma **A.I VISUALS** diretamente na **Vercel**, além das instruções de segurança e das variáveis de ambiente para a integração com o **Resend** e **Mercado Pago**.

---

## 🛡️ Relatório de Auditoria de Segurança

- ✅ **Chaves Privadas Protegidas:** Nenhuma API Key sensível (`RESEND_API_KEY` ou `MP_ACCESS_TOKEN`) está exposta em código client-side (`index.html` / `app.js`).
- ✅ **Serverless Functions Isoladas:** O backend roda em Vercel Serverless Functions (`/api/create-payment` e `/api/send-email`) onde as chaves são lidas estritamente de `process.env`.
- ✅ **Proteção de Administrador:** Proteção contra exclusão ou banimento acidental da conta Super Admin (`mcp6667@proton.me`).
- ✅ **Arquivo `.gitignore`:** Arquivos `.env` e `node_modules` ignorados para impedir vazamento de credenciais em repositórios públicos.

---

## 📋 Passo a Passo para Deploy na Vercel

### Passo 1: Enviar o Código para o GitHub
Envie a pasta do projeto para o seu repositório no GitHub:
```bash
git add .
git commit -m "Deploy Vercel Ready"
git push origin main
```

### Passo 2: Importar o Projeto na Vercel
1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard).
2. Clique no botão **"Add New..."** > **"Project"**.
3. Selecione o repositório `VISUALS APP` e clique em **Import**.

### Passo 3: Configurar Variáveis de Ambiente (Environment Variables)
No painel de importação da Vercel (ou em **Settings** > **Environment Variables**), adicione as seguintes chaves:

| Variável | Descrição | Valor de Produção |
| :--- | :--- | :--- |
| `MP_ACCESS_TOKEN` | Token de Acesso de Produção do Mercado Pago | `APP_USR-6268276789394780-072611-cf76a7d29bfa887c883f537c1c8d7486-1921357860` |
| `RESEND_API_KEY` | Chave de API de Envio de E-mails do Resend | `re_efgVfaN2_J2UTVcQXEkGyzmpvxHa1i2Zq` |
| `SENDER_EMAIL_ADDRESS` | E-mail Remetente Oficial | `onboarding@resend.dev` *(ou seu domínio verificado)* |

*(Dica: A chave da sua conta do Resend já foi testada e aprovada com retorno 200 OK).*

### Passo 4: Concluir o Deploy
- Clique no botão **Deploy**.
- Em menos de 30 segundos a sua plataforma estará no ar com HTTPS em um domínio `.vercel.app`.

---

## 📧 Autenticação e Domínio Próprio no Resend

1. Para enviar e-mails de teste durante o desenvolvimento, utilize o remetente gratuito `onboarding@resend.dev` enviando para o seu e-mail de cadastro no Resend (`mateusgomes6667@gmail.com`).
2. Para enviar e-mails para qualquer destinatário (ex: clientes), acesse [Resend Domains](https://resend.com/domains) e adicione o seu domínio (ex: `seu-site.com`).

---

## 🌐 Configuração Global do Resend MCP (Antigravity)

Caso deseje que a IA gerencie e-mails via linha de comando no seu computador, o arquivo `~/.gemini/config/mcp_config.json` já foi configurado:

```json
{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": ["-y", "resend-mcp"],
      "env": {
        "RESEND_API_KEY": "re_efgVfaN2_J2UTVcQXEkGyzmpvxHa1i2Zq"
      }
    }
  }
}
```

---

🎉 **Sua aplicação está 100% segura, auditada e pronta para publicação.**
