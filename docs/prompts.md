## 1. Prompt Inicial

esse é um projeto com somente a instalação base do Next.js 15, onde já vem com tailwind e todo o necessário pra começar uma aplicação.

Você é uma especialista front-end, com conhecimento avançado dessa arquitetura.

Quero construir uma pequena aplicação para bater no Jira Cloud via API. O objetivo primário do projeto é ter fácil acesso a alguns dados de itens do Jira em reunião gerenciais, como a tarefa, status, descrição, etc.

Já tenho a API Token criada, tanto a URL quanto a API token devem ser variáveis de ambiente. Construa uma aplicação onde eu consiga filtrar por projeto os itens, e por id, status e responsável. Os filtros por id, status e responsável devem permitir um ou mais valor.

Todas as queries devem acontecer do lado server da aplicação, se necessário criar rotas /api. Não pode ser exposto no client a url e token do Jira.

É importante uma visualização de tabela dos itens, mas também uma sumarização dos dados, além de um layout que funcione bem em apresentações de tela.

E use a premissa de mobile first. Crie os arquivos necessários

### 2. Prompt para adicionar sprints

> Note: O prompt abaixo é uma resposta gerada no ChatGPT, com o modelo GPT-4o com Deep Research ativo, que passei posteriormente para o Github Copilot com modelo Claude 3.7 Sonnet Thinking, pois a implementação direta pelo Github Copilot não funcionou. No ChatGPT passei a documentação do Jira API v3, e o fetch das issues que estava incorreto.

Use essa referência abaixo para adição de sprints na tabela, detalhe e filtro.

Obtendo Sprints associadas a Issues via Jira Cloud API v3

Para listar issues no Jira Software Cloud incluindo informações de Sprint (nome da sprint, datas de início e fim, etc.), é preciso usar a API REST apropriada e consultar o campo de sprint corretamente. Abaixo explicamos passo a passo como recuperar o campo Sprint usando o endpoint /rest/api/3/search com JQL e como obter detalhes completos da sprint. Os exemplos incluem chamadas e trechos de resposta em JSON, para facilitar a implementação no frontend (e.g. Next.js).
Acessando o campo de Sprint nas issues (campo customizado)

No Jira Cloud, o campo Sprint não é um campo padrão simples; ele é implementado como um campo customizado fornecido pelo Jira Software (antigo Greenhopper). Isso significa que para consultá-lo via API, devemos referenciá-lo pelo seu identificador de campo customizado (ex: customfield_XXXXX). Em outras palavras, o nome "Sprint" em si não é diretamente usado na requisição de campos da API.

Passos para incluir o campo Sprint na busca:

    Descubra o ID do campo "Sprint": Use a API de campos para obter a lista de campos e encontrar aquele chamado "Sprint". Por exemplo, fazendo GET /rest/api/3/field (ou /rest/api/2/field, equivalentes no Cloud). Na resposta, procure a entrada com "name": "Sprint". Ela terá um "id" do formato customfield_X (onde X é um número único em sua instância)​
    community.developer.atlassian.com
    . Por exemplo, você verá algo assim no JSON de campos:

{
    "id": "customfield_10104",
    "key": "customfield_10104",
    "name": "Sprint",
    "custom": true,
    "searchable": true,
    "clauseNames": ["cf[10104]", "Sprint"],
    "schema": {
        "type": "array",
        "items": "string",
        "custom": "com.pyxis.greenhopper.jira:gh-sprint",
        "customId": 10104
    }
}

Esse objeto indica que "Sprint" é um campo customizado (plugin Greenhopper), do tipo array.​
community.developer.atlassian.com
​
community.developer.atlassian.com

Use o ID do campo na busca JQL: Ao chamar o endpoint de busca (/rest/api/3/search), inclua o identificador do campo Sprint na lista de campos desejados. Por exemplo, você pode usar o parâmetro query fields especificando o custom field identificado no passo anterior. Exemplo:

    GET /rest/api/3/search?jql=projeto=ABC&fields=summary,status,assignee,customfield_10104

    No exemplo acima, customfield_10104 representa o campo Sprint. Incluir esse campo garante que a resposta trará os dados de sprint de cada issue​
    community.developer.atlassian.com
    . Você pode listar outros campos necessários (summary, status, etc.) separados por vírgulas no parâmetro fields. (Observação: Usar fields=*all também traria todos os campos, incluindo Sprint, mas isso retorna mais dados que o necessário e não é ideal em termos de performance.)

    Verifique se o campo Sprint está disponível no contexto do projeto/issue: Certifique-se de que o campo Sprint está aplicado/configurado para os issues que você está consultando. Em projetos de software no Jira Cloud, o campo Sprint geralmente é incluído por padrão (é um campo bloqueado do Jira Software), então normalmente todas as issues de um board Scrum/Kanban terão esse campo. Caso uma issue não tenha o campo (por exemplo, se não pertence a um board de Scrum/Kanban ou o campo foi removido das telas), a API pode retornar um valor nulo ou não listá-lo. Em geral, se a busca estiver retornando "Sprint" cannot be set or found, confirme nas configurações do projeto que o campo Sprint está disponível para aquele tipo de issue.

