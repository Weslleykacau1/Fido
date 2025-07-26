# FidoFeed.ai - Nutricionista Pessoal para Cães

FidoFeed.ai é uma aplicação web inteligente projetada para ajudar donos de cães a fornecer a melhor nutrição possível para seus pets. Utilizando inteligência artificial, o aplicativo oferece recomendações personalizadas de alimentação, um chatbot para tirar dúvidas e ferramentas para acompanhar a saúde do seu cão.

## Recursos Principais

O aplicativo é organizado em quatro abas principais, cada uma focada em um aspecto do cuidado com o seu pet:

### 1. Calculadora de Ração (Aba "Calculadora")
O coração do aplicativo, esta ferramenta calcula a quantidade diária ideal de ração para o seu cão.

- **Entradas Personalizadas**: Selecione um pet salvo ou insira manualmente a raça e a idade em meses do seu cão.
- **Cálculo Inteligente**: Utiliza um fluxo de IA (Genkit) que considera a raça e a idade para determinar a porção diária em gramas.
- **Cálculo por Peso**: Se houver um peso registrado para o pet na aba "Peso", a calculadora oferece a opção de usar o peso exato em vez da média da raça, fornecendo uma recomendação ainda mais precisa.
- **Informações de Fase de Vida**: Exibe dicas nutricionais relevantes para a fase de vida do cão (filhote, adulto ou sênior).
- **Aviso Veterinário**: Todos os resultados são acompanhados por uma recomendação amigável para consultar um veterinário, garantindo a segurança do pet.

### 2. Chatbot de Nutrição (Aba "Dúvidas")
Um assistente virtual com IA para responder às suas perguntas sobre nutrição canina.

- **Respostas Instantâneas**: Converse com a IA para tirar dúvidas comuns, como "Meu cachorro não quer comer" ou "Quais alimentos são tóxicos?".
- **Base de Conhecimento Especializada**: O chatbot é alimentado por uma base de conhecimento que inclui informações sobre dietas para raças específicas, alimentos perigosos e dicas de alimentação.
- **Contexto da Conversa**: O chatbot mantém o histórico da conversa para fornecer respostas mais coerentes e contextuais.

### 3. Gerenciador de Pets (Aba "Pets")
Um local central para salvar e gerenciar os perfis de todos os seus animais de estimação.

- **Adicionar e Remover Pets**: Crie perfis para cada um dos seus cães, salvando seus nomes.
- **Seleção Rápida**: Os pets salvos aparecem em menus de seleção nas outras abas, agilizando o uso da calculadora e do acompanhamento de peso.
- **Armazenamento Local**: Os dados dos pets são salvos de forma segura no `localStorage` do navegador para fácil acesso.

### 4. Acompanhamento de Peso (Aba "Peso")
Uma ferramenta visual para monitorar a saúde e o desenvolvimento do seu cão ao longo do tempo.

- **Registro de Peso**: Adicione facilmente novos registros de peso para qualquer pet salvo.
- **Gráfico Interativo**: Visualize o histórico de peso do seu pet em um gráfico de linhas claro e fácil de entender.
- **Histórico Detalhado**: Veja uma lista completa de todos os registros de peso, com data e valor, para um acompanhamento preciso.

## Recursos Adicionais

- **Banner de Teste**: Um banner informa os usuários sobre o período de teste e oferece um link para a versão completa do aplicativo.
- **Detecção de Compra**: O sistema pode detectar quando uma compra foi realizada (via parâmetro de URL) e oculta permanentemente o banner de teste.
- **Tema Claro e Escuro**: Inclui um seletor de tema que permite ao usuário escolher entre o modo claro, escuro ou o padrão do sistema.
- **Design Responsivo**: A interface é totalmente funcional e agradável em dispositivos de todos os tamanhos.
