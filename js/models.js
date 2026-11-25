/*
 * Каталог моделей. Характеристики приведены для указанной версии (trim)
 * и могут отличаться в зависимости от рынка и года выпуска.
 * era: "new" — актуальный модельный ряд, "classic" — история.
 * body: sedan | suv | coupe | roadster | ev | van | hyper
 * img: имя файла в /img (без расширения). Если фото нет (null) — показывается нарисованная SVG-иллюстрация.
 */
window.MODELS = [
  /* ============ АКТУАЛЬНЫЕ МОДЕЛИ ============ */
  {
    id: "s-class", name: "S-Class", code: "W223", era: "new", body: "sedan", amg: false,
    years: "2020 — н.в.", year: 2020, trim: "S 580 4MATIC", img: null,
    tagline: "Флагман, по которому равняется вся индустрия.",
    desc: "Седьмое поколение S-Class — технологический флагман марки: MBUX Hyperscreen, система автономного вождения 3-го уровня DRIVE PILOT, задние подруливающие колёса с углом до 10° и активная подвеска E-ACTIVE BODY CONTROL.",
    engine: "4.0 V8 битурбо + EQ Boost", power: 503, torque: 700, accel: 4.4, vmax: 250,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 5289, weight: 2195, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "maybach-s", name: "Mercedes-Maybach S-Class", code: "Z223", era: "new", body: "sedan", amg: false,
    years: "2021 — н.в.", year: 2021, trim: "S 680 4MATIC", img: null,
    tagline: "Абсолютная роскошь для заднего ряда.",
    desc: "Удлинённая на 18 см версия S-Class с креслами Executive, массажем, холодильником и двухцветной окраской, наносимой вручную. Версия S 680 — единственная в линейке с двигателем V12.",
    engine: "6.0 V12 битурбо", power: 612, torque: 900, accel: 4.5, vmax: 250,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 5469, weight: 2350, fuel: "Бензин"
  },
  {
    id: "e-class", name: "E-Class", code: "W214", era: "new", body: "sedan", amg: false,
    years: "2023 — н.в.", year: 2023, trim: "E 450 4MATIC", img: "e-class",
    tagline: "Бизнес-седан нового поколения.",
    desc: "Шестое поколение E-Class получило опциональный MBUX Superscreen с экраном для пассажира, селфи-камеру для видеозвонков и только электрифицированные двигатели — мягкие и подзаряжаемые гибриды.",
    engine: "3.0 I6 турбо + EQ Boost", power: 381, torque: 500, accel: 4.5, vmax: 250,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 4949, weight: 1985, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "c-class", name: "C-Class", code: "W206", era: "new", body: "sedan", amg: false,
    years: "2021 — н.в.", year: 2021, trim: "C 300 4MATIC", img: "c-class",
    tagline: "«Маленький S-Class» в компактном формате.",
    desc: "Пятое поколение C-Class переняло дизайн и цифровой интерьер у флагмана: вертикальный центральный экран, MBUX второго поколения, все двигатели — четырёхцилиндровые с электрификацией.",
    engine: "2.0 I4 турбо + EQ Boost", power: 258, torque: 400, accel: 6.0, vmax: 250,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 4751, weight: 1720, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "a-class", name: "A-Class", code: "W177", era: "new", body: "sedan", amg: false,
    years: "2018 — 2026", year: 2018, trim: "A 200", img: "a-class",
    tagline: "Входной билет в мир Mercedes-Benz.",
    desc: "Компактный хэтчбек, впервые получивший систему MBUX с голосовым ассистентом «Hey Mercedes». Самая доступная модель марки, выпуск которой завершается в 2026 году.",
    engine: "1.3 I4 турбо", power: 163, torque: 270, accel: 8.2, vmax: 225,
    drive: "Передний", gearbox: "7G-DCT, робот", length: 4419, weight: 1395, fuel: "Бензин"
  },
  {
    id: "cla", name: "CLA", code: "C178", era: "new", body: "ev", amg: false,
    years: "2025 — н.в.", year: 2025, trim: "CLA 250+ с технологией EQ", img: "cla",
    tagline: "Первый автомобиль на платформе MMA.",
    desc: "Новый CLA — электрический четырёхдверный купе на 800-вольтовой архитектуре с собственной операционной системой MB.OS. Один из самых эффективных электромобилей в мире: запас хода до 792 км по WLTP.",
    engine: "Электромотор, батарея 85 кВт·ч", power: 272, torque: 335, accel: 6.7, vmax: 210,
    drive: "Задний", gearbox: "2-ступенчатая", length: 4723, weight: 2055, fuel: "Электро", range: 792
  },
  {
    id: "eqs", name: "EQS", code: "V297", era: "new", body: "ev", amg: false,
    years: "2021 — н.в.", year: 2021, trim: "EQS 450+", img: null,
    tagline: "Электрический флагман с рекордной аэродинамикой.",
    desc: "Первый люксовый электромобиль на специальной платформе EVA2. Коэффициент аэродинамического сопротивления 0,20 — один из лучших среди серийных автомобилей. Доступен с MBUX Hyperscreen шириной 141 см.",
    engine: "Электромотор, батарея 118 кВт·ч", power: 360, torque: 568, accel: 6.2, vmax: 210,
    drive: "Задний", gearbox: "1-ступенчатая", length: 5216, weight: 2480, fuel: "Электро", range: 822
  },
  {
    id: "eqe", name: "EQE", code: "V295", era: "new", body: "ev", amg: false,
    years: "2022 — н.в.", year: 2022, trim: "EQE 350+", img: "eqe",
    tagline: "Электрический бизнес-класс.",
    desc: "Электрический аналог E-Class на платформе EVA2: «кабина-лук», бесшумный салон и запас хода свыше 600 км.",
    engine: "Электромотор, батарея 90 кВт·ч", power: 292, torque: 565, accel: 6.4, vmax: 210,
    drive: "Задний", gearbox: "1-ступенчатая", length: 4946, weight: 2355, fuel: "Электро", range: 654
  },
  {
    id: "g-class", name: "G-Class", code: "W465", era: "new", body: "suv", amg: false,
    years: "2024 — н.в.", year: 2024, trim: "G 500", img: null,
    tagline: "Легенда бездорожья с 1979 года.",
    desc: "«Гелендваген» сохраняет рамную конструкцию и три блокировки дифференциалов. С 2024 года доступен и полностью электрический G 580 с четырьмя моторами, умеющий разворачиваться на месте (G-TURN).",
    engine: "3.0 I6 турбо + EQ Boost", power: 449, torque: 560, accel: 5.4, vmax: 210,
    drive: "Полный, 3 блокировки", gearbox: "9G-TRONIC, автомат", length: 4825, weight: 2560, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "gls", name: "GLS", code: "X167", era: "new", body: "suv", amg: false,
    years: "2019 — н.в.", year: 2019, trim: "GLS 580 4MATIC", img: "gls",
    tagline: "«S-Class среди внедорожников».",
    desc: "Самый большой SUV марки: семь полноразмерных мест, пневмоподвеска AIRMATIC и опциональная E-ACTIVE BODY CONTROL, способная «раскачать» автомобиль, если он застрял.",
    engine: "4.0 V8 битурбо + EQ Boost", power: 503, torque: 700, accel: 5.3, vmax: 250,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 5207, weight: 2565, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "gle", name: "GLE", code: "V167", era: "new", body: "suv", amg: false,
    years: "2019 — н.в.", year: 2019, trim: "GLE 450 4MATIC", img: null,
    tagline: "Наследник первого премиального кроссовера.",
    desc: "Преемник M-Class (1997) — одного из первых премиальных кроссоверов в мире. Опционально третий ряд сидений и подзаряжаемый гибрид с запасом хода на электричестве около 100 км.",
    engine: "3.0 I6 турбо + EQ Boost", power: 381, torque: 500, accel: 5.6, vmax: 250,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 4924, weight: 2210, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "glc", name: "GLC", code: "X254", era: "new", body: "suv", amg: false,
    years: "2022 — н.в.", year: 2022, trim: "GLC 300 4MATIC", img: "glc",
    tagline: "Самый продаваемый Mercedes-Benz в мире.",
    desc: "Среднеразмерный кроссовер на базе C-Class. Функция «прозрачного капота» показывает на экране дорогу под передней частью автомобиля.",
    engine: "2.0 I4 турбо + EQ Boost", power: 258, torque: 400, accel: 6.2, vmax: 240,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 4716, weight: 1885, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "gla", name: "GLA", code: "H247", era: "new", body: "suv", amg: false,
    years: "2020 — н.в.", year: 2020, trim: "GLA 250 4MATIC", img: null,
    tagline: "Компактный городской кроссовер.",
    desc: "Самый компактный SUV в линейке: высокая посадка, полный привод 4MATIC и практичный салон на базе A-Class.",
    engine: "2.0 I4 турбо", power: 224, torque: 350, accel: 6.7, vmax: 240,
    drive: "Полный 4MATIC", gearbox: "8G-DCT, робот", length: 4415, weight: 1600, fuel: "Бензин"
  },
  {
    id: "cle", name: "CLE Coupé", code: "C236", era: "new", body: "coupe", amg: false,
    years: "2023 — н.в.", year: 2023, trim: "CLE 300 4MATIC", img: "cle",
    tagline: "Одно купе вместо двух.",
    desc: "CLE заменил сразу C-Class Coupé и E-Class Coupé. Классический силуэт без центральной стойки, доступен также кабриолет с мягкой крышей.",
    engine: "2.0 I4 турбо + EQ Boost", power: 258, torque: 400, accel: 6.2, vmax: 250,
    drive: "Полный 4MATIC", gearbox: "9G-TRONIC, автомат", length: 4850, weight: 1820, fuel: "Бензин (мягкий гибрид)"
  },
  {
    id: "amg-gt", name: "Mercedes-AMG GT", code: "C192", era: "new", body: "coupe", amg: true,
    years: "2023 — н.в.", year: 2023, trim: "AMG GT 63 4MATIC+", img: null,
    tagline: "Спорткар, собранный вручную в Аффальтербахе.",
    desc: "Второе поколение AMG GT стало 2+2-местным и получило полный привод. Двигатель V8 собирает один мастер по принципу «один человек — один мотор» и ставит на нём свою подпись.",
    engine: "4.0 V8 битурбо", power: 585, torque: 800, accel: 3.2, vmax: 315,
    drive: "Полный 4MATIC+", gearbox: "AMG SPEEDSHIFT MCT 9G", length: 4728, weight: 1970, fuel: "Бензин"
  },
  {
    id: "sl", name: "Mercedes-AMG SL", code: "R232", era: "new", body: "roadster", amg: true,
    years: "2021 — н.в.", year: 2021, trim: "AMG SL 63 4MATIC+", img: null,
    tagline: "Родстер с родословной от 1954 года.",
    desc: "Седьмое поколение легендарного SL впервые полностью разработано AMG. Вернулась мягкая складная крыша, которая открывается за 15 секунд на скорости до 60 км/ч.",
    engine: "4.0 V8 битурбо", power: 585, torque: 800, accel: 3.6, vmax: 315,
    drive: "Полный 4MATIC+", gearbox: "AMG SPEEDSHIFT MCT 9G", length: 4705, weight: 1970, fuel: "Бензин"
  },
  {
    id: "amg-one", name: "Mercedes-AMG ONE", code: "C298", era: "new", body: "hyper", amg: true,
    years: "2022 — 2024", year: 2022, trim: "Лимитированная серия, 275 шт.", img: null,
    tagline: "Технологии Формулы-1 для дорог общего пользования.",
    desc: "Гиперкар с силовой установкой от болида Формулы-1 Mercedes-AMG Petronas: 1,6-литровый V6 и четыре электромотора. Рекорд Нюрбургринга для серийных автомобилей — 6:35.183 (2022).",
    engine: "1.6 V6 турбо + 4 электромотора", power: 1063, torque: null, accel: 2.9, vmax: 352,
    drive: "Полный (электрическая передняя ось)", gearbox: "7-ступенчатая AMG SPEEDSHIFT", length: 4756, weight: 1695, fuel: "Бензин (подзаряжаемый гибрид)"
  },
  {
    id: "v-class", name: "V-Class", code: "W447", era: "new", body: "van", amg: false,
    years: "2014 — н.в.", year: 2014, trim: "V 300 d", img: null,
    tagline: "Представительский минивэн.",
    desc: "До восьми мест, сиденья в формате лаунж и отделка уровня седанов. Популярен как VIP-трансфер и семейный автомобиль.",
    engine: "2.0 I4 турбодизель", power: 237, torque: 500, accel: 7.8, vmax: 220,
    drive: "Задний", gearbox: "9G-TRONIC, автомат", length: 5140, weight: 2200, fuel: "Дизель"
  },

  /* ============ КЛАССИКА ============ */
  {
    id: "patent", name: "Benz Patent-Motorwagen", code: "№ 1", era: "classic", body: "roadster", amg: false,
    years: "1886", year: 1886, trim: "Патент DRP № 37435", img: null,
    tagline: "Первый в мире автомобиль.",
    desc: "29 января 1886 года Карл Бенц получил патент на «транспортное средство с газовым двигателем». В 1888 году Берта Бенц совершила на нём первую в истории дальнюю поездку — 106 км из Мангейма в Пфорцхайм.",
    engine: "0.95 л, 1 цилиндр", power: 0.75, torque: null, accel: null, vmax: 16,
    drive: "Задний (ремень и цепи)", gearbox: "1 ступень", length: 2700, weight: 265, fuel: "Лигроин"
  },
  {
    id: "35hp", name: "Mercedes 35 PS", code: "Simplex", era: "classic", body: "roadster", amg: false,
    years: "1901 — 1902", year: 1901, trim: "35 PS", img: null,
    tagline: "Автомобиль, давший марке имя.",
    desc: "Создан Вильгельмом Майбахом по заказу Эмиля Еллинека и назван в честь его дочери Мерседес. Низкий центр тяжести, сотовый радиатор и стальная рама — считается первым «современным» автомобилем.",
    engine: "5.9 л, I4", power: 35, torque: null, accel: null, vmax: 75,
    drive: "Задний (цепи)", gearbox: "4-ступенчатая механика", length: 3800, weight: 1000, fuel: "Бензин"
  },
  {
    id: "540k", name: "Mercedes-Benz 540 K", code: "W29", era: "classic", body: "roadster", amg: false,
    years: "1936 — 1940", year: 1936, trim: "Special Roadster", img: null,
    tagline: "Икона довоенной роскоши.",
    desc: "Компрессорный рядный «восьмёрка»: нагнетатель включался при полном нажатии на педаль газа. Special Roadster сегодня — один из самых дорогих автомобилей на аукционах.",
    engine: "5.4 л I8 с компрессором", power: 180, torque: null, accel: null, vmax: 170,
    drive: "Задний", gearbox: "5-ступенчатая механика", length: 5250, weight: 2600, fuel: "Бензин"
  },
  {
    id: "w136", name: "Mercedes-Benz 170 V", code: "W136", era: "classic", body: "sedan", amg: false,
    years: "1936 — 1955", year: 1936, trim: "170 V", img: null,
    tagline: "Самый массовый Mercedes довоенной эпохи.",
    desc: "Надёжный и экономичный седан, ставший основой возрождения компании после Второй мировой войны.",
    engine: "1.7 л I4", power: 38, torque: null, accel: null, vmax: 108,
    drive: "Задний", gearbox: "4-ступенчатая механика", length: 4285, weight: 1150, fuel: "Бензин"
  },
  {
    id: "300sl", name: "300 SL «Gullwing»", code: "W198", era: "classic", body: "coupe", amg: false,
    years: "1954 — 1957", year: 1954, trim: "Купе «Крыло чайки»", img: null,
    tagline: "Самый быстрый серийный автомобиль своего времени.",
    desc: "Двери «крыло чайки» были вынужденным решением: пространственная трубчатая рама не позволяла сделать обычные. Первый серийный автомобиль с непосредственным впрыском топлива.",
    engine: "3.0 л I6, непосредственный впрыск", power: 215, torque: 275, accel: 9.3, vmax: 260,
    drive: "Задний", gearbox: "4-ступенчатая механика", length: 4520, weight: 1295, fuel: "Бензин"
  },
  {
    id: "190sl", name: "190 SL", code: "W121", era: "classic", body: "roadster", amg: false,
    years: "1955 — 1963", year: 1955, trim: "Родстер", img: null,
    tagline: "Элегантный младший брат 300 SL.",
    desc: "Более доступный родстер для повседневного использования, разработанный в первую очередь для американского рынка. Выпущено более 25 000 экземпляров.",
    engine: "1.9 л I4", power: 105, torque: 142, accel: 14.5, vmax: 171,
    drive: "Задний", gearbox: "4-ступенчатая механика", length: 4290, weight: 1160, fuel: "Бензин"
  },
  {
    id: "w111", name: "220 SE «Heckflosse»", code: "W111", era: "classic", body: "sedan", amg: false,
    years: "1959 — 1968", year: 1959, trim: "220 SE", img: null,
    tagline: "Первый автомобиль с зонами деформации.",
    desc: "Седан с «плавниками» — первый серийный автомобиль с жёсткой пассажирской капсулой и зонами программируемой деформации, запатентованными инженером Белой Барени.",
    engine: "2.2 л I6, впрыск", power: 120, torque: 190, accel: 14.0, vmax: 172,
    drive: "Задний", gearbox: "4-ступенчатая механика", length: 4875, weight: 1390, fuel: "Бензин"
  },
  {
    id: "600", name: "Mercedes-Benz 600", code: "W100", era: "classic", body: "sedan", amg: false,
    years: "1963 — 1981", year: 1963, trim: "600 / Pullman", img: null,
    tagline: "Лимузин глав государств.",
    desc: "Двери, сиденья, окна и даже крышка багажника работали от гидравлики. За 18 лет выпущено всего 2 677 экземпляров — для королей, президентов и звёзд.",
    engine: "6.3 л V8", power: 250, torque: 500, accel: 9.7, vmax: 205,
    drive: "Задний", gearbox: "4-ступенчатый автомат", length: 5540, weight: 2475, fuel: "Бензин"
  },
  {
    id: "w113", name: "280 SL «Pagode»", code: "W113", era: "classic", body: "roadster", amg: false,
    years: "1963 — 1971", year: 1963, trim: "280 SL", img: null,
    tagline: "«Пагода» — родстер с вогнутой крышей.",
    desc: "Своё прозвище модель получила за съёмный хардтоп с вогнутой крышей, напоминающей восточную пагоду. Первый спортивный автомобиль с зонами безопасной деформации.",
    engine: "2.8 л I6, впрыск", power: 170, torque: 240, accel: 9.3, vmax: 200,
    drive: "Задний", gearbox: "4-ступенчатый автомат", length: 4285, weight: 1360, fuel: "Бензин"
  },
  {
    id: "w115", name: "Strich-Acht /8", code: "W115", era: "classic", body: "sedan", amg: false,
    years: "1968 — 1976", year: 1968, trim: "220 D", img: null,
    tagline: "Неубиваемый «дизельный» Mercedes.",
    desc: "Известен рекордными пробегами: один из экземпляров 240 D проехал более 4,6 млн км. Выпущено почти 2 миллиона автомобилей.",
    engine: "2.2 л I4 дизель", power: 60, torque: 126, accel: 31.0, vmax: 130,
    drive: "Задний", gearbox: "4-ступенчатая механика", length: 4680, weight: 1340, fuel: "Дизель"
  },
  {
    id: "w123", name: "W123", code: "W123", era: "classic", body: "sedan", amg: false,
    years: "1976 — 1986", year: 1976, trim: "280 E", img: null,
    tagline: "Эталон надёжности.",
    desc: "Предшественник E-Class, выпущенный тиражом 2,7 млн экземпляров. До сих пор работает такси в разных уголках мира.",
    engine: "2.8 л I6, впрыск", power: 185, torque: 238, accel: 10.0, vmax: 200,
    drive: "Задний", gearbox: "4-ступенчатый автомат", length: 4725, weight: 1440, fuel: "Бензин"
  },
  {
    id: "w126", name: "S-Class", code: "W126", era: "classic", body: "sedan", amg: false,
    years: "1979 — 1991", year: 1979, trim: "560 SEL", img: null,
    tagline: "Первая серийная подушка безопасности.",
    desc: "Самый долго выпускавшийся S-Class (12 лет). В 1981 году получил первую в мире серийную подушку безопасности водителя и преднатяжители ремней.",
    engine: "5.6 л V8", power: 300, torque: 455, accel: 7.2, vmax: 250,
    drive: "Задний", gearbox: "4-ступенчатый автомат", length: 5160, weight: 1760, fuel: "Бензин"
  },
  {
    id: "w201", name: "190 E 2.3-16", code: "W201", era: "classic", body: "sedan", amg: false,
    years: "1982 — 1993", year: 1982, trim: "190 E 2.3-16 Cosworth", img: null,
    tagline: "«Бэби-бенц», ставший легендой DTM.",
    desc: "Предок C-Class с многорычажной задней подвеской. Версия с головкой блока Cosworth установила три мировых рекорда выносливости на трассе Нардо — 50 000 км со средней скоростью 247 км/ч.",
    engine: "2.3 л I4 16V", power: 185, torque: 235, accel: 7.5, vmax: 230,
    drive: "Задний", gearbox: "5-ступенчатая механика", length: 4430, weight: 1230, fuel: "Бензин"
  },
  {
    id: "w124", name: "500 E", code: "W124", era: "classic", body: "sedan", amg: true,
    years: "1990 — 1995", year: 1990, trim: "500 E (собран совместно с Porsche)", img: null,
    tagline: "«Волчок» — бизнес-седан с V8 от SL.",
    desc: "Кузов W124 был слишком узким для V8, поэтому сборку вели вместе с Porsche в Цуффенхаузене. Первый автомобиль, официально названный E-Class (с 1993 года).",
    engine: "5.0 л V8", power: 326, torque: 480, accel: 6.1, vmax: 250,
    drive: "Задний", gearbox: "4-ступенчатый автомат", length: 4740, weight: 1700, fuel: "Бензин"
  },
  {
    id: "w140", name: "S 600", code: "W140", era: "classic", body: "sedan", amg: false,
    years: "1991 — 1998", year: 1991, trim: "S 600 L", img: null,
    tagline: "«Кабан» — символ эпохи.",
    desc: "Двойное остекление, доводчики дверей, первые серийные ксеноновые фары и система ESP (1995). Первый Mercedes с двигателем V12.",
    engine: "6.0 л V12", power: 394, torque: 570, accel: 6.6, vmax: 250,
    drive: "Задний", gearbox: "5-ступенчатый автомат", length: 5213, weight: 2240, fuel: "Бензин"
  },
  {
    id: "clk-gtr", name: "CLK GTR", code: "C297", era: "classic", body: "hyper", amg: true,
    years: "1998 — 1999", year: 1998, trim: "Дорожная версия, 26 шт.", img: null,
    tagline: "Гоночный прототип с номерами.",
    desc: "Создан для чемпионата FIA GT — по правилам омологации нужно было выпустить дорожные версии. Выиграл чемпионат 1997 года. Самый дорогой серийный автомобиль своего времени.",
    engine: "6.9 л V12", power: 612, torque: 775, accel: 3.8, vmax: 320,
    drive: "Задний", gearbox: "6-ступенчатая секвентальная", length: 4855, weight: 1545, fuel: "Бензин"
  },
  {
    id: "slr", name: "SLR McLaren", code: "C199", era: "classic", body: "hyper", amg: true,
    years: "2003 — 2010", year: 2003, trim: "Coupé", img: null,
    tagline: "Союз Mercedes-Benz и McLaren.",
    desc: "Карбоновый монокок, двери-«бабочки» и аэродинамический тормоз. Вдохновлён гоночным 300 SLR 1955 года. Собирался в Уокинге, Англия.",
    engine: "5.4 л V8 с компрессором", power: 626, torque: 780, accel: 3.8, vmax: 334,
    drive: "Задний", gearbox: "5-ступенчатый автомат", length: 4656, weight: 1768, fuel: "Бензин"
  },
  {
    id: "sls", name: "SLS AMG", code: "C197", era: "classic", body: "coupe", amg: true,
    years: "2010 — 2014", year: 2010, trim: "SLS AMG Coupé", img: null,
    tagline: "Возвращение «крыла чайки».",
    desc: "Первый автомобиль, полностью разработанный AMG. Двери «крыло чайки» — дань уважения 300 SL. Электрическая версия SLS AMG Electric Drive (2013) выдавала 751 л.с.",
    engine: "6.2 л V8", power: 571, torque: 650, accel: 3.8, vmax: 317,
    drive: "Задний", gearbox: "7-ступенчатая AMG SPEEDSHIFT DCT", length: 4638, weight: 1620, fuel: "Бензин"
  }
];

