import type { Question } from '@/engine/types';

/**
 * 21 вопросов: 18 основных (3 на категорию) + 3 контрольных.
 *
 * Меры против социальной желательности:
 * - Порядок ответов рандомизируется (shuffleOptions: true)
 * - ~30% вопросов: лучший ответ НЕ на первой позиции в authored order
 * - 3–4 ловушки (isTrap): звучат зрело, но указывают на ручное управление
 * - Формулировки через конкретные ситуации, а не оценки
 * - Контрольные вопросы косвенно проверяют категории
 */
export const QUESTIONS: Question[] = [
  // ═══════════════════════════════════════════════════════════════
  // ЯСНОСТЬ КУРСА (clarity)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'clarity_1',
    kind: 'main',
    categoryId: 'clarity',
    prompt: 'К вам пришёл потенциальный партнёр с интересным, но непрофильным предложением. Как скорее всего пойдёт обсуждение внутри компании?',
    options: [
      { id: 'clarity_1_a', label: 'Быстро соотнесём с приоритетами на год и решим — подходит или нет', score: 10, originalOrder: 0 },
      { id: 'clarity_1_b', label: 'Соберём совещание, обсудим плюсы и минусы — решение примем за неделю', score: 7, originalOrder: 1 },
      { id: 'clarity_1_c', label: 'Собственник скажет «интересно, давайте попробуем» или «нет, не сейчас» — по ощущениям', score: 5, originalOrder: 2 },
      { id: 'clarity_1_d', label: 'Начнём пробовать параллельно с основной работой — потом станет понятно', score: 2, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['strategy', 'focus'],
  },
  {
    id: 'clarity_2',
    kind: 'main',
    categoryId: 'clarity',
    prompt: 'Пятница вечер. Вы спрашиваете руководителя отдела: «Над чем твоя команда будет работать на следующей неделе?» Какой отве�� вероятнее?',
    options: [
      { id: 'clarity_2_a', label: 'Назовёт 2–3 задачи, привязанные к квартальным целям', score: 10, originalOrder: 0 },
      { id: 'clarity_2_b', label: 'Перечислит текущие дела — правильные, но без связи с большой карти��ой', score: 6, originalOrder: 1 },
      { id: 'clarity_2_c', label: '«Пока не знаю — в понедельник станет понятно, что прилетит»', score: 3, originalOrder: 2 },
      { id: 'clarity_2_d', label: 'Удивится вопросу — планировать на неделю вперёд у нас не принято', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['planning', 'alignment'],
  },
  {
    id: 'clarity_3',
    kind: 'main',
    categoryId: 'clarity',
    prompt: 'За последние 3 месяца сколько раз существенно менялось то, что вы считаете «главным» для компании прямо сейчас?',
    options: [
      // Лучший ответ на позиции B (не A) — снижает угадываемость
      { id: 'clarity_3_a', label: 'Сложно сказать, потому что «главного» как единой вещи нет — много параллельных потоков', score: 2, originalOrder: 0 },
      { id: 'clarity_3_b', label: 'Ни разу — фокус стабильный, планомерно двигаемся', score: 10, originalOrder: 1 },
      { id: 'clarity_3_c', label: 'Один раз — скорректировали из-за внешних обстоятельств', score: 8, originalOrder: 2 },
      { id: 'clarity_3_d', label: 'Два-три раза — каждый месяц что-то сдвигается', score: 4, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['stability', 'focus'],
  },

  // ═══════════════════════════════════════════════════════════════
  // ПРИНЯТИЕ РЕШЕНИЙ (decisions)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'decisions_1',
    kind: 'main',
    categoryId: 'decisions',
    prompt: 'Вчера возникла ситуация: клиент хочет нестандартные условия, нужно решить сегодня. Кто решит?',
    options: [
      { id: 'decisions_1_a', label: 'Менеджер, который ведёт клиента — у него есть рамки для самостоятельных решений', score: 10, originalOrder: 0 },
      { id: 'decisions_1_b', label: 'Менеджер позвонит руководителю отдела, тот решит за 15 минут', score: 7, originalOrder: 1 },
      { id: 'decisions_1_c', label: 'Дойдёт до директора/собственника — только он может отступить от стандартов', score: 4, originalOrder: 2 },
      { id: 'decisions_1_d', label: 'Клиенту скажут «мы вернёмся» — решение будет через пару дней', score: 2, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['delegation', 'speed'],
  },
  {
    id: 'decisions_2',
    kind: 'main',
    categoryId: 'decisions',
    prompt: 'На совещании двое руководителей аргументированно, но противоположно оценивают ситуацию. Что произойдёт?',
    options: [
      // ЛОВУШКА: вариант B звучит зрело («директор примет решение»), но это централизация
      { id: 'decisions_2_a', label: 'Выслушают друг друга, найдут компромисс или договорятся на эксперимент', score: 10, originalOrder: 0 },
      { id: 'decisions_2_b', label: 'Послушают обоих, потом директор примет решение — и оба выполнят', score: 6, isTrap: true, originalOrder: 1 },
      { id: 'decisions_2_c', label: 'Один надавит громче, второй уступит — но внутренне останется при своём', score: 4, originalOrder: 2 },
      { id: 'decisions_2_d', label: 'Тему «заболтают» и перейдут к следующему вопросу — решение не примут', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['conflict', 'culture'],
  },
  {
    id: 'decisions_3',
    kind: 'main',
    categoryId: 'decisions',
    prompt: 'Вспомните решение, которое вы приняли на прошлой неделе. Как долго оно «висело» до этого?',
    options: [
      { id: 'decisions_3_a', label: 'Приняли в тот же день, когда появилась достаточная информация', score: 10, originalOrder: 0 },
      { id: 'decisions_3_b', label: 'Пара дней — нужно было свериться с нужным человеком', score: 7, originalOrder: 1 },
      { id: 'decisions_3_c', label: 'Больше недели — ждали совещания или подходящего момента', score: 4, originalOrder: 2 },
      { id: 'decisions_3_d', label: 'Это решение «висело» давно — просто наконец руки дошли', score: 2, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['speed', 'bottleneck'],
  },

  // ═══════════════════════════════════════════════════════════════
  // ДОВЕДЕНИЕ ДО РЕЗУЛЬТАТА (execution)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'execution_1',
    kind: 'main',
    categoryId: 'execution',
    prompt: 'Вы договорились на совещании в понедельник, что три задачи будут сделаны к пятнице. Что реально произойдёт?',
    options: [
      { id: 'execution_1_a', label: 'Две-три будут сделаны; если что-то сдвинулось — я знаю заранее', score: 10, originalOrder: 0 },
      { id: 'execution_1_b', label: 'Одна точно будет, по второй частично, третья перенесётся без предупреждения', score: 6, originalOrder: 1 },
      { id: 'execution_1_c', label: 'В пятницу вспомню сам и начну спрашивать — кто-то забыл, кто-то «не успел»', score: 3, originalOrder: 2 },
      { id: 'execution_1_d', label: 'К пятнице это совещание будет вытеснено новыми задачами', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['accountability', 'followthrough'],
  },
  {
    id: 'execution_2',
    kind: 'main',
    categoryId: 'execution',
    prompt: 'Когда поручение «буксует» — как вы обычно об этом узнаёте?',
    options: [
      // Лучший ответ на позиции C — снижает паттерн «первый = лучший»
      { id: 'execution_2_a', label: 'Замечаю сам, когда спрашиваю — если не спрошу, могу не узнать вовремя', score: 4, originalOrder: 0 },
      { id: 'execution_2_b', label: 'Вижу на регулярной планёрке — у нас есть ритм контроля', score: 8, originalOrder: 1 },
      { id: 'execution_2_c', label: 'Исполнитель сам сообщает и предлагает план Б', score: 10, originalOrder: 2 },
      { id: 'execution_2_d', label: 'Узнаю, когда последствия уже видны — клиент жалуется, срок сорван', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['feedback-loops', 'transparency'],
  },
  {
    id: 'execution_3',
    kind: 'main',
    categoryId: 'execution',
    prompt: 'Есть ли место (доска, таблица, система), где можно увидеть ВСЕ текущие задачи и их статус?',
    options: [
      { id: 'execution_3_a', label: 'Да, и она актуальна — команда сама обновляет статусы', score: 10, originalOrder: 0 },
      { id: 'execution_3_b', label: 'Есть, но актуальна процентов на 60 — часть задач «мимо» системы', score: 6, originalOrder: 1 },
      { id: 'execution_3_c', label: 'У каждого своё — кто в блокноте, кто в чате, единой картины нет', score: 3, originalOrder: 2 },
      { id: 'execution_3_d', label: 'Полная картина — только в голове у собственника/директора', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['visibility', 'systems'],
  },

  // ═══════════════════════════════════════════════════════════════
  // СТРУКТУРА И ��ОЛИ (structure)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'structure_1',
    kind: 'main',
    categoryId: 'structure',
    prompt: 'Вы решили поручить новую задачу. Как быстро понимаете, КОМУ её поручить?',
    options: [
      { id: 'structure_1_a', label: 'Сразу понятно — зоны ответственности определены, выбор очевиден', score: 10, originalOrder: 0 },
      { id: 'structure_1_b', label: 'Обычно понятно, но иногда задача «на стыке» — и непонятно, чья', score: 7, originalOrder: 1 },
      { id: 'structure_1_c', label: 'Часто думаю: формально к Васе, но Вася перегружен, а Маша справится лучше', score: 4, originalOrder: 2 },
      { id: 'structure_1_d', label: 'Поручаю тому, кто сейчас «на виду» или кого удалось поймать первым', score: 2, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['clarity-of-roles', 'ownership'],
  },
  {
    id: 'structure_2',
    kind: 'main',
    categoryId: 'structure',
    prompt: 'Ваш ключевой сотрудник уехал в отпуск на 2 недели. Что происходит с его зоной ответственности?',
    options: [
      // ЛОВУШКА: вариант C «он и в отпуске на связи» звучит как ответственность, но это зависимость
      { id: 'structure_2_a', label: 'Подхватывает коллега по понятной процедуре — клиенты не замечают разницы', score: 10, originalOrder: 0 },
      { id: 'structure_2_b', label: 'Основные вещи подхватят, но часть вопросов подвиснет до возвращения', score: 7, originalOrder: 1 },
      { id: 'structure_2_c', label: 'Он и в отпуске на связи — иначе всё встанет', score: 3, isTrap: true, originalOrder: 2 },
      { id: 'structure_2_d', label: 'Все ждут его возвращения, параллельно решая только горящее', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['resilience', 'bus-factor'],
  },
  {
    id: 'structure_3',
    kind: 'main',
    categoryId: 'structure',
    prompt: 'Когда в компании появляется задача, которая «ничья» — что происходит?',
    options: [
      // Лучший на позиции D
      { id: 'structure_3_a', label: 'Задача «болтается» пока не станет горящей — тогда берёт тот, кому больше всех надо', score: 3, originalOrder: 0 },
      { id: 'structure_3_b', label: 'Такие задачи обычно делает собственник — потому что больше некому', score: 1, originalOrder: 1 },
      { id: 'structure_3_c', label: 'Руководитель назначает кого-то — но это каждый раз заново', score: 6, originalOrder: 2 },
      { id: 'structure_3_d', label: 'Быстро определяем ответственного и фиксируем — чтобы в следующий раз было понятно', score: 10, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['ownership', 'processes'],
  },

  // ═══════════════════════════════════════════════════════════════
  // К��МАНДНОЕ ВЗАИМОДЕЙСТВИЕ (teamwork)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'teamwork_1',
    kind: 'main',
    categoryId: 'teamwork',
    prompt: 'Сотрудник допустил дорогую ошибку. Вы узнали. Что с наибольшей вероятностью произойдёт дальше?',
    options: [
      { id: 'teamwork_1_a', label: 'Он сам уже пришёл с разбором: что случилось, что сделал, что предлагает', score: 10, originalOrder: 0 },
      { id: 'teamwork_1_b', label: 'Я разберу с ним лично — спокойно, но ошибку зафиксируем', score: 7, originalOrder: 1 },
      { id: 'teamwork_1_c', label: 'Узнаю случайно или от третьих лиц — сам он не расскажет', score: 3, originalOrder: 2 },
      { id: 'teamwork_1_d', label: 'Все знают, но молчат — ждут, заметит руководство или «пронесёт»', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['trust', 'psychological-safety'],
  },
  {
    id: 'teamwork_2',
    kind: 'main',
    categoryId: 'teamwork',
    prompt: 'Вы предложили команде идею, в которую верите. Но она рискованная. Какая реакция вероятнее?',
    options: [
      { id: 'teamwork_2_a', label: 'Зададут жёсткие вопросы, назовут риски прямо — даже если мне неприятно', score: 10, originalOrder: 0 },
      { id: 'teamwork_2_b', label: 'Пара человек скажет сомнения, остальные промолчат и согласятся', score: 6, originalOrder: 1 },
      { id: 'teamwork_2_c', label: 'Все поддержат на словах, но потом за спиной будут обсуждать', score: 3, originalOrder: 2 },
      { id: 'teamwork_2_d', label: 'Согласятся сразу — у нас не принято спорить с руководителем', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['openness', 'dissent'],
  },
  {
    id: 'teamwork_3',
    kind: 'main',
    categoryId: 'teamwork',
    prompt: 'Руководителю продаж нужна помощь от руководителя производства. Как это обычно происходит?',
    options: [
      // ЛОВУШКА: вариант B «напишет, но если не ответит — к директору» — значит нет культуры горизонтального взаимодействия
      { id: 'teamwork_3_a', label: 'Договариваются между собой напрямую — это нормальная практика', score: 10, originalOrder: 0 },
      { id: 'teamwork_3_b', label: 'Один напишет другому, но если тот не ответит — пойдут к директору', score: 5, isTrap: true, originalOrder: 1 },
      { id: 'teamwork_3_c', label: 'Сразу идут к директору — «реши, пожалуйста, мы сами не договоримся»', score: 3, originalOrder: 2 },
      { id: 'teamwork_3_d', label: 'Между ними хроническое напряжение — каждый запрос превращается в конфликт', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['horizontal', 'coordination'],
  },

  // ═══════════════════════════════════════════════════════════════
  // РАБОТА С ЛЮДЬМИ (people)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'people_1',
    kind: 'main',
    categoryId: 'people',
    prompt: 'Новый сотрудник вышел в понедельник. Как выглядит его первая неделя?',
    options: [
      { id: 'people_1_a', label: 'Есть план: знакомство с командой, наставник, задачи с чек-пойнтами', score: 10, originalOrder: 0 },
      { id: 'people_1_b', label: 'Руководитель проведёт по офису, объяснит основное, дальше — по ситуации', score: 7, originalOrder: 1 },
      { id: 'people_1_c', label: 'Посадят рядом с опытным коллегой, и он постепенно вольётся сам', score: 4, originalOrder: 2 },
      { id: 'people_1_d', label: 'Получит задачу в первый день — учиться будет в процессе, мы так все начинали', score: 2, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['onboarding', 'adaptation'],
  },
  {
    id: 'people_2',
    kind: 'main',
    categoryId: 'people',
    prompt: 'Когда руководитель в последний раз говорил с сотрудником о том, что получается хорошо, а где расти — не в контексте косяка, а планово?',
    options: [
      // Лучший на позиции C
      { id: 'people_2_a', label: 'Честно — не помню. Хвалим за хорошее, ругаем за плохое, но отдельного разговора нет', score: 1, originalOrder: 0 },
      { id: 'people_2_b', label: 'Только когда сотрудник сам инициирует — «а как я вообще?»', score: 3, originalOrder: 1 },
      { id: 'people_2_c', label: 'Это регулярный ритм: раз в месяц или квартал, есть формат, к нему готовятся', score: 10, originalOrder: 2 },
      { id: 'people_2_d', label: 'Бывает пару раз в год — на аттестации или перед повышением', score: 6, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['feedback', '1on1'],
  },
  {
    id: 'people_3',
    kind: 'main',
    categoryId: 'people',
    prompt: 'Вспомните последнего сотрудника, который ушёл по собственному. Что вы знаете о реальной причине?',
    options: [
      { id: 'people_3_a', label: 'Провели exit-разговор, знаем причину и учли — что-то поменяли', score: 10, originalOrder: 0 },
      { id: 'people_3_b', label: 'Поговорили неформально — примерно понимаем, но не уверены', score: 7, originalOrder: 1 },
      { id: 'people_3_c', label: 'Официально — «нашёл другую работу». Реальную причину можно только предполагать', score: 4, originalOrder: 2 },
      { id: 'people_3_d', label: 'Не разбирались — люди приходят и уходят, это нормально', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['retention', 'exit'],
  },

  // ═══════════════════════════════════════════════════════════════
  // КОНТРОЛЬНЫЕ ВОПРОСЫ
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'control_1',
    kind: 'control',
    categoryId: 'decisions', // размещён в decisions для UI, но проверяет связку
    controlForCategoryIds: ['decisions', 'clarity'],
    prompt: 'Как бы вы описали свою типичную рабочую неделю?',
    options: [
      { id: 'control_1_a', label: 'Много стратегических задач и развития — операционка не отвлекает', score: 10, originalOrder: 0 },
      { id: 'control_1_b', label: 'Примерно пополам: часть на развитие, часть — на тушение текучки', score: 7, originalOrder: 1 },
      { id: 'control_1_c', label: 'В основном операционка и «тушение пожаров» — до стратегии руки не доходят', score: 4, originalOrder: 2 },
      { id: 'control_1_d', label: 'Каждый день — реагирую на то, что прилетает. Планировать некогда', score: 1, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['meta', 'workload'],
  },
  {
    id: 'control_2',
    kind: 'control',
    categoryId: 'execution', // размещён в execution, проверяет связку
    controlForCategoryIds: ['execution', 'structure'],
    prompt: 'Если вы уедете из офиса на неделю без связи — что произойдёт с текущими проектами?',
    options: [
      // Лучший на позиции D
      { id: 'control_2_a', label: 'Честно? Лучше не проверять. Я и в отпуске на связи', score: 1, originalOrder: 0 },
      { id: 'control_2_b', label: 'Часть процессов встанет — люди будут ждать моих указаний', score: 4, originalOrder: 1 },
      { id: 'control_2_c', label: 'Основное не остановится, но накопится очередь решений «для меня»', score: 7, originalOrder: 2 },
      { id: 'control_2_d', label: 'Всё продолжится штатно — команда самостоятельна', score: 10, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['meta', 'autonomy'],
  },
  {
    id: 'control_3',
    kind: 'control',
    categoryId: 'teamwork', // размещён в teamwork, проверяет связку
    controlForCategoryIds: ['teamwork', 'people'],
    prompt: 'Когда вам нужно принять важное кадровое решение (повышение, увольнение, реструктуризация) — на чём вы основываетесь?',
    options: [
      { id: 'control_3_a', label: 'На регулярных данных: результаты, обратная связь от команды, динамика', score: 10, originalOrder: 0 },
      { id: 'control_3_b', label: 'На своём опыте взаимодействия с человеком и мнении его руководителя', score: 7, originalOrder: 1 },
      { id: 'control_3_c', label: 'На интуиции — я хорошо чувствую людей и редко ошибаюсь', score: 4, isTrap: true, originalOrder: 2 },
      { id: 'control_3_d', label: 'Обычно решение принимается, когда ситуация уже «перезрела» — раньше трудно', score: 2, originalOrder: 3 },
    ],
    shuffleOptions: true,
    tags: ['meta', 'people-decisions'],
  },
];

export const MAIN_QUESTIONS = QUESTIONS.filter((q) => q.kind === 'main');
export const CONTROL_QUESTIONS = QUESTIONS.filter((q) => q.kind === 'control');
export const TOTAL_QUESTIONS = QUESTIONS.length;
