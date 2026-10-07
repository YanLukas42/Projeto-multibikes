const DB = {
    categories: [
        { id: 'todas', name: 'Todas' },
        { id: 'scrambler', name: 'Scrambler (Estilo Moto)' },
        { id: 'dobravel', name: 'Dobráveis' },
        { id: 'urbana', name: 'Pop & Urbanas' },
        { id: 'acessorios', name: 'Acessórios' }
    ],
    bikes: [
        {
            id: 1,
            name: 'Inow V20 Pro 1000W',
            category: 'scrambler',
            price: 8990.00,
            image: 'assets/images/bike_scrambler_v20.jpg',
            badge: 'MAIS VENDIDA',
            description: 'O verdadeiro ícone da Mult Bikes! Estilo Café Racer / Moto Scrambler com pneus Fat Tire 20x4.0. Potência bruta de 1000W para vencer qualquer ladeira com conforto premium e desbloqueio por cartão NFC.',
            specs: [
                'Motor: 1000W Potência de Pico',
                'Bateria: Lítio 48V 15Ah (Removível)',
                'Autonomia: Até 55-65km no modo assistido',
                'Tecnologia: Chave Presencial / Cartão NFC',
                'Pneus: Kenda Fat Tire 20x4.0 antifuro',
                'Freios: A disco hidráulicos com sensor de corte',
                'Farol: LED Angel-Eye de alta intensidade'
            ]
        },
        {
            id: 2,
            name: 'Inow V8 Pro / Ultra',
            category: 'scrambler',
            price: 7890.00,
            image: 'assets/images/bike_v8_pro.jpg',
            badge: 'DESTAQUE',
            description: 'A clássica V8 que domina as ruas. Banco bipartido em couro alongado para levar carona com total conforto, suspensão dianteira invertida e farol angel-eye gigante.',
            specs: [
                'Motor: 750W (Pico de 1000W)',
                'Bateria: 48V 15Ah Removível',
                'Autonomia: Até 50km',
                'Banco: Estilo moto bipartido com apoio para garupa',
                'Capacidade de Carga: Suporta até 150kg',
                'Display: LCD com velocímetro e odômetro'
            ]
        },
        {
            id: 3,
            name: 'Inow V35 Scrambler',
            category: 'scrambler',
            price: 8490.00,
            image: 'assets/images/bike_inow_v35.jpg',
            badge: 'LANÇAMENTO',
            description: 'O equilíbrio perfeito entre agilidade e pegada esportiva. Estrutura tubular treliçada reforçada, amortecimento central progressivo e excelente torque urbano.',
            specs: [
                'Motor: 750W Brushless High Torque',
                'Bateria: 48V 16Ah Lítio',
                'Autonomia: Até 60km',
                'Quadro: Aço carbono com design treliçado',
                'Pneus: Fat Tire 20x4.0 mistos',
                'Display: LCD digital integrado com porta USB'
            ]
        },
        {
            id: 4,
            name: 'Ouxi V9 E-Bike Dobrável',
            category: 'dobravel',
            price: 6990.00,
            image: 'assets/images/bike_dobravel_v9.jpg',
            badge: 'PORTÁTIL FAT',
            description: 'A dobrável mais completa e versátil. Junta a robustez dos pneus largos Fat Tire com a conveniência de dobrar o quadro em segundos para colocar no porta-malas ou elevador.',
            specs: [
                'Quadro: Alumínio 6061 dobrável com trava rápida',
                'Motor: 750W High Performance',
                'Bateria: 48V 13Ah embutida no quadro',
                'Display: Painel digital colorido central',
                'Pneus: Fat Tire Aro 20x4.0 com cravos',
                'Câmbio: Shimano 7 Velocidades'
            ]
        },
        {
            id: 5,
            name: 'X100 Elite Mini',
            category: 'dobravel',
            price: 5890.00,
            image: 'assets/images/bike_x100_elite.jpg',
            badge: 'COMPACTA',
            description: 'Design futurista com quadro em formato X na cor branca. Super ágil, compacta e extremamente fácil de manobrar nas ciclovias e no trânsito diário.',
            specs: [
                'Motor: 350W Brushless inteligente',
                'Bateria: 36V 10.4Ah integrada',
                'Autonomia: Até 45km',
                'Quadro: Design geométrico exclusivo em X',
                'Freios: A disco ventilados dianteiro e traseiro'
            ]
        },
        {
            id: 6,
            name: 'Bike Elétrica Pop 800',
            category: 'urbana',
            price: 4490.00,
            image: 'assets/images/bike_pop800.jpg',
            badge: 'CUSTO-BENEFÍCIO',
            description: 'A queridinha do dia a dia e trabalho! Quadro rebaixado para subir e descer sem esforço, cesto frontal amplo para bolsas e compras, e banco acolchoado extra-confortável.',
            specs: [
                'Motor: 500W Potente para subidas leves',
                'Cesto: Aço reforçado frontal incluso',
                'Bateria: 48V 12Ah com chave e trava antifurto',
                'Autonomia: Até 40km por carga',
                'Acessórios: Alarme com bloqueio de roda traseira'
            ]
        },
        {
            id: 7,
            name: 'Inow X25 Urban',
            category: 'urbana',
            price: 5990.00,
            image: 'assets/images/bike_inow_x25.jpg',
            badge: 'URBANA',
            description: 'A evolução da mobilidade urbana. Geometria ergonômica com iluminação LED de 360 graus integrada ao quadro e bateria removível para recarregar no escritório.',
            specs: [
                'Motor: 350W silencioso de tração direta',
                'Bateria: 36V 13Ah de recarga rápida (4h)',
                'Autonomia: Até 50km',
                'Farol & Lanterna: LEDs embutidos no chassi',
                'Design: Step-through moderno na cor branca'
            ]
        }
    ],
    accessories: [
        {
            id: 'acc1',
            name: 'Capacete Smart Aero',
            category: 'acessorios',
            badge: 'ACESSÓRIO',
            price: 599.00,
            image: 'assets/images/accessory_helmet.jpg',
            description: 'Capacete com LED traseiro e conectividade Bluetooth.'
        },
        {
            id: 'acc2',
            name: 'Cesta Dianteira Premium',
            category: 'acessorios',
            badge: 'ACESSÓRIO',
            price: 249.00,
            image: 'assets/images/accessory_basket.jpg',
            description: 'Cesta resistente de aço em black matte.'
        },
        {
            id: 'acc3',
            name: 'Trava U-Lock Reforçada',
            category: 'acessorios',
            badge: 'ACESSÓRIO',
            price: 189.00,
            image: 'assets/images/accessory_lock.jpg',
            description: 'Nível máximo de segurança com chave codificada.'
        },
        {
            id: 'acc4',
            name: 'Bagageiro Traseiro',
            category: 'acessorios',
            badge: 'ACESSÓRIO',
            price: 349.00,
            image: 'assets/images/accessory_bag.jpg',
            description: 'Bolsa lateral impermeável de alta capacidade.'
        }
    ],
    paymentConfig: {
        pixDiscountPercent: 5,
        maxInstallments: 12,
        interestFreeInstallments: 3,
        // Taxa aproximada padrão de maquininhas modernas (MercadoPago / Stone / PagSeguro)
        rates: {
            1: 0,
            2: 0,
            3: 0,
            4: 0.045,
            5: 0.055,
            6: 0.065,
            7: 0.075,
            8: 0.085,
            9: 0.095,
            10: 0.105,
            11: 0.115,
            12: 0.125
        }
    },
    faqs: [
        {
            question: "Preciso de CNH ou emplacamento para pilotar as bikes?",
            answer: "Não! Todas as bikes elétricas da Mult Bikes atendem rigorosamente à Resolução nº 996 do CONTRAN (velocidade até 32 km/h com pedal assistido e acelerador homologado). São equiparadas a bicicletas convencionais, sem necessidade de habilitação, emplacamento ou IPVA."
        },
        {
            question: "Como funciona para carregar a bateria?",
            answer: "Super prático: basta conectar o carregador inteligente bivolt em qualquer tomada comum (110V ou 220V), como se fosse um notebook. Nossos modelos possuem bateria removível com trava de segurança, permitindo recarregar dentro de casa, apartamento ou no trabalho em 4 a 6 horas."
        },
        {
            question: "Posso andar na chuva com a minha e-bike?",
            answer: "Sim! O motor, a controladora, bateria e conectores possuem vedação resistente à água (padrão IP65). Você pode pedalar na chuva tranquilamente, evitando apenas submergir o motor em enchentes e alagamentos profundos."
        },
        {
            question: "Como funciona o parcelamento no cartão?",
            answer: "Aceitamos as principais bandeiras (Visa, Master, Elo, Hipercard) em até 12x no cartão de crédito, com opção de até 3x sem juros, ou desconto especial de 5% à vista no Pix. Você pode simular o valor exato de cada parcela clicando em 'Ver e Comprar' no modelo desejado."
        },
        {
            question: "Qual é o tempo de garantia e onde faço manutenção?",
            answer: "Oferecemos 1 ano de garantia para o chassi, motor e bateria. Além disso, você conta com assistência técnica especializada e estoque de peças original na nossa loja física no Centro de Niterói."
        },
        {
            question: "A bike já é entregue montada e pronta para uso?",
            answer: "Sim! Para Niterói e cidades vizinhas no Rio de Janeiro, entregamos a bicicleta 100% montada, revisada, regulada e com a bateria carregada para você sair pedalando no mesmo dia."
        }
    ]
};