/* Ключевые этапы истории */
window.TIMELINE = [
  { y: 1886, t: "Первый автомобиль", d: "Карл Бенц патентует Patent-Motorwagen. В том же году Готлиб Даймлер ставит двигатель на карету." },
  { y: 1888, t: "Поездка Берты Бенц", d: "106 км из Мангейма в Пфорцхайм — первый в истории автопробег и лучшая реклама изобретения." },
  { y: 1901, t: "Рождение имени", d: "Mercedes 35 PS. Имя дочери Эмиля Еллинека становится названием марки." },
  { y: 1909, t: "Трёхлучевая звезда", d: "DMG регистрирует звезду — символ моторизации на земле, на воде и в воздухе." },
  { y: 1926, t: "Daimler-Benz", d: "Слияние Daimler-Motoren-Gesellschaft и Benz & Cie. Появляется марка Mercedes-Benz." },
  { y: 1934, t: "«Серебряные стрелы»", d: "Гоночный W 25 доминирует на трассах Европы и задаёт традицию серебристого цвета." },
  { y: 1936, t: "Первый дизельный легковой", d: "260 D — первый серийный легковой автомобиль с дизельным двигателем." },
  { y: 1954, t: "300 SL", d: "«Крыло чайки» — первый серийный автомобиль с непосредственным впрыском." },
  { y: 1959, t: "Зоны деформации", d: "W111 — первый серийный автомобиль с жёсткой капсулой и зонами деформации." },
  { y: 1978, t: "ABS", d: "Антиблокировочная система тормозов впервые появляется в серийном S-Class W116." },
  { y: 1981, t: "Подушка безопасности", d: "W126 — первая в мире серийная подушка безопасности водителя." },
  { y: 1995, t: "ESP", d: "Система курсовой устойчивости дебютирует на купе S 600 (C140)." },
  { y: 2002, t: "PRE-SAFE", d: "Автомобиль готовит пассажиров к столкновению до того, как оно произошло." },
  { y: 2014, t: "Эра Формулы-1", d: "Mercedes-AMG Petronas выигрывает 8 кубков конструкторов подряд (2014–2021)." },
  { y: 2021, t: "EQS и DRIVE PILOT", d: "Первый люксовый электромобиль и первая в мире сертифицированная система автопилота 3-го уровня." },
  { y: 2025, t: "Новый CLA и MB.OS", d: "Первый автомобиль на платформе MMA с собственной операционной системой Mercedes-Benz." }
];

