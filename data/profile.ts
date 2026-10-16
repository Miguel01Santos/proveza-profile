// Edite este arquivo para atualizar o conteúdo do portfólio.
// Itens marcados com TODO são placeholders: troque pelos seus dados reais.

export const profile = {
  name: "Miguel Proveza",
  handle: "provezamiguel",
  role: "Desenvolvedor Full Stack",
  location: "Brasil",
  headline:
    "Construo produtos web e mobile de ponta a ponta — do back-end serverless ao app no bolso do técnico em campo.",
  about: [
    "Sou apaixonado por tecnologia e inovação, e encaro cada desafio como uma oportunidade de aprender algo novo. Gosto de entender o porquê das coisas e de transformar ideias em soluções que realmente fazem diferença no dia a dia das pessoas.",
    "Sou proativo: não espero o problema bater na porta. Se vejo algo que pode ser melhorado, levanto a mão, proponho e coloco a mão na massa. Acredito em melhoria constante, tanto no código quanto em mim mesmo, e busco evoluir um pouco a cada dia.",
    "Também valorizo muito o trabalho em equipe. Gosto de compartilhar o que sei, de ouvir quem está ao lado e de construir junto, porque os melhores resultados nascem de pessoas colaborando de verdade.",
  ],
  skills: [
    { group: "Front-end", items: ["TypeScript", "JavaScript", "Angular", "React", "Next.js", "HTML & CSS", "Tailwind CSS"] },
    { group: "Back-end", items: ["Node.js", "Python", "Java", "Serverless", "Jest", "Vitest", "Supertest", "Sinon", "Nock"] },
    { group: "APIs", items: ["GraphQL", "REST"] },
    { group: "Banco de dados", items: ["MySQL", "PostgreSQL", "Prisma", "TypeORM", "Knex"] },
    { group: "AWS", items: ["Lambda", "EC2", "S3", "CloudFront", "SQS", "SNS", "DynamoDB", "Amazon Bedrock"] },
    { group: "Mobile", items: ["Ionic", "PWA (Web App Manifest)", "Android", "Build & distribuição de APK"] },
    { group: "Ferramentas", items: ["Git & GitHub", "npm", "pnpm", "Yarn", "Lerna", "Docker", "Nginx", "Postman", "CI/CD", "Antigravity", "Claude Code"] },
  ],
  projects: [
    {
      title: "ScoutMe PRO",
      description:
        "PWA de scouting para o futebol de base: perfis de atletas, avaliações e comparador de jogadores, com login e API própria.",
      tags: ["Next.js", "HeroUI", "Express", "Prisma", "PostgreSQL", "PWA"],
      link: "", // TODO: link do repo ou demo
    },
    {
      title: "Barbearia App",
      description:
        "App de agendamento para barbearias: horários, serviços e clientes num só lugar.", // TODO: detalhar
      tags: ["React", "TypeScript"], // TODO: ajustar stack
      link: "", // TODO: link do repo ou demo
    },
    {
      title: "Relatório de Sprints",
      description:
        "Ferramenta que consolida dados das sprints e gera relatórios automáticos para o time.", // TODO: detalhar
      tags: ["Node.js", "Automação"],
      link: "",
    },
    {
      title: "Apps de campo",
      description:
        "Desenvolvimento e entrega dos apps mobile usados por técnicos em campo, com pipeline de geração de APK para QA.",
      tags: ["Mobile", "CI/CD"],
      link: "",
    },
  ],
  experience: [
    {
      period: "", // TODO: ex. "2024 — atual"
      title: "Desenvolvedor Full Stack",
      org: "Field Control",
      description:
        "Painel de controle web, APIs serverless em Node.js e apps mobile para gestão de equipes de campo.",
    },
    {
      period: "", // TODO: ex. "2024 — 2027"
      title: "Tecnologia da Informação — Informática para Negócios",
      org: "Fatec Rio Preto",
      description: "Graduação com ênfase em Informática para Negócios na Faculdade de Tecnologia de Rio Preto.",
    },
  ],
  contact: {
    email: "", // TODO: seu email pessoal
    github: "https://github.com/Miguel01Santos",
    linkedin: "", // TODO: link do seu LinkedIn
  },
};
