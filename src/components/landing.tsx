"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  ADVANTAGES,
  BRAND,
  BRANDS,
  FAQS,
  GIFTS,
  PACKAGES,
  QUIZ,
  REVIEWS,
  STEPS,
  TRUST,
  VARIANTS,
  recommend
} from "@/config/site";
import type { Recommendation, SectionKey, VariantId } from "@/config/site";
import { money } from "@/lib/money";
import { captureUtmFromLocation } from "@/lib/utm";
import { Btn, Icon, Section, Stars, Toast } from "@/components/ui";
import { InlineLead, useLeadSender } from "@/components/lead-form";
import { CallbackModal, FloatingDock, QuickCalcModal, QuizModal } from "@/components/modals";
import type { QuickLeadPreset } from "@/components/modals";

type LeadPayload = {
  phone: string;
  source: string;
  payload?: Record<string, unknown>;
  rec?: Recommendation;
  website?: string;
  startedAt?: number;
};

export function LandingApp({ variantId }: { variantId: VariantId }) {
  const [quick, setQuick] = useState(false);
  const [quickPreset, setQuickPreset] = useState<QuickLeadPreset | null>(null);
  const [callback, setCallback] = useState(false);
  const [quiz, setQuiz] = useState(false);
  const [toast, setToast] = useState("");
  const { send } = useLeadSender(setToast);
  const variant = VARIANTS[variantId];

  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  const onLead = useCallback(
    async (input: LeadPayload) => {
      await send(input);
    },
    [send]
  );

  function openQuick(preset?: QuickLeadPreset) {
    setQuickPreset(preset || null);
    setQuick(true);
  }

  function openQuiz() {
    if (variant.heroStyle === "quiz") {
      window.location.href = "/quiz";
    } else {
      setQuiz(true);
    }
  }

  const sections: Record<SectionKey, ReactElement> = {
    trust: <TrustBar key="trust" />,
    brands: <Brands key="brands" />,
    steps: <Steps key="steps" openCallback={() => setCallback(true)} />,
    calc: <Calculator key="calc" openQuick={openQuick} />,
    pricing: <Pricing key="pricing" openQuick={openQuick} />,
    advantages: <Advantages key="advantages" />,
    reviews: <Reviews key="reviews" />,
    faq: <FAQ key="faq" />
  };

  return (
    <div className="app" data-hero={variant.heroStyle} data-screen-label={`Лендинг · ${variant.label}`}>
      <Header onCallback={() => setCallback(true)} />
      <Hero
        v={variant}
        onLead={onLead}
        openQuiz={openQuiz}
        openQuick={() => openQuick({ source: "Быстрый расчёт" })}
        openCallback={() => setCallback(true)}
      />
      {variant.order.map((key) => sections[key])}
      <FinalCTA onLead={onLead} openQuick={() => openQuick({ source: "Финальный блок · Быстрый расчёт" })} />

      {variant.heroStyle === "quiz" && <FloatingDock onCallback={() => setCallback(true)} />}

      <QuizModal open={quiz} onClose={() => setQuiz(false)} onLead={onLead} />
      <QuickCalcModal open={quick} onClose={() => setQuick(false)} onLead={onLead} preset={quickPreset} />
      <CallbackModal open={callback} onClose={() => setCallback(false)} onLead={onLead} />
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}

function Header({ onCallback }: { onCallback: () => void }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`hdr ${solid ? "hdr--solid" : ""}`}>
      <div className="wrap hdr__in">
        <a className="logo" href="#top" aria-label="НеваКлимат, наверх">
          <span className="logo__mark">
            <Icon name="spark" size={20} stroke={2.4} />
          </span>
          <span className="logo__txt">{BRAND.name}</span>
        </a>
        <div className="hdr__mid">
          <span className="hdr__city">
            <Icon name="map" size={15} /> {BRAND.city}
          </span>
        </div>
        <div className="hdr__right">
          <a className="hdr__phone" href={BRAND.phoneHref}>
            {BRAND.phone}
          </a>
          <div className="hdr__social">
            <a className="hdr__soc hdr__soc--call" href={BRAND.phoneHref} title="Позвонить" aria-label="Позвонить">
              <Icon name="phone" size={18} />
            </a>
            <a className="hdr__soc hdr__soc--tg" href={BRAND.tg} target="_blank" rel="noreferrer" title="Telegram" aria-label="Telegram">
              <Icon name="tg" size={18} />
            </a>
            <a className="hdr__soc hdr__soc--max" href={BRAND.max} target="_blank" rel="noreferrer" title="MAX" aria-label="MAX">
              <Icon name="chat" size={18} />
            </a>
          </div>
          <Btn variant="cta" size="sm" onClick={onCallback} icon="phone">
            Заказать звонок
          </Btn>
        </div>
      </div>
    </header>
  );
}

