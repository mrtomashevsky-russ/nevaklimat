export type IconName =
  | "clean"
  | "shield"
  | "guard"
  | "ruble"
  | "bolt"
  | "doc"
  | "broom"
  | "quiet"
  | "phone"
  | "tg"
  | "chat"
  | "check"
  | "arrow"
  | "star"
  | "close"
  | "home"
  | "bed"
  | "sofa"
  | "rooms"
  | "clock"
  | "gift"
  | "spark"
  | "map";

export type VariantId = "v1" | "v2" | "v3";
export type SectionKey = "trust" | "brands" | "steps" | "calc" | "pricing" | "advantages" | "reviews" | "faq";

export type Recommendation = {
  model: string;
  pkg: string;
  price: number;
};

export const BRAND = {
  name: "НеваКлимат",
  city: "Санкт-Петербург",
  phone: process.env.NEXT_PUBLIC_BRAND_PHONE || "+7 (812) 000-00-00",
  phoneHref: process.env.NEXT_PUBLIC_BRAND_PHONE_HREF || "tel:+78120000000",
  tg: process.env.NEXT_PUBLIC_BRAND_TG || "https://t.me/",
  max: process.env.NEXT_PUBLIC_BRAND_MAX || "https://max.ru/",
  tagline: "Кондиционеры под ключ в Петербурге",
  heroImage: process.env.NEXT_PUBLIC_HERO_IMAGE || "/images/hero-technician-installation.jpg",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
};

export const GIFTS: Array<{ icon: IconName; title: string; note: string; value: string }> = [
  { icon: "clean", title: "Чистка через год", note: "Сезонное обслуживание — бесплатно", value: "2 500 ₽" },
  { icon: "shield", title: "Защитный козырёк", note: "От снега и сосулек на внешний блок", value: "1 900 ₽" },
  { icon: "guard", title: "+1 год гарантии", note: "Итого 3 года на монтаж", value: "выгода" }
];

export const TRUST = [
  { n: "4 200+", l: "установок с 2014 года" },
  { n: "4.9", l: "рейтинг на картах" },
  { n: "3 года", l: "гарантия на монтаж" },
  { n: "1 день", l: "от заявки до прохлады" }
];

export const BRANDS = [
  "Mitsubishi Electric",
  "Daikin",
  "Haier",
  "Hisense",
  "Royal Clima",
  "Ballu",
  "Electrolux",
  "TCL"
];

export const PACKAGES = [
  {
    id: "start",
    name: "Старт",
    tag: "до 18 м²",
    forText: "Спальня, детская, студия",
    power: "2.0 кВт · «07»",
    price: 36900,
    old: null,
    badge: null,
    includes: ["Кондиционер", "Монтаж до 3 м трассы", "Расходники и пусконаладка", "Гарантия 3 года"]
  },
  {
    id: "opt",
    name: "Оптимум",
    tag: "до 27 м²",
    forText: "Комната, кухня-гостиная",
    power: "2.6 кВт · «09»",
    price: 45900,
    old: null,
    badge: "Хит продаж",
    includes: ["Кондиционер", "Монтаж до 3 м трассы", "Расходники и пусконаладка", "Гарантия 3 года", "Чистка в подарок"]
  },
  {
    id: "comfort",
    name: "Комфорт",
    tag: "до 35 м²",
    forText: "Зал, большая гостиная",
    power: "3.5 кВт · «12»",
    price: 61900,
    old: null,
    badge: "Тихий",
    includes: ["Кондиционер", "Монтаж до 3 м трассы", "Тихий режим для сна", "Подходит для большой комнаты", "Гарантия 3 года"]
  }
];

export const STEPS = [
  { n: 1, title: "Заявка", text: "Оставляете телефон — перезваниваем за 15 минут, без воды и навязывания." },
  { n: 2, title: "Замер и цена", text: "Бесплатный выезд. Называем точную цену под ключ — фиксируем, без доплат на месте." },
  { n: 3, title: "Монтаж за 1 день", text: "Аккуратно, с пылесосом и плёнкой. Убираем мусор за собой." },
  { n: 4, title: "Гарантия и подарки", text: "Договор, чек, гарантия 3 года и чистка через год в подарок." }
];