/* Технологии */
window.TECH = [
  { k: "ABS", y: "1978", d: "Антиблокировочная система тормозов в серийном производстве." },
  { k: "Airbag", y: "1981", d: "Подушка безопасности водителя и преднатяжители ремней." },
  { k: "ESP®", y: "1995", d: "Электронная система курсовой устойчивости." },
  { k: "PRE-SAFE®", y: "2002", d: "Превентивная защита пассажиров перед столкновением." },
  { k: "MBUX", y: "2018", d: "Мультимедиа с ИИ и голосовым ассистентом «Hey Mercedes»." },
  { k: "DRIVE PILOT", y: "2021", d: "Автономное вождение 3-го уровня — водитель может отвлечься." }
];

/* Источники фотографий (Wikimedia Commons) */
window.CREDITS = {
  "a-class": "2018_Mercedes-Benz_A200_AMG_Line_Premium_Automatic_1.3_Front.jpg",
  "c-class": "Mercedes-Benz_W206_IMG_5796.jpg",
  "e-class": "Mercedes-Benz_W214_1X7A1841.jpg",
  "cla": "Mercedes-Benz_C118_IMG_2673.jpg",
  "glc": "Mercedes-Benz_X254_1X7A6343.jpg",
  "gls": "Mercedes-Benz_X167_IMG_5259.jpg",
  "eqe": "Mercedes-Benz_V295_350+_Classic-Days_2022_DSC_0018.jpg",
  "cle": "Mercedes-Benz_CLE_200_Coupé_AMG_Line_(C_236)_–_f_21012024.jpg"
};