Consulta JQL e exemplo de resposta: Após incluir o campo Sprint, a resposta JSON da API /search terá uma estrutura semelhante a abaixo (simplificada para foco na sprint):

{
  "issues": [
    {
      "key": "PROJ-123",
      "fields": {
        "summary": "Implementar funcionalidade X",
        "status": { ... },
        "customfield_10104": [
          {
            "id": 37,
            "name": "Sprint 1",
            "state": "closed",
            "boardId": 5,
            "goal": "Meta da Sprint 1"
          },
          {
            "id": 38,
            "name": "Sprint 2",
            "state": "active",
            "boardId": 5,
            "goal": ""
          }
        ]
      }
    },
    ...
  ]
}

No exemplo acima, o campo customfield_10104 (Sprint) da issue PROJ-123 contém um array de objetos, porque a issue participou de duas sprints: Sprint 1 (já fechada) e Sprint 2 (ativa no momento). Cada objeto de sprint inclui pelo menos o id da sprint, seu name (nome), state (estado, ex.: active, closed ou future), o boardId associado e a goal (objetivo) da sprint​
community.developer.atlassian.com
. Esses dados vêm diretamente na resposta da busca, uma vez que especificamos o campo customizado da Sprint.

    Dica: Você pode usar JQL para filtrar as issues por sprint se desejar, já que “Sprint” é um campo pesquisável. Por exemplo, jql=sprint = 37 filtraria issues na sprint de ID 37, ou sprint in openSprints() traria issues em sprints abertas. Nesse caso, entretanto, o foco é obter os detalhes da sprint via API, então usamos JQL conforme a necessidade do usuário (por projeto, por board, etc.) e extraímos os campos adicionais. 

Parâmetro expand é necessário?

Não é estritamente necessário usar um parâmetro expand especial para obter o campo Sprint na busca – apenas incluir o campo via fields já trará o valor. Em versões mais antigas da API, o campo Sprint era retornado como uma string formatada (um toString() do objeto Java), e recomendava-se usar expand=versionedRepresentations para obter a representação JSON estruturada do campo​
community.developer.atlassian.com
. De fato, a Atlassian indicou que utilizar expand=versionedRepresentations era preferível para acessar os dados do sprint em JSON, pois a representação em string foi depreciada e não deveria ser usada​
community.developer.atlassian.com
.

No Jira Cloud atual, porém, essa mudança já ocorreu: a resposta já fornece o Sprint em formato JSON estruturado por padrão, incluindo os campos mencionados (id, name, state, etc.), em vez de uma string única​
community.developer.atlassian.com
. Portanto, não é necessário adicionar expand=versionedRepresentations apenas para obter as sprints – a API v3 (e v2) do Jira Cloud já retorna o array de objetos JSON do sprint normalmente.

Você pode confirmar isso pelo fato de que desde setembro de 2020 a API do Jira Cloud deixou de retornar o campo Sprint como string e passou a retornar somente a representação JSON do sprint​
developer.atlassian.com
​
developer.atlassian.com
. Assim, bastará incluir o campo customizado na consulta. (O uso de outros expands como names ou schema é opcional – por exemplo, expand=names retornaria um mapeamento de customfield_10104 para o nome "Sprint" em uma seção separada da resposta, o que pode ajudar a identificar campos, mas não influencia os valores.)

Resumindo: Hoje não é preciso nenhum expand especial para sprints na Jira Cloud API, pois os dados da sprint já vêm estruturados. Caso você esteja integrando com Jira Server ou uma versão muito antiga, a estratégia de expand poderia ser relevante, mas no Jira Cloud v3 atual não é necessária para este fim.
Obtendo as datas de início e fim da Sprint

Um ponto importante é que, embora a resposta da busca traga o nome e estado da sprint, nem sempre traz diretamente as datas de início e fim da sprint. No exemplo acima, repare que cada objeto de sprint não continha startDate ou endDate. Isso ocorre porque o campo Sprint na issue (mesmo em formato JSON) geralmente inclui identificadores básicos e alguns atributos (nome, estado, objetivo, etc.), mas não inclui as datas. De acordo com a própria Atlassian, a representação JSON do campo Sprint inicialmente não fornecia todos os dados que a string incluía (como as datas)​
developer.atlassian.com
.

Para obter informações completas da sprint – em especial data de início, data de término e data de conclusão – será preciso fazer uma chamada adicional à API Agile do Jira Software Cloud, usando o ID da sprint obtido. Em outras palavras, a sequência de integração será: primeiro obter as issues e extrair os IDs das sprints associadas, depois buscar os detalhes de cada sprint por ID.

Como buscar detalhes completos da Sprint por ID: Use o endpoint do Jira Software Cloud REST API (agile) GET /rest/agile/1.0/sprint/{sprintId} para cada sprint desejada. Este endpoint retorna um objeto JSON com todos os dados da sprint, incluindo as propriedades de data. Por exemplo:

GET /rest/agile/1.0/sprint/37

Supondo que 37 seja o ID da sprint (como no exemplo anterior), a resposta pode ser semelhante a:

{
  "id": 37,
  "self": "https://<seu-domínio>.atlassian.net/rest/agile/1.0/sprint/37",
  "state": "closed",
  "name": "Sprint 1",
  "startDate": "2015-04-11T15:22:00.000+10:00",
  "endDate": "2015-04-20T01:22:00.000+10:00",
  "completeDate": "2015-04-20T11:04:00.000+10:00",
  "originBoardId": 5,
  "goal": "Meta da Sprint 1"
}

No JSON acima (adaptado de exemplo da documentação), podemos ver os campos startDate e endDate da Sprint 1, bem como a completeDate (data de conclusão efetiva da sprint) e o originBoardId (ID do board de onde a sprint se originou)​
stackoverflow.com
. Com esses dados, você consegue exibir no frontend informações como “Sprint 1 – início em 11/04/2015, fim em 20/04/2015”, por exemplo.

Dica: Você não precisa buscar repetidamente os dados de sprint para cada issue. É mais eficiente coletar todos os sprint IDs únicos das issues retornadas pela JQL e então buscar os detalhes de cada um desses sprints apenas uma vez, armazenando-os para montar a tabela no frontend. Por exemplo, se sua busca JQL retornou issues que pertencem às sprints de ID 37 e 38, você pode fazer duas chamadas: /rest/agile/1.0/sprint/37 e /rest/agile/1.0/sprint/38, e assim obter as datas de ambas as sprints. Cada chamada ágil de sprint fornece o nome, estado e datas daquela sprint, permitindo preencher as colunas adicionais desejadas.

Vale notar que também existe o endpoint GET /rest/agile/1.0/board/{boardId}/sprint que lista as sprints de um board. No entanto, esse endpoint tipicamente lista sprints futuras, ativas e fechadas com informações básicas (sem necessariamente todas as datas dependendo do estado). Portanto, se você já tem o sprintId, a abordagem mais direta é usar /sprint/{sprintId} para obter startDate e endDate precisamente.
Resumo e referências

Em resumo, para obter as sprints associadas às issues via Jira Cloud REST API v3:

    Use o endpoint de busca de issues (/rest/api/3/search) com JQL de sua escolha e inclua o campo de Sprint na lista de campos da requisição. Lembre-se que “Sprint” é um campo customizado — utilize seu ID (ex: customfield_XXXXX) obtido via API ou configurações do Jira​
    community.developer.atlassian.com
    ​
    community.developer.atlassian.com
    .

    Não é necessário expand especial para o campo Sprint no Jira Cloud atual, pois a API já retorna um array de objetos JSON contendo nome, estado, ID etc. da sprint​
    community.developer.atlassian.com
    . (Historicamente usava-se expand=versionedRepresentations devido à representação antiga em string, agora depreciada​
    community.developer.atlassian.com
    .)

    A resposta da busca trará, para cada issue, o campo Sprint com possivelmente múltiplas entradas (caso a issue tenha passado por mais de uma sprint). Cada entrada fornece pelo menos o nome e ID da sprint associada.

    Para obter detalhes completos da sprint (especialmente as datas de início e fim), utilize o ID da sprint retornado e faça uma chamada para o endpoint Agile /rest/agile/1.0/sprint/{id}. Esse endpoint retornará as informações de data e outros detalhes da sprint​
    stackoverflow.com
    .

    Com os nomes e as datas em mãos, você pode então montar no frontend colunas como “Sprint (Nome)”, “Início da Sprint” e “Término da Sprint” para cada issue listada, conforme desejado.

Referências: A solução acima se baseia na documentação e em respostas oficiais da Atlassian. Por exemplo, a Atlassian confirma que o campo Sprint é identificado como custom field e deve ser consultado pelo seu ID​
community.developer.atlassian.com
, usando o parâmetro fields na API de busca​
community.developer.atlassian.com
. Além disso, devido à mudança na API do Jira Cloud, a representação JSON do Sprint já é retornada diretamente (substituindo a antiga string)​
community.developer.atlassian.com
. Caso seja necessário mais confirmação sobre os dados completos da sprint, a própria API Agile do Jira fornece exemplo de retorno com startDate e endDate da sprint​
stackoverflow.com
, que utilizamos para extrair essas informações adicionais no processo descrito. Com isso, fica viável listar as issues junto com seus respectivos dados de sprint no seu aplicativo frontend.

## 3. Prompt de tentativa de corrigir problema de build na página de detalhe da issue
> Note: Não foi realizado a correção corretamente, talvez por uma limitação de versão que o modelo tem conhecimento, que é o Next 13 segundo o mesmo.

Abstraia a lógica client side dessa página para um custom hook se possível, pois preciso que a página seja server side para funcionar os params. Deve ser async.

Crie os arquivos necessários.