export const ADVANTAGES: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: "ruble", title: "Честная цена под ключ", text: "Цена с замера = цена в чеке. Без «вылезших» доплат за трассу и высоту." },
  { icon: "bolt", title: "Подберём кондиционер сегодня и установим завтра", text: "Свои бригады, не посредники. Не ждёте две недели в жару." },
  { icon: "shield", title: "Гарантия 3 года", text: "Отвечаем и за технику, и за монтаж. Приедем по гарантии бесплатно." },
  { icon: "doc", title: "Официально", text: "Договор и чек. Платите после проверки работы кондиционера." },
  { icon: "broom", title: "Чисто после нас", text: "Плёнка, пылесос, уборка. Ремонт остаётся как был." },
  { icon: "quiet", title: "Тишина в спальне", text: "Подбираем тихие модели и ставим так, чтобы не гудело и не капало." }
];

export const REVIEWS = [
  { name: "Анна, Приморский р-н", text: "Замерщик приехал в день заявки, на следующий уже поставили. Цена не изменилась ни на рубль. Чисто, аккуратно — рекомендую.", rate: 5, tag: "2-комнатная" },
  { name: "Дмитрий, Купчино", text: "Долго выбирал, везде разные цены. Тут сразу сказали итог под ключ. В спальне вообще не слышно, как работает.", rate: 5, tag: "Спальня" },
  { name: "Марина, Васильевский о-в", text: "Боялась, что разведут на доплаты — ничего подобного. Поставили козырёк в подарок, объяснили как ухаживать.", rate: 5, tag: "Студия" },
  { name: "Сергей, Мурино", text: "Высокий этаж, думал будет проблема. Сделали за день, всё герметично, дренаж не течёт. Договор и чек на руках.", rate: 5, tag: "Кухня-гостиная" }
];

export const FAQS = [
  { q: "Сколько стоит кондиционер с установкой под ключ?", a: "Готовые пакеты — 36 900 ₽ за всё: техника, монтаж до 3 м трассы, расходники и пусконаладка. Точную цену называем на бесплатном замере и фиксируем — на месте доплат не будет." },
  { q: "Как быстро приедете на замер?", a: "Обычно в день обращения или на следующий. Монтаж — чаще всего на следующий день после замера. В пик жары сроки чуть больше, скажем честно при звонке." },
  { q: "Можно ставить кондиционер зимой?", a: "Да. Монтаж выполняем круглый год. Для проверки на холоде используем зимний комплект — расскажем на замере, нужен ли он в вашем случае." },
  { q: "Какая гарантия?", a: "3 года на монтаж и официальная гарантия производителя на технику. Если что-то пойдёт не так — приедем и устраним бесплатно." },
  { q: "Будет ли шумно в спальне?", a: "Подбираем тихие модели и устанавливаем внутренний блок так, чтобы не было гула и вибраций. В пакете «Комфорт» — специальный ночной режим." },
  { q: "Вы работаете официально?", a: "Да: договор, чек, гарантийный талон. Оплата — после того, как вы убедитесь, что кондиционер работает." }
];

export const QUIZ: Array<{
  key: "room" | "area" | "priority" | "when";
  q: string;
  opts: Array<{ v: string; icon?: IconName }>;
}> = [
  {
    key: "room",
    q: "Где будет работать кондиционер?",
    opts: [
      { v: "Студия / квартира целиком", icon: "home" },
      { v: "Спальня или детская", icon: "bed" },
      { v: "Кухня-гостиная, зал", icon: "sofa" },
      { v: "Несколько комнат", icon: "rooms" }
    ]
  },
  {
    key: "area",
    q: "Какая примерно площадь помещения?",
    opts: [{ v: "до 18 м²" }, { v: "18–26 м²" }, { v: "26–35 м²" }, { v: "больше 35 м²" }]
  },
  {
    key: "priority",
    q: "Что для вас важнее всего?",
    opts: [
      { v: "Низкая цена", icon: "ruble" },
      { v: "Тишина", icon: "quiet" },
      { v: "Известный бренд", icon: "star" },
      { v: "Экономия электричества", icon: "bolt" }
    ]
  },
  {
    key: "when",
    q: "Когда планируете установку?",
    opts: [{ v: "На этой неделе" }, { v: "В этом месяце" }, { v: "Просто узнаю цену" }]
  }
];

