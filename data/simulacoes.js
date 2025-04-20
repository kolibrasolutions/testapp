/**
 * Banco de dados de cenários de simulação para o sistema de treinamento de balconistas
 * Contém cenários de atendimento com diálogos conversacionais e múltiplas opções de resposta
 */

const simulacoes = {
  // Problemas Respiratórios - Adultos
  "SIM-RESP-A-01": {
    id: "SIM-RESP-A-01",
    titulo: "Cliente com gripe e resfriado",
    categoria: "Respiratório",
    publico: "Adulto",
    dificuldade: "facil",
    cenarioInicial: {
      cliente: "Bom dia! Estou com uma gripe forte há dois dias. Estou com febre, dor no corpo e um pouco de tosse. Pode me indicar alguma coisa?",
      contexto: "Homem de aproximadamente 35 anos, aparenta cansaço e está com o nariz congestionado."
    },
    passos: [
      {
        id: "passo1",
        tipo: "pergunta",
        texto: "Como você responde ao cliente?",
        opcoes: [
          {
            id: "1A",
            texto: "Posso te ajudar sim! Vou te indicar um antibiótico que vai resolver rapidinho.",
            feedback: "Incorreto. Antibióticos não são indicados para gripes e resfriados, que são causados por vírus. Além disso, antibióticos não podem ser indicados por balconistas, apenas vendidos com receita médica.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "1B",
            texto: "Claro que posso ajudar! Mas antes preciso fazer algumas perguntas para entender melhor seu caso.",
            feedback: "Correto! É importante coletar mais informações antes de fazer qualquer indicação.",
            correto: true,
            proximoPasso: "passo2"
          },
          {
            id: "1C",
            texto: "Infelizmente não posso indicar nada, você precisa consultar um médico.",
            feedback: "Parcialmente incorreto. Embora em alguns casos seja necessário encaminhar ao médico, para sintomas comuns de gripe e resfriado existem medicamentos de venda livre que podem ser indicados por balconistas.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo2",
        tipo: "pergunta",
        texto: "Quais perguntas você faz ao cliente?",
        opcoes: [
          {
            id: "2A",
            texto: "Há quanto tempo exatamente está com esses sintomas? A febre está muito alta? Tem alguma doença crônica ou alergia a medicamentos?",
            feedback: "Correto! Essas perguntas ajudam a entender a gravidade do caso e possíveis contraindicações.",
            correto: true,
            proximoPasso: "passo2-resposta"
          },
          {
            id: "2B",
            texto: "Já tomou algum antibiótico para essa gripe? Qual você prefere que eu indique?",
            feedback: "Incorreto. Não se deve sugerir antibióticos para gripes e resfriados, e a escolha do medicamento não deve ser baseada na preferência do cliente, mas na adequação ao seu quadro.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "2C",
            texto: "Você já teve Covid? Acho que deveria fazer um teste antes de comprar qualquer medicamento.",
            feedback: "Parcialmente incorreto. Embora a preocupação com Covid seja válida, sugerir um diagnóstico específico ou exame não é papel do balconista. O foco deve ser nas informações relevantes para a indicação segura de medicamentos de venda livre.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo2-resposta",
        tipo: "informacao",
        texto: "Cliente: \"Estou com esses sintomas há dois dias. A febre não está muito alta, acho que 38°C no máximo. Não tenho nenhuma doença crônica, só pressão um pouco alta às vezes, mas não tomo remédios. Tenho alergia a dipirona.\"",
        proximoPasso: "passo3"
      },
      {
        id: "passo3",
        tipo: "pergunta",
        texto: "Com base nessas informações, o que você indica para o cliente?",
        opcoes: [
          {
            id: "3A",
            texto: "Para a febre e dor no corpo, recomendo Paracetamol 500mg, 1 comprimido a cada 6 horas. Para a congestão nasal, um descongestionante em spray como a Nafazolina, 1-2 borrifadas em cada narina a cada 12 horas, por no máximo 3 dias.",
            feedback: "Correto! O Paracetamol é adequado para febre e dor, especialmente considerando a alergia à dipirona. O descongestionante nasal ajudará com a congestão, com a ressalva importante sobre o limite de uso de 3 dias.",
            correto: true,
            proximoPasso: "passo4"
          },
          {
            id: "3B",
            texto: "Recomendo Dipirona 500mg para a febre e dores, 1 comprimido a cada 6 horas, e um xarope para a tosse.",
            feedback: "Incorreto. O cliente informou que tem alergia à dipirona, portanto esse medicamento está contraindicado. Além disso, não foi mencionado que a tosse é o sintoma principal que necessita de tratamento.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "3C",
            texto: "Sugiro um antibiótico de amplo espectro para combater a infecção e um anti-inflamatório potente para as dores.",
            feedback: "Incorreto. Antibióticos não são indicados para gripes e resfriados virais e não podem ser vendidos sem receita médica. Além disso, anti-inflamatórios potentes podem não ser adequados para alguém com pressão alta ocasional.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo4",
        tipo: "pergunta",
        texto: "O cliente agradece suas recomendações. Esta é uma boa oportunidade para aumentar o ticket médio da venda. O que mais você poderia sugerir?",
        opcoes: [
          {
            id: "4A",
            texto: "Sugiro também um suplemento de vitamina C efervescente para ajudar a fortalecer o sistema imunológico durante a recuperação.",
            feedback: "Correto! Suplementos de vitamina C são produtos de venda livre que podem complementar o tratamento de gripes e resfriados, sendo uma sugestão adequada para aumentar o ticket médio.",
            correto: true,
            ticketMedio: true,
            proximoPasso: "passo5"
          },
          {
            id: "4B",
            texto: "Não sugiro nada adicional, pois os medicamentos indicados são suficientes para tratar os sintomas.",
            feedback: "Aceitável, mas perdeu uma oportunidade de aumentar o ticket médio com produtos complementares que poderiam beneficiar o cliente.",
            correto: true,
            ticketMedio: false,
            proximoPasso: "passo5"
          },
          {
            id: "4C",
            texto: "Aproveite e leve também este antibiótico, caso a gripe piore nos próximos dias.",
            feedback: "Incorreto. Antibióticos não devem ser vendidos sem receita médica e não são indicados preventivamente para gripes virais.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo5",
        tipo: "pergunta",
        texto: "Para finalizar o atendimento, quais orientações não farmacológicas você daria ao cliente?",
        opcoes: [
          {
            id: "5A",
            texto: "Recomendo manter boa hidratação, bebendo pelo menos 2 litros de água por dia, fazer repouso adequado e evitar mudanças bruscas de temperatura. Se a febre persistir por mais de 3 dias ou surgirem sintomas como falta de ar, procure um médico.",
            feedback: "Correto! Essas orientações complementam o tratamento medicamentoso e alertam sobre sinais que indicariam a necessidade de avaliação médica.",
            correto: true,
            proximoPasso: "fim-correto"
          },
          {
            id: "5B",
            texto: "Tome os medicamentos conforme indicado e volte em dois dias para comprar o antibiótico se não melhorar.",
            feedback: "Incorreto. Não se deve sugerir antibióticos para gripes virais e o balconista não deve prometer uma venda futura de medicamentos tarjados sem receita médica.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "5C",
            texto: "Não precisa de cuidados especiais, apenas tome os medicamentos que vai melhorar logo.",
            feedback: "Incorreto. As orientações não farmacológicas são parte importante do tratamento e o cliente deve ser informado sobre sinais de alerta que indicariam a necessidade de consulta médica.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "fim-correto",
        tipo: "resultado",
        texto: "Parabéns! Você realizou um atendimento correto, indicando medicamentos apropriados para os sintomas do cliente, respeitando suas contraindicações e fornecendo orientações não farmacológicas importantes.",
        resultado: {
          sucesso: true,
          pontos: 100,
          ticketMedio: true
        }
      },
      {
        id: "fim-incorreto",
        tipo: "resultado",
        texto: "Seu atendimento apresentou falhas importantes. Revise as indicações de medicamentos de venda livre para gripes e resfriados, lembre-se de verificar contraindicações e fornecer orientações não farmacológicas adequadas.",
        resultado: {
          sucesso: false,
          pontos: 0,
          ticketMedio: false
        }
      }
    ]
  },
  
  // Problemas Dermatológicos - Adultos
  "SIM-DERM-A-01": {
    id: "SIM-DERM-A-01",
    titulo: "Cliente com alergia na pele",
    categoria: "Dermatológico",
    publico: "Adulto",
    dificuldade: "media",
    cenarioInicial: {
      cliente: "Oi, estou com uma alergia na pele desde ontem. Tenho manchas vermelhas nos braços e pernas que coçam muito. Você tem alguma pomada boa para isso?",
      contexto: "Mulher de aproximadamente 40 anos, mostra os braços com manchas avermelhadas e alguns arranhões devido à coceira."
    },
    passos: [
      {
        id: "passo1",
        tipo: "pergunta",
        texto: "Como você inicia o atendimento?",
        opcoes: [
          {
            id: "1A",
            texto: "Posso te ajudar sim! Vou te mostrar as pomadas de corticoide que temos, são as mais fortes para alergia.",
            feedback: "Incorreto. Antes de indicar qualquer medicamento, é necessário coletar mais informações sobre a condição e histórico da cliente.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "1B",
            texto: "Claro que posso ajudar! Mas antes preciso fazer algumas perguntas para entender melhor o que está acontecendo com sua pele.",
            feedback: "Correto! É importante coletar mais informações antes de fazer qualquer indicação.",
            correto: true,
            proximoPasso: "passo2"
          },
          {
            id: "1C",
            texto: "Alergia na pele pode ser grave, você deveria consultar um dermatologista antes de usar qualquer medicamento.",
            feedback: "Parcialmente incorreto. Embora em casos graves seja necessário encaminhar ao médico, para reações alérgicas leves a moderadas existem medicamentos de venda livre que podem ser indicados por balconistas.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo2",
        tipo: "pergunta",
        texto: "Quais perguntas você faz à cliente?",
        opcoes: [
          {
            id: "2A",
            texto: "Você sabe o que pode ter causado essa alergia? Já teve reações alérgicas antes? Tem alguma doença crônica ou está tomando algum medicamento atualmente?",
            feedback: "Correto! Essas perguntas ajudam a identificar a possível causa da alergia e verificar se há contraindicações para os medicamentos.",
            correto: true,
            proximoPasso: "passo2-resposta"
          },
          {
            id: "2B",
            texto: "Qual pomada de corticoide você já usou antes? Prefere em creme ou pomada?",
            feedback: "Incorreto. Não se deve presumir que corticoides são a melhor opção sem avaliar o caso, e a escolha da forma farmacêutica não deve ser baseada apenas na preferência do cliente.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "2C",
            texto: "Você já foi diagnosticada com alguma doença de pele específica? Qual o nome do medicamento que seu médico receitou da última vez?",
            feedback: "Parcialmente incorreto. Embora seja útil saber sobre diagnósticos prévios, presumir que a cliente já consultou um médico ou teve uma condição semelhante anteriormente não é adequado como abordagem inicial.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo2-resposta",
        tipo: "informacao",
        texto: "Cliente: \"Acho que foi um produto novo que usei para lavar roupa. Já tive alergia a outros produtos de limpeza antes. Não tenho nenhuma doença crônica, mas estou tomando anticoncepcional. Ah, e tenho alergia à penicilina, mas acho que isso não tem nada a ver com pomadas, né?\"",
        proximoPasso: "passo3"
      },
      {
        id: "passo3",
        tipo: "pergunta",
        texto: "Com base nessas informações, o que você indica para a cliente?",
        opcoes: [
          {
            id: "3A",
            texto: "Recomendo um anti-histamínico oral como a Loratadina 10mg, 1 comprimido por dia, e uma pomada com hidrocortisona 1% para aplicar nas áreas afetadas 2 a 3 vezes ao dia, por até 7 dias.",
            feedback: "Correto! A combinação de anti-histamínico oral para controlar a reação alérgica sistêmica e corticoide tópico de baixa potência para as lesões localizadas é adequada para este caso.",
            correto: true,
            proximoPasso: "passo4"
          },
          {
            id: "3B",
            texto: "Sugiro uma pomada antibiótica com corticoide para tratar a infecção e a inflamação ao mesmo tempo.",
            feedback: "Incorreto. Não há indícios de infecção no relato da cliente, apenas alergia. Além disso, produtos com antibióticos não são a primeira escolha para reações alérgicas simples.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "3C",
            texto: "Recomendo apenas compressas frias e evitar o contato com o produto que causou a alergia. Medicamentos não são necessários neste caso.",
            feedback: "Parcialmente incorreto. Embora evitar o alérgeno e aplicar compressas frias sejam medidas importantes, a cliente apresenta sintomas que podem se beneficiar de tratamento medicamentoso de venda livre.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo4",
        tipo: "pergunta",
        texto: "A cliente concorda com suas recomendações. Esta é uma oportunidade para aumentar o ticket médio da venda. O que mais você poderia sugerir?",
        opcoes: [
          {
            id: "4A",
            texto: "Sugiro também um sabonete neutro hipoalergênico para a higiene da pele durante o tratamento, pois sabonetes comuns podem irritar ainda mais a pele sensibilizada.",
            feedback: "Correto! Um sabonete neutro é uma sugestão adequada para complementar o tratamento de problemas dermatológicos alérgicos, sendo uma boa forma de aumentar o ticket médio com um produto que beneficia a cliente.",
            correto: true,
            ticketMedio: true,
            proximoPasso: "passo5"
          },
          {
            id: "4B",
            texto: "Não sugiro nada adicional, pois os medicamentos indicados são suficientes para tratar a alergia.",
            feedback: "Aceitável, mas perdeu uma oportunidade de aumentar o ticket médio com produtos complementares que poderiam beneficiar a cliente.",
            correto: true,
            ticketMedio: false,
            proximoPasso: "passo5"
          },
          {
            id: "4C",
            texto: "Aproveite e leve também este creme anti-rugas que está em promoção, é ótimo para a sua idade.",
            feedback: "Incorreto. A sugestão não tem relação com o problema apresentado pela cliente e pode ser interpretada como inadequada ou ofensiva.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo5",
        tipo: "pergunta",
        texto: "Para finalizar o atendimento, quais orientações não farmacológicas você daria à cliente?",
        opcoes: [
          {
            id: "5A",
            texto: "Recomendo evitar o contato com o produto que causou a alergia, usar roupas de algodão frescas e soltas, tomar banhos mornos (não quentes) e evitar coçar as lesões para não piorar a irritação. Se a alergia piorar ou aparecer inchaço no rosto ou dificuldade para respirar, procure atendimento médico imediatamente.",
            feedback: "Correto! Essas orientações complementam o tratamento medicamentoso e alertam sobre sinais que indicariam a necessidade de avaliação médica urgente.",
            correto: true,
            proximoPasso: "fim-correto"
          },
          {
            id: "5B",
            texto: "Use os medicamentos conforme indicado e evite o produto que causou a alergia. Não há mais nada que precise fazer.",
            feedback: "Parcialmente incorreto. As orientações são muito limitadas e não abordam cuidados importantes com a pele durante o tratamento nem sinais de alerta.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "5C",
            texto: "Recomendo fazer compressas quentes nas lesões para acelerar a absorção da pomada e tomar banhos demorados com água bem quente para limpar bem a pele.",
            feedback: "Incorreto. Calor e banhos quentes podem piorar a irritação e a coceira em casos de alergia cutânea.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "fim-correto",
        tipo: "resultado",
        texto: "Parabéns! Você realizou um atendimento correto, indicando medicamentos apropriados para a reação alérgica da cliente e fornecendo orientações não farmacológicas importantes para complementar o tratamento.",
        resultado: {
          sucesso: true,
          pontos: 100,
          ticketMedio: true
        }
      },
      {
        id: "fim-incorreto",
        tipo: "resultado",
        texto: "Seu atendimento apresentou falhas importantes. Revise as indicações de medicamentos de venda livre para reações alérgicas cutâneas e lembre-se de fornecer orientações não farmacológicas adequadas.",
        resultado: {
          sucesso: false,
          pontos: 0,
          ticketMedio: false
        }
      }
    ]
  },
  
  // Problemas Digestivos - Adultos
  "SIM-DIGE-A-01": {
    id: "SIM-DIGE-A-01",
    titulo: "Cliente com azia e queimação",
    categoria: "Digestivo",
    publico: "Adulto",
    dificuldade: "facil",
    cenarioInicial: {
      cliente: "Boa tarde! Estou com uma azia terrível desde ontem. Sinto queimação no estômago e às vezes o gosto ruim sobe até a garganta, principalmente depois que como. Tem algum remédio bom para isso?",
      contexto: "Homem de aproximadamente 50 anos, aparenta desconforto e ocasionalmente coloca a mão sobre o abdômen."
    },
    passos: [
      {
        id: "passo1",
        tipo: "pergunta",
        texto: "Como você inicia o atendimento?",
        opcoes: [
          {
            id: "1A",
            texto: "Temos vários medicamentos para azia. Qual você costuma usar?",
            feedback: "Parcialmente incorreto. Embora seja útil saber se o cliente já usou algum medicamento antes, é importante fazer uma avaliação mais completa antes de discutir opções específicas.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "1B",
            texto: "Posso ajudar com isso, mas preciso fazer algumas perguntas para entender melhor seu caso e indicar o medicamento mais adequado.",
            feedback: "Correto! É importante coletar mais informações antes de fazer qualquer indicação.",
            correto: true,
            proximoPasso: "passo2"
          },
          {
            id: "1C",
            texto: "Azia constante pode ser refluxo ou até úlcera. Você deveria consultar um gastroenterologista antes de tomar qualquer medicamento.",
            feedback: "Parcialmente incorreto. Embora em casos crônicos ou graves seja recomendável consultar um médico, para episódios ocasionais de azia existem medicamentos de venda livre que podem ser indicados por balconistas.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo2",
        tipo: "pergunta",
        texto: "Quais perguntas você faz ao cliente?",
        opcoes: [
          {
            id: "2A",
            texto: "Há quanto tempo está sentindo essa azia? É frequente ou ocasional? Tem alguma doença crônica como hipertensão, diabetes ou problemas renais? Está tomando algum medicamento atualmente?",
            feedback: "Correto! Essas perguntas ajudam a entender a gravidade e frequência do problema, além de identificar possíveis contraindicações para os medicamentos.",
            correto: true,
            proximoPasso: "passo2-resposta"
          },
          {
            id: "2B",
            texto: "Já fez endoscopia alguma vez? Tem histórico de úlcera ou gastrite?",
            feedback: "Parcialmente incorreto. Embora essas informações possam ser relevantes, começar com perguntas sobre procedimentos médicos específicos pode sugerir condições mais graves desnecessariamente, causando ansiedade no cliente.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "2C",
            texto: "Qual tipo de antiácido você prefere: líquido ou comprimido? Prefere sabor de menta ou frutas?",
            feedback: "Incorreto. Antes de discutir preferências de forma farmacêutica ou sabor, é essencial entender o quadro clínico do cliente e possíveis contraindicações.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo2-resposta",
        tipo: "informacao",
        texto: "Cliente: \"Comecei a sentir essa azia forte ontem, depois de um churrasco. Às vezes tenho azia, mas não tão forte assim. Tenho pressão alta e tomo Losartana todo dia. Também tomo um anti-inflamatório de vez em quando para dor nas costas, acho que é Ibuprofeno.\"",
        proximoPasso: "passo3"
      },
      {
        id: "passo3",
        tipo: "pergunta",
        texto: "Com base nessas informações, o que você indica para o cliente?",
        opcoes: [
          {
            id: "3A",
            texto: "Recomendo um antiácido à base de hidróxido de alumínio e magnésio, como Mylanta ou Maalox. Tome 10ml ou 1-2 comprimidos mastigáveis após as refeições e ao deitar, por até 7 dias.",
            feedback: "Correto! Antiácidos são adequados para azia ocasional e não interagem significativamente com a Losartana. Além disso, você forneceu instruções claras sobre a posologia.",
            correto: true,
            proximoPasso: "passo4"
          },
          {
            id: "3B",
            texto: "Sugiro Omeprazol 20mg, 1 cápsula em jejum pela manhã, por 14 dias. É o mais potente para azia.",
            feedback: "Parcialmente incorreto. Embora o Omeprazol seja eficaz para azia, é mais indicado para tratamentos prolongados de refluxo ou uso sob orientação médica. Para um episódio ocasional após excessos alimentares, um antiácido seria mais apropriado como primeira escolha.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "3C",
            texto: "Recomendo continuar com o Ibuprofeno para aliviar a inflamação do estômago, junto com um protetor gástrico.",
            feedback: "Incorreto. O Ibuprofeno (anti-inflamatório) pode piorar a azia e irritar o estômago, não sendo indicado para esse problema. Além disso, não se deve incentivar o uso contínuo de anti-inflamatórios sem necessidade.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo4",
        tipo: "pergunta",
        texto: "O cliente concorda com sua recomendação. Esta é uma oportunidade para aumentar o ticket médio da venda. O que mais você poderia sugerir?",
        opcoes: [
          {
            id: "4A",
            texto: "Sugiro também um chá de camomila ou erva-doce, que têm propriedades calmantes para o sistema digestivo e podem complementar o tratamento da azia.",
            feedback: "Correto! Chás digestivos são uma sugestão adequada para complementar o tratamento de problemas gástricos, sendo uma boa forma de aumentar o ticket médio com um produto natural que pode beneficiar o cliente.",
            correto: true,
            ticketMedio: true,
            proximoPasso: "passo5"
          },
          {
            id: "4B",
            texto: "Não sugiro nada adicional, pois o antiácido indicado é suficiente para tratar a azia.",
            feedback: "Aceitável, mas perdeu uma oportunidade de aumentar o ticket médio com produtos complementares que poderiam beneficiar o cliente.",
            correto: true,
            ticketMedio: false,
            proximoPasso: "passo5"
          },
          {
            id: "4C",
            texto: "Aproveite e leve também este Ibuprofeno em promoção para ter sempre em casa para suas dores nas costas.",
            feedback: "Incorreto. O Ibuprofeno pode piorar problemas gástricos como a azia, e não seria apropriado incentivar seu uso, especialmente considerando que o cliente já mencionou que o utiliza ocasionalmente.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "passo5",
        tipo: "pergunta",
        texto: "Para finalizar o atendimento, quais orientações não farmacológicas você daria ao cliente?",
        opcoes: [
          {
            id: "5A",
            texto: "Recomendo evitar alimentos gordurosos, picantes, café, álcool e refrigerantes. Faça refeições menores e mais frequentes, não deite logo após comer e, se possível, eleve a cabeceira da cama para dormir. Se os sintomas persistirem por mais de 7 dias ou piorarem, é importante consultar um médico.",
            feedback: "Correto! Essas orientações ajudam a prevenir novos episódios de azia e complementam o tratamento medicamentoso.",
            correto: true,
            proximoPasso: "fim-correto"
          },
          {
            id: "5B",
            texto: "Tome o antiácido conforme indicado e evite comer demais. Não há mais nada que precise fazer.",
            feedback: "Parcialmente incorreto. As orientações são muito limitadas e não abordam mudanças importantes na dieta e hábitos que podem prevenir novos episódios de azia.",
            correto: false,
            proximoPasso: "fim-incorreto"
          },
          {
            id: "5C",
            texto: "Recomendo fazer jejum por 24 horas para descansar o estômago e depois retomar a alimentação normal.",
            feedback: "Incorreto. Jejum prolongado não é recomendado para azia e pode até piorar os sintomas em alguns casos. Refeições pequenas e frequentes são geralmente mais indicadas.",
            correto: false,
            proximoPasso: "fim-incorreto"
          }
        ]
      },
      {
        id: "fim-correto",
        tipo: "resultado",
        texto: "Parabéns! Você realizou um atendimento correto, indicando medicamentos apropriados para a azia do cliente e fornecendo orientações não farmacológicas importantes para prevenir novos episódios.",
        resultado: {
          sucesso: true,
          pontos: 100,
          ticketMedio: true
        }
      },
      {
        id: "fim-incorreto",
        tipo: "resultado",
        texto: "Seu atendimento apresentou falhas importantes. Revise as indicações de medicamentos de venda livre para azia e refluxo, e lembre-se de fornecer orientações não farmacológicas adequadas.",
        resultado: {
          sucesso: false,
          pontos: 0,
          ticketMedio: false
        }
      }
    ]
  }
};

// Exportar o banco de dados de simulações
export default simulacoes;
