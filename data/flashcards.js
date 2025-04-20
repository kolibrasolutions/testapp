/**
 * Banco de dados de flashcards para o sistema de treinamento de balconistas
 * Contém apenas produtos de venda livre que balconistas podem legalmente indicar
 */

const flashcards = {
  // Problemas Respiratórios - Adultos
  "RESP-A-01": {
    id: "RESP-A-01",
    categoria: "Respiratório",
    publico: "Adulto",
    frente: "Gripe e resfriado com febre e dor no corpo",
    verso: {
      medicamentos: [
        {
          nome: "Paracetamol 500mg ou 750mg",
          posologia: "1 comprimido a cada 6 horas (máximo 4 comprimidos por dia)",
          duracao: "Enquanto persistirem os sintomas, por até 5 dias",
          contraindicacoes: "Alergia ao paracetamol, doença hepática grave"
        },
        {
          nome: "Ibuprofeno 400mg",
          posologia: "1 comprimido a cada 8 horas, após as refeições",
          duracao: "Por até 5 dias",
          contraindicacoes: "Úlcera gástrica ativa, alergia a anti-inflamatórios, asma grave"
        },
        {
          nome: "Descongestionante nasal em spray (Oximetazolina)",
          posologia: "1-2 borrifadas em cada narina a cada 12 horas",
          duracao: "Por no máximo 3 dias",
          contraindicacoes: "Hipertensão não controlada, glaucoma"
        }
      ],
      orientacoes: [
        "Manter boa hidratação (pelo menos 2 litros de água por dia)",
        "Repouso adequado",
        "Umidificar o ambiente",
        "Evitar mudanças bruscas de temperatura"
      ],
      sinaisAlerta: [
        "Febre acima de 38,5°C por mais de 3 dias",
        "Dificuldade para respirar",
        "Dor intensa no peito",
        "Confusão mental"
      ]
    },
    dificuldade: "media",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  "RESP-A-02": {
    id: "RESP-A-02",
    categoria: "Respiratório",
    publico: "Adulto",
    frente: "Tosse seca persistente",
    verso: {
      medicamentos: [
        {
          nome: "Dextromertorfano (xarope)",
          posologia: "10ml a cada 6-8 horas",
          duracao: "Por até 7 dias",
          contraindicacoes: "Asma, DPOC, insuficiência respiratória"
        },
        {
          nome: "Pastilhas para garganta com ação anestésica local",
          posologia: "1 pastilha a cada 2-3 horas, deixando dissolver lentamente na boca",
          duracao: "Enquanto persistirem os sintomas",
          contraindicacoes: "Crianças menores de 6 anos (risco de engasgo)"
        }
      ],
      orientacoes: [
        "Manter boa hidratação",
        "Umidificar o ambiente",
        "Evitar irritantes como fumaça e poeira",
        "Elevar a cabeceira da cama ao dormir"
      ],
      sinaisAlerta: [
        "Tosse que dura mais de 2 semanas",
        "Tosse com sangue",
        "Dificuldade para respirar",
        "Febre persistente"
      ]
    },
    dificuldade: "facil",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  "RESP-A-03": {
    id: "RESP-A-03",
    categoria: "Respiratório",
    publico: "Adulto",
    frente: "Tosse com catarro",
    verso: {
      medicamentos: [
        {
          nome: "Xarope expectorante com Guaifenesina",
          posologia: "10ml a cada 6-8 horas",
          duracao: "Por até 7 dias",
          contraindicacoes: "Hipersensibilidade aos componentes"
        },
        {
          nome: "Acetilcisteína 600mg (envelope)",
          posologia: "1 envelope dissolvido em água 1 vez ao dia",
          duracao: "Por 5 a 7 dias",
          contraindicacoes: "Úlcera gástrica, asma não controlada"
        }
      ],
      orientacoes: [
        "Aumentar a ingestão de líquidos mornos",
        "Umidificar o ambiente",
        "Evitar deitar logo após tomar o medicamento",
        "Não suprimir a tosse produtiva (com catarro)"
      ],
      sinaisAlerta: [
        "Catarro amarelado ou esverdeado por mais de 5 dias",
        "Catarro com sangue",
        "Febre alta persistente",
        "Dor no peito ao respirar"
      ]
    },
    dificuldade: "media",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  "RESP-A-04": {
    id: "RESP-A-04",
    categoria: "Respiratório",
    publico: "Adulto",
    frente: "Congestão nasal e coriza",
    verso: {
      medicamentos: [
        {
          nome: "Spray nasal de solução salina",
          posologia: "2-3 borrifadas em cada narina, 3-4 vezes ao dia",
          duracao: "Enquanto necessário, sem restrição de tempo",
          contraindicacoes: "Não há contraindicações significativas"
        },
        {
          nome: "Descongestionante nasal (Cloridrato de Nafazolina)",
          posologia: "1-2 borrifadas em cada narina a cada 8-12 horas",
          duracao: "Por no máximo 3 dias",
          contraindicacoes: "Hipertensão, glaucoma, hipertireoidismo"
        },
        {
          nome: "Anti-histamínico oral (Loratadina 10mg)",
          posologia: "1 comprimido uma vez ao dia",
          duracao: "Por até 7 dias",
          contraindicacoes: "Hipersensibilidade ao princípio ativo"
        }
      ],
      orientacoes: [
        "Manter boa hidratação",
        "Umidificar o ambiente",
        "Lavar as narinas com soro fisiológico",
        "Evitar exposição a alérgenos (poeira, mofo)"
      ],
      sinaisAlerta: [
        "Secreção nasal purulenta por mais de 7 dias",
        "Dor facial intensa",
        "Febre alta persistente",
        "Dificuldade para respirar"
      ]
    },
    dificuldade: "facil",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  // Problemas Dermatológicos - Adultos
  "DERM-A-01": {
    id: "DERM-A-01",
    categoria: "Dermatológico",
    publico: "Adulto",
    frente: "Alergia na pele com manchas vermelhas e coceira",
    verso: {
      medicamentos: [
        {
          nome: "Loratadina 10mg",
          posologia: "1 comprimido uma vez ao dia, preferencialmente de manhã",
          duracao: "Por 5 a 7 dias",
          contraindicacoes: "Hipersensibilidade ao princípio ativo"
        },
        {
          nome: "Creme com hidrocortisona 1% (Berlison, Rinosoro Corticoide)",
          posologia: "Aplicar uma camada fina nas áreas afetadas 2 a 3 vezes ao dia",
          duracao: "Por até 7 dias",
          contraindicacoes: "Infecções cutâneas, acne, rosácea"
        }
      ],
      orientacoes: [
        "Evitar coçar as lesões",
        "Usar roupas de algodão frescas",
        "Tomar banhos mornos, não quentes",
        "Identificar e evitar o agente causador da alergia"
      ],
      sinaisAlerta: [
        "Inchaço no rosto ou lábios",
        "Dificuldade para respirar",
        "Lesões que formam bolhas ou feridas",
        "Febre associada às lesões de pele"
      ]
    },
    dificuldade: "media",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  "DERM-A-02": {
    id: "DERM-A-02",
    categoria: "Dermatológico",
    publico: "Adulto",
    frente: "Picadas de insetos",
    verso: {
      medicamentos: [
        {
          nome: "Loratadina 10mg",
          posologia: "1 comprimido uma vez ao dia",
          duracao: "Por 3 a 5 dias",
          contraindicacoes: "Hipersensibilidade ao princípio ativo"
        },
        {
          nome: "Caladryl ou Fenistil gel",
          posologia: "Aplicar nas áreas afetadas 3 a 4 vezes ao dia",
          duracao: "Até melhora dos sintomas",
          contraindicacoes: "Hipersensibilidade aos componentes, feridas abertas"
        }
      ],
      orientacoes: [
        "Aplicar compressas frias para reduzir o inchaço e a coceira",
        "Evitar coçar para não inflamar mais e não causar feridas",
        "Usar repelente para evitar novas picadas",
        "Lavar a área com água e sabão neutro"
      ],
      sinaisAlerta: [
        "Inchaço extenso ou que aumenta rapidamente",
        "Vermelhidão que se espalha",
        "Dificuldade para respirar",
        "Mal-estar geral, tontura ou náuseas após a picada"
      ]
    },
    dificuldade: "facil",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  "DERM-A-03": {
    id: "DERM-A-03",
    categoria: "Dermatológico",
    publico: "Adulto",
    frente: "Micose entre os dedos dos pés",
    verso: {
      medicamentos: [
        {
          nome: "Creme antifúngico (Miconazol ou Clotrimazol)",
          posologia: "Aplicar uma pequena quantidade entre os dedos afetados, duas vezes ao dia, após lavar e secar bem os pés",
          duracao: "Por pelo menos duas semanas, mesmo com melhora dos sintomas",
          contraindicacoes: "Hipersensibilidade aos componentes"
        },
        {
          nome: "Pó antifúngico",
          posologia: "Aplicar nos calçados e nos pés durante o dia",
          duracao: "Durante todo o tratamento",
          contraindicacoes: "Feridas abertas"
        }
      ],
      orientacoes: [
        "Secar bem entre os dedos após o banho",
        "Usar meias de algodão e trocar diariamente",
        "Alternar os calçados para que sequem completamente",
        "Evitar andar descalço em áreas públicas úmidas"
      ],
      sinaisAlerta: [
        "Área muito vermelha, inchada ou com secreção",
        "Não melhora após duas semanas de tratamento",
        "Febre ou mal-estar associado",
        "Lesões que se espalham para outras partes do corpo"
      ]
    },
    dificuldade: "media",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  // Dores - Adultos
  "DORE-A-01": {
    id: "DORE-A-01",
    categoria: "Dores",
    publico: "Adulto",
    frente: "Dor de cabeça intensa",
    verso: {
      medicamentos: [
        {
          nome: "Paracetamol 500mg ou 750mg",
          posologia: "1 comprimido a cada 6 horas (máximo 4 comprimidos por dia)",
          duracao: "Por até 3 dias",
          contraindicacoes: "Alergia ao paracetamol, doença hepática grave"
        },
        {
          nome: "Ibuprofeno 400mg",
          posologia: "1 comprimido a cada 8 horas, após as refeições",
          duracao: "Por até 3 dias",
          contraindicacoes: "Úlcera gástrica ativa, alergia a anti-inflamatórios, asma grave"
        },
        {
          nome: "Dipirona 500mg ou 1g",
          posologia: "1 comprimido a cada 6 horas",
          duracao: "Por até 3 dias",
          contraindicacoes: "Alergia à dipirona, porfiria, deficiência de G6PD"
        }
      ],
      orientacoes: [
        "Descansar em ambiente calmo e com pouca luz",
        "Aplicar compressa fria na testa ou nuca",
        "Manter boa hidratação",
        "Evitar ruídos altos e luzes fortes"
      ],
      sinaisAlerta: [
        "Dor de cabeça súbita e muito intensa ('a pior dor de cabeça da vida')",
        "Dor acompanhada de febre alta, rigidez no pescoço, confusão mental",
        "Dor que piora progressivamente e não responde aos analgésicos",
        "Dor de cabeça após trauma na cabeça"
      ]
    },
    dificuldade: "facil",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  "DORE-A-02": {
    id: "DORE-A-02",
    categoria: "Dores",
    publico: "Adulto",
    frente: "Dor muscular nas costas após atividade física",
    verso: {
      medicamentos: [
        {
          nome: "Ibuprofeno 400mg",
          posologia: "1 comprimido a cada 8 horas, após as refeições",
          duracao: "Por 3 a 5 dias",
          contraindicacoes: "Úlcera gástrica ativa, alergia a anti-inflamatórios, asma grave"
        },
        {
          nome: "Pomada anti-inflamatória (Diclofenaco dietilamônio)",
          posologia: "Aplicar na área afetada 3 a 4 vezes ao dia com massagem suave",
          duracao: "Por até 7 dias",
          contraindicacoes: "Feridas abertas, alergia a anti-inflamatórios"
        }
      ],
      orientacoes: [
        "Aplicar compressa morna na área afetada",
        "Evitar esforços e movimentos que intensifiquem a dor",
        "Manter postura adequada",
        "Retornar gradualmente às atividades físicas"
      ],
      sinaisAlerta: [
        "Dor que irradia para pernas ou braços",
        "Formigamento ou fraqueza nos membros",
        "Dificuldade para urinar ou defecar",
        "Dor que não melhora após 5 dias de tratamento"
      ]
    },
    dificuldade: "media",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  // Problemas Digestivos - Adultos
  "DIGE-A-01": {
    id: "DIGE-A-01",
    categoria: "Digestivo",
    publico: "Adulto",
    frente: "Azia e queimação no estômago",
    verso: {
      medicamentos: [
        {
          nome: "Antiácidos (Hidróxido de alumínio e magnésio)",
          posologia: "10ml ou 1-2 comprimidos mastigáveis, 3 a 4 vezes ao dia, preferencialmente 1 hora após as refeições e ao deitar",
          duracao: "Por até 7 dias",
          contraindicacoes: "Doença renal grave (para formulações com magnésio)"
        },
        {
          nome: "Omeprazol 10mg ou 20mg",
          posologia: "1 cápsula antes do café da manhã",
          duracao: "Por até 14 dias",
          contraindicacoes: "Hipersensibilidade ao princípio ativo"
        }
      ],
      orientacoes: [
        "Evitar alimentos gordurosos, picantes, café, álcool e refrigerantes",
        "Fazer refeições menores e mais frequentes",
        "Não deitar logo após as refeições",
        "Elevar a cabeceira da cama ao dormir"
      ],
      sinaisAlerta: [
        "Dor intensa que irradia para o braço, pescoço ou mandíbula",
        "Dificuldade para engolir",
        "Vômitos com sangue ou fezes escuras",
        "Perda de peso não intencional"
      ]
    },
    dificuldade: "facil",
    ultimaRevisao: null,
    proximaRevisao: null
  },
  
  "DIGE-A-02": {
    id: "DIGE-A-02",
    categoria: "Digestivo",
    publico: "Adulto",
    frente: "Diarreia sem febre ou sangue nas fezes",
    verso: {
      medicamentos: [
        {
          nome: "Loperamida 2mg",
          posologia: "2 cápsulas inicialmente, seguidas de 1 cápsula após cada evacuação diarreica (máximo 8 cápsulas por dia)",
          duracao: "Por até 2 dias",
          contraindicacoes: "Diarreia com sangue ou febre, colite ulcerativa, diarreia causada por antibióticos"
        },
        {
          nome: "Sachês de reidratação oral",
          posologia: "1 sachê dissolvido em 1 litro de água, beber ao longo do dia",
          duracao: "Durante o episódio de diarreia",
          contraindicacoes: "Não há contraindicações significativas"
        }
      ],
      orientacoes: [
        "Manter boa hidratação (água, chás claros, água de coco)",
        "Evitar laticínios, alimentos gordurosos e condimentados",
        "Preferir alimentos leves como arroz branco, torradas, banana",
        "Lavar bem as mãos antes das refeições e após usar o banheiro"
      ],
      sinaisAlerta: [
        "Diarreia com sangue ou muco",
        "Febre acima de 38°C",
        "Diarreia que dura mais de 3 dias",
        "Sinais de desidratação (boca seca, urina escura, tontura)"
      ]
    },
    dificuldade: "media",
    ultimaRevisao: null,
    proximaRevisao: null
  }
};

// Exportar o banco de dados de flashcards
export default flashcards;