function Timer() {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const key = "nk_deadline";
    let deadline = Number(localStorage.getItem(key));
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + 1000 * 60 * 60 * 26 + 1000 * 60 * 14;
      localStorage.setItem(key, String(deadline));
    }

    const tick = () => setTimeLeft(Math.max(0, deadline - Date.now()));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const h = Math.floor(timeLeft / 3.6e6);
  const m = Math.floor((timeLeft % 3.6e6) / 6e4);
  const s = Math.floor((timeLeft % 6e4) / 1000);
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="timer">
      <span className="timer__lbl">
        <Icon name="spark" size={15} /> До конца акции:
      </span>
      <span className="timer__clock">
        <b>{pad(h)}</b>
        <i>:</i>
        <b>{pad(m)}</b>
        <i>:</i>
        <b>{pad(s)}</b>
      </span>
    </div>
  );
}

function GiftsStrip({ compact }: { compact?: boolean }) {
  return (
    <div className={`gifts ${compact ? "gifts--compact" : ""}`}>
      {GIFTS.map((gift) => (
        <div className="gift" key={gift.title}>
          <span className="gift__ic">
            <Icon name={gift.icon} size={20} />
          </span>
          <div className="gift__tx">
            <b>{gift.title}</b>
            <span>{gift.note}</span>
          </div>
          <span className="gift__val">{gift.value}</span>
        </div>
      ))}
    </div>
  );
}