export const VARIANTS: Record<
  VariantId,
  {
    id: VariantId;
    label: string;
    note: string;
    heroStyle: "offer" | "quiz" | "speed";
    theme: "navy" | "teal" | "ink";
    eyebrow: string;
    h1: [string, string];
    sub: string;
    primaryCta: string;
    showTimer: boolean;
    order: SectionKey[];
  }
> = {
  v1: {
    id: "v1",
    label: "Акция",
    note: "Оффер на цену + таймер",
    heroStyle: "offer",
    theme: "navy",
    eyebrow: "Кондиционеры с установкой в Санкт-Петербурге",
    h1: ["Подберём кондиционер сегодня", "и установим завтра"],
    sub: "Техника + монтаж за 1 день. Честная цена с замера — без доплат на месте. Гарантия 3 года.",
    primaryCta: "Получить цену и подарок",
    showTimer: true,
    order: ["trust", "brands", "steps", "calc", "pricing", "advantages", "reviews", "faq"]
  },
  v2: {
    id: "v2",
    label: "Квиз-подбор",
    note: "Подбор за 1 минуту в центре",
    heroStyle: "quiz",
    theme: "teal",
    eyebrow: "Поможем выбрать без переплат",
    h1: ["Подберём кондиционер", "за 1 минуту"],
    sub: "Ответьте на 4 вопроса — покажем модель и точную цену под ключ под вашу комнату. Бесплатно и без звонков-уговоров.",
    primaryCta: "Подобрать за 1 минуту",
    showTimer: false,
    order: ["advantages", "calc", "brands", "pricing", "steps", "reviews", "faq"]
  },
  v3: {
    id: "v3",
    label: "Скорость",
    note: "Подберём сегодня — установим завтра",
    heroStyle: "speed",
    theme: "ink",
    eyebrow: "Свои бригады в Петербурге · работаем официально",
    h1: ["Подберём кондиционер сегодня", "и установим завтра"],
    sub: "Поставим кондиционер за 1 день, чисто и по фиксированной цене. Договор, чек и гарантия 3 года.",
    primaryCta: "Записаться на замер",
    showTimer: false,
    order: ["trust", "steps", "pricing", "brands", "advantages", "reviews", "faq"]
  }
};

export function recommend(area: number): Recommendation {
  if (area <= 18) return { model: "Сплит «07» · 2.0 кВт", pkg: "Старт", price: 36900 };
  if (area <= 27) return { model: "Сплит «09» · 2.6 кВт", pkg: "Оптимум", price: 45900 };
  if (area <= 35) return { model: "Сплит «12» · 3.5 кВт", pkg: "Комфорт", price: 61900 };
  if (area <= 50) return { model: "Сплит «18» · 5.0 кВт", pkg: "Макси", price: 64900 };
  return { model: "Сплит «24» · 7.0 кВт", pkg: "Мульти-сплит", price: 79900 };
}

export function areaFromQuiz(label?: string): number {
  return {
    "до 18 м²": 16,
    "18–26 м²": 23,
    "26–35 м²": 31,
    "больше 35 м²": 42
  }[label || ""] || 23;
}

export function getVariant(id?: string | string[]): VariantId {
  const raw = Array.isArray(id) ? id[0] : id;
  if (raw === "v1" || raw === "v2" || raw === "v3") return raw;
  const envVariant = process.env.NEXT_PUBLIC_DEFAULT_VARIANT;
  if (envVariant === "v1" || envVariant === "v2" || envVariant === "v3") return envVariant;
  return "v1";
}