function Hero({
  v,
  onLead,
  openQuiz,
  openQuick
}: {
  v: (typeof VARIANTS)[VariantId];
  onLead: (input: LeadPayload) => Promise<void>;
  openQuiz: () => void;
  openQuick: () => void;
  openCallback: () => void;
}) {
  const isQuiz = v.heroStyle === "quiz";
  return (
    <section className="hero" id="top">
      <div className="hero__bg" />
      <div className="wrap hero__in">
        <div className="hero__col">
          <div className="eyebrow eyebrow--hero">{v.eyebrow}</div>
          <h1 className="hero__h1">
            {v.h1[0]}
            <br />
            <span className="accent">{v.h1[1]}</span>
          </h1>
          <p className="hero__sub">{v.sub}</p>

          {v.showTimer && <Timer />}

          {isQuiz ? (
            <div className="hero__quizcta">
              <Btn variant="cta" size="lg" onClick={openQuiz} icon="arrow">
                {v.primaryCta}
              </Btn>
              <button className="linkbtn linkbtn--lg" type="button" onClick={openQuick}>
                или быстрый расчёт по площади →
              </button>
            </div>
          ) : (
            <InlineLead
              onLead={onLead}
              source={`Hero · ${v.label}`}
              cta={v.primaryCta}
              secondary="Быстрый расчёт за 30 сек →"
              onSecondary={openQuick}
            />
          )}

          <div className="hero__trust">
            {TRUST.slice(0, 3).map((item) => (
              <div className="hero__trustitem" key={item.l}>
                <b>{item.n}</b>
                <span>{item.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__col hero__col--side">{isQuiz ? <HeroQuizCard openQuiz={openQuiz} /> : <HeroVisual />}</div>
      </div>
      {!isQuiz && (
        <div className="hero__gifts">
          <div className="wrap">
            <GiftsStrip />
          </div>
        </div>
      )}
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="hv">
      <div className="hv__photowrap">
        <img className="hv__photo" src={BRAND.heroImage} alt="Монтаж кондиционера в квартире" fetchPriority="high" decoding="async" />
      </div>
      <div className="hv__reviews">
        <Stars n={5} />
        <span>
          <b>4.9</b> · 600+ отзывов клиентов в Петербурге
        </span>
      </div>
    </div>
  );
}

function HeroQuizCard({ openQuiz }: { openQuiz: () => void }) {
  return (
    <button className="qcard" type="button" onClick={openQuiz}>
      <div className="qcard__top">
        <Icon name="spark" size={18} /> Подбор за 1 минуту
      </div>
      <div className="qcard__steps">
        {QUIZ.map((q, index) => (
          <div className="qcard__step" key={q.key}>
            <span>{index + 1}</span>
            {q.q.replace("?", "")}
          </div>
        ))}
      </div>
      <span className="btn btn--cta btn--lg btn--full">
        Начать подбор <Icon name="arrow" size={20} />
      </span>
      <div className="qcard__note">
        <Icon name="gift" size={14} /> В конце — цена под ключ и подарок
      </div>
    </button>
  );
}

function TrustBar() {
  return (
    <div className="trustbar">
      <div className="wrap trustbar__in">
        {TRUST.map((item) => (
          <div className="trustbar__item" key={item.l}>
            <b>{item.n}</b>
            <span>{item.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Brands() {
  return (
    <Section id="brands" narrow eyebrow="Официальный монтаж" title="Ставим технику любых брендов">
      <p className="sec__sub sec__sub--up">Поможем выбрать под бюджет и задачу — от бюджетных до премиум. Только новое, с гарантией производителя.</p>
      <div className="brands">
        {BRANDS.map((brand) => (
          <div className="brand" key={brand}>
            {brand}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Steps({ openCallback }: { openCallback: () => void }) {
  return (
    <Section id="steps" eyebrow="Как это работает" title="4 шага до прохлады" sub="Без сюрпризов и доплат. Платите после проверки работы кондиционера.">
      <div className="steps">
        {STEPS.map((step) => (
          <div className="step" key={step.n}>
            <div className="step__n">{step.n}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
      <div className="sec__cta">
        <Btn variant="cta" size="lg" onClick={openCallback} icon="phone">
          Начать с бесплатного замера
        </Btn>
      </div>
    </Section>
  );
}

function Calculator({ openQuick }: { openQuick: (preset?: QuickLeadPreset) => void }) {
  const [area, setArea] = useState(25);
  const rec = recommend(area);

  return (
    <Section id="calc" alt eyebrow="Калькулятор" title="Сколько будет стоить у вас?" sub="Двигайте ползунок — покажем подходящую модель и цену под ключ.">
      <div className="calc">
        <div className="calc__left">
          <div className="calc__areaval">
            {area}
            <span> м²</span>
          </div>
          <input className="range range--big" type="range" min="10" max="60" value={area} onChange={(event) => setArea(Number(event.target.value))} />
          <div className="qcalc__scale">
            <span>10 м²</span>
            <span>35 м²</span>
            <span>60 м²</span>
          </div>
          <div className="calc__hint">
            <Icon name="bolt" size={15} /> Чем больше площадь и солнце — тем мощнее нужен блок. Точно подберём на замере.
          </div>
        </div>
        <div className="calc__right">
          <div className="calc__reclbl">Рекомендуем</div>
          <div className="calc__model">{rec.model}</div>
          <div className="calc__pkg">Пакет «{rec.pkg}»</div>
          <div className="calc__price">
            от {money(rec.price)}
            <span> под ключ</span>
          </div>
          <Btn variant="cta" size="lg" full onClick={() => openQuick({ source: "Калькулятор", payload: { area }, rec, area })} icon="arrow">
            Узнать точную цену
          </Btn>
          <div className="policy">Цена с замера фиксируется — без доплат на месте.</div>
        </div>
      </div>
    </Section>
  );
}

function Pricing({ openQuick }: { openQuick: (preset?: QuickLeadPreset) => void }) {
  return (
    <Section id="pricing" eyebrow="Цены под ключ" title="Готовые пакеты под ключ" sub="Техника + монтаж + расходники + гарантия. Всё включено, без скрытых доплат.">
      <div className="prices">
        {PACKAGES.map((pkg) => (
          <div className={`price ${pkg.badge === "Хит продаж" ? "price--hot" : ""}`} key={pkg.id}>
            {pkg.badge && <div className="price__badge">{pkg.badge}</div>}
            <h3 className="price__name">{pkg.name}</h3>
            <div className="price__tag">
              {pkg.tag} · {pkg.forText}
            </div>
            <div className="price__power">{pkg.power}</div>
            <div className="price__cost">
              <span className="price__old">{money(pkg.old)}</span>
              <span className="price__now">от {money(pkg.price)}</span>
            </div>
            <ul className="price__list">
              {pkg.includes.map((item) => (
                <li key={item}>
                  <Icon name="check" size={16} /> {item}
                </li>
              ))}
            </ul>
            <Btn
              variant={pkg.badge === "Хит продаж" ? "cta" : "soft"}
              size="lg"
              full
              onClick={() =>
                openQuick({
                  source: `Пакет цен · ${pkg.name}`,
                  payload: { packageId: pkg.id, packageName: pkg.name },
                  rec: { model: pkg.power, pkg: pkg.name, price: pkg.price }
                })
              }
              icon="arrow"
            >
              Выбрать пакет
            </Btn>
          </div>
        ))}
      </div>
      <div className="prices__note">
        <Icon name="gift" size={16} /> При заказе на этой неделе — чистка через год, защитный козырёк и +1 год гарантии в подарок.
      </div>
    </Section>
  );
}

function Advantages() {
  return (
    <Section id="adv" alt eyebrow="Почему нам доверяют" title="Кондиционер без головной боли">
      <div className="adv">
        {ADVANTAGES.map((advantage) => (
          <div className="advcard" key={advantage.title}>
            <span className="advcard__ic">
              <Icon name={advantage.icon} size={24} />
            </span>
            <h3>{advantage.title}</h3>
            <p>{advantage.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Reviews() {
  return (
    <Section id="reviews" eyebrow="Отзывы клиентов" title="Что говорят о нас в Петербурге">
      <div className="reviews">
        {REVIEWS.map((review) => (
          <div className="review" key={review.name}>
            <div className="review__top">
              <Stars n={review.rate} />
              <span className="review__tag">{review.tag}</span>
            </div>
            <p className="review__text">«{review.text}»</p>
            <div className="review__name">{review.name}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" narrow alt eyebrow="Вопросы и ответы" title="Коротко о главном">
      <div className="faq">
        {FAQS.map((faq, index) => (
          <div className={`faq__item ${open === index ? "is-open" : ""}`} key={faq.q}>
            <button className="faq__q" type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
              <span>{faq.q}</span>
              <Icon name="arrow" size={18} className="faq__chev" />
            </button>
            <div className="faq__a">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA({ onLead, openQuick }: { onLead: (input: LeadPayload) => Promise<void>; openQuick: () => void }) {
  return (
    <section className="final" id="final">
      <div className="wrap final__in">
        <div className="final__head">
          <div className="eyebrow eyebrow--light">Готовы к прохладе?</div>
          <h2>Оставьте телефон — назовём цену под ключ и подарим обслуживание</h2>
          <p>Перезвоним за 15 минут. Замер бесплатный, цену фиксируем — без доплат на месте.</p>
          <GiftsStrip compact />
        </div>
        <div className="final__form">
          <InlineLead onLead={onLead} source="Финальный блок" cta="Получить цену" secondary="Быстрый расчёт →" onSecondary={openQuick} light />
        </div>
      </div>
    </section>
  );
}
