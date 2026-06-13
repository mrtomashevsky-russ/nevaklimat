"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BRAND, QUIZ, areaFromQuiz, recommend } from "@/config/site";
import type { Recommendation } from "@/config/site";
import { money } from "@/lib/money";
import { phoneValid } from "@/lib/phone";
import { Btn, Icon, PhoneField, SuccessBody } from "@/components/ui";

type LeadHandler = (input: {
  phone: string;
  source: string;
  payload?: Record<string, unknown>;
  rec?: Recommendation;
  website?: string;
  startedAt?: number;
}) => Promise<void>;

export type QuickLeadPreset = {
  source?: string;
  payload?: Record<string, unknown>;
  rec?: Recommendation;
  area?: number;
};

function useAntiSpam(open: boolean) {
  const [website, setWebsite] = useState("");
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (open) {
      startedAt.current = Date.now();
      setWebsite("");
    }
  }, [open]);

  return { website, setWebsite, startedAt };
}

export function Modal({
  open,
  onClose,
  children,
  size = "md"
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-ov"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className={`modal modal--${size}`} role="dialog" aria-modal="true">
        <button className="modal__x" type="button" onClick={onClose} aria-label="Закрыть">
          <Icon name="close" size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

function Honeypot({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      className="hp-field"
      tabIndex={-1}
      autoComplete="off"
      name="company"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-hidden="true"
    />
  );
}

export function QuizModal({ open, onClose, onLead }: { open: boolean; onClose: () => void; onLead: LeadHandler }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const antiSpam = useAntiSpam(open);

  useEffect(() => {
    if (open) {
      setStep(0);
      setAns({});
      setPhone("");
      setErr(false);
      setDone(false);
      setPending(false);
    }
  }, [open]);

  const total = QUIZ.length;
  const onResult = step >= total && !done;
  const rec = recommend(areaFromQuiz(ans.area));

  function pick(key: string, value: string) {
    setAns((current) => ({ ...current, [key]: value }));
    window.setTimeout(() => setStep((current) => current + 1), 180);
  }

  async function submit() {
    if (!phoneValid(phone)) {
      setErr(true);
      return;
    }
    setPending(true);
    try {
      await onLead({
        source: "Квиз-подбор",
        phone,
        payload: ans,
        rec,
        website: antiSpam.website,
        startedAt: antiSpam.startedAt.current
      });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Honeypot value={antiSpam.website} onChange={antiSpam.setWebsite} />
      {done ? (
        <SuccessBody title="Готово! Заявка принята" text={`Подобрали ${rec.model}. Менеджер перезвонит и подтвердит точную цену под ключ.`} />
      ) : onResult ? (
        <div className="quiz-res">
          <div className="eyebrow">Ваш подбор готов</div>
          <h3>Рекомендуем: {rec.model}</h3>
          <div className="quiz-res__price">
            Пакет «{rec.pkg}» — <b>{money(rec.price)}</b> под ключ
          </div>
          <p className="muted">Оставьте телефон — назовём точную цену именно для вашей комнаты и закрепим подарок.</p>
          <PhoneField
            value={phone}
            onChange={(value) => {
              setPhone(value);
              setErr(false);
            }}
            onEnter={submit}
            autoFocus
            invalid={err}
          />
          {err && <div className="field-err">Введите корректный номер телефона</div>}
          <Btn variant="cta" size="lg" full onClick={submit} icon="arrow" disabled={pending}>
            {pending ? "Отправляем..." : "Узнать мою цену"}
          </Btn>
          <div className="policy">Нажимая, вы соглашаетесь с обработкой данных. Без спама.</div>
        </div>
      ) : (
        <div className="quiz">
          <div className="quiz__bar">
            <span style={{ width: `${(step / total) * 100}%` }} />
          </div>
          <div className="quiz__count">
            Шаг {step + 1} из {total}
          </div>
          <h3 className="quiz__q">{QUIZ[step].q}</h3>
          <div className="quiz__opts">
            {QUIZ[step].opts.map((option) => (
              <button key={option.v} className="quiz-opt" type="button" onClick={() => pick(QUIZ[step].key, option.v)}>
                {option.icon && (
                  <span className="quiz-opt__ic">
                    <Icon name={option.icon} size={22} />
                  </span>
                )}
                <span>{option.v}</span>
                <Icon name="arrow" size={18} className="quiz-opt__go" />
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="quiz__back" type="button" onClick={() => setStep((current) => current - 1)}>
              ← Назад
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}

export function QuickCalcModal({
  open,
  onClose,
  onLead,
  preset
}: {
  open: boolean;
  onClose: () => void;
  onLead: LeadHandler;
  preset?: QuickLeadPreset | null;
}) {
  const [area, setArea] = useState(25);
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const antiSpam = useAntiSpam(open);

  useEffect(() => {
    if (open) {
      setArea(preset?.area || 25);
      setPhone("");
      setErr(false);
      setDone(false);
      setPending(false);
    }
  }, [open, preset?.area]);

  const rec = preset?.rec || recommend(area);

  async function submit() {
    if (!phoneValid(phone)) {
      setErr(true);
      return;
    }
    setPending(true);
    try {
      await onLead({
        source: preset?.source || "Быстрый расчёт",
        phone,
        payload: { area, ...(preset?.payload || {}) },
        rec,
        website: antiSpam.website,
        startedAt: antiSpam.startedAt.current
      });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Honeypot value={antiSpam.website} onChange={antiSpam.setWebsite} />
      {done ? (
        <SuccessBody title="Расчёт отправлен!" text="Менеджер перезвонит и назовёт точную цену под ключ." />
      ) : (
        <div className="qcalc">
          <div className="eyebrow">Быстрый расчёт за 30 секунд</div>
          <h3>Узнайте цену под ключ</h3>
          <div className="qcalc__area">
            <div className="qcalc__areaval">{area} м²</div>
            <input className="range" type="range" min="10" max="60" value={area} onChange={(event) => setArea(Number(event.target.value))} />
            <div className="qcalc__scale">
              <span>10 м²</span>
              <span>60 м²</span>
            </div>
          </div>
          <div className="qcalc__rec">
            <div>
              <span className="muted">Рекомендуем</span>
              <b>{rec.model}</b>
            </div>
            <div className="qcalc__price">{money(rec.price)}</div>
          </div>
          <PhoneField
            value={phone}
            onChange={(value) => {
              setPhone(value);
              setErr(false);
            }}
            onEnter={submit}
            invalid={err}
          />
          {err && <div className="field-err">Введите корректный номер</div>}
          <Btn variant="cta" size="lg" full onClick={submit} icon="phone" disabled={pending}>
            {pending ? "Отправляем..." : "Получить точную цену"}
          </Btn>
          <div className="policy">Перезвоним за 15 минут. Без спама.</div>
        </div>
      )}
    </Modal>
  );
}

export function CallbackModal({
  open,
  onClose,
  onLead,
  title = "Обратный звонок за 30 секунд"
}: {
  open: boolean;
  onClose: () => void;
  onLead: LeadHandler;
  title?: string;
}) {
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const antiSpam = useAntiSpam(open);

  useEffect(() => {
    if (open) {
      setPhone("");
      setErr(false);
      setDone(false);
      setPending(false);
    }
  }, [open]);

  async function submit() {
    if (!phoneValid(phone)) {
      setErr(true);
      return;
    }
    setPending(true);
    try {
      await onLead({
        source: "Обратный звонок",
        phone,
        website: antiSpam.website,
        startedAt: antiSpam.startedAt.current
      });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Honeypot value={antiSpam.website} onChange={antiSpam.setWebsite} />
      {done ? (
        <SuccessBody title="Спасибо! Уже звоним" text="Менеджер наберёт вас в течение 15 минут." />
      ) : (
        <div className="qcalc">
          <div className="eyebrow">Бесплатно</div>
          <h3>{title}</h3>
          <p className="muted">Оставьте номер — перезвоним, ответим на вопросы и назовём цену под ключ.</p>
          <PhoneField
            value={phone}
            onChange={(value) => {
              setPhone(value);
              setErr(false);
            }}
            onEnter={submit}
            autoFocus
            invalid={err}
          />
          {err && <div className="field-err">Введите корректный номер</div>}
          <Btn variant="cta" size="lg" full onClick={submit} icon="phone" disabled={pending}>
            {pending ? "Отправляем..." : "Жду звонка"}
          </Btn>
          <div className="policy">Нажимая, вы соглашаетесь с обработкой данных.</div>
        </div>
      )}
    </Modal>
  );
}

export function FloatingDock({ onCallback }: { onCallback: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`dock ${open ? "dock--open" : ""}`}>
      <a className="dock__item dock__item--tg" href={BRAND.tg} target="_blank" rel="noreferrer" title="Telegram" aria-label="Написать в Telegram">
        <Icon name="tg" size={22} />
      </a>
      <a className="dock__item dock__item--max" href={BRAND.max} target="_blank" rel="noreferrer" title="MAX" aria-label="Написать в MAX">
        <Icon name="chat" size={22} />
      </a>
      <button className="dock__item dock__item--cb" type="button" onClick={onCallback} title="Обратный звонок" aria-label="Заказать обратный звонок">
        <Icon name="clock" size={22} />
      </button>
      <a className="dock__item dock__item--call" href={BRAND.phoneHref} title="Позвонить" aria-label="Позвонить">
        <Icon name="phone" size={22} />
      </a>
      <button className="dock__toggle" type="button" onClick={() => setOpen((current) => !current)} aria-label="Связь">
        <Icon name={open ? "close" : "chat"} size={24} />
      </button>
    </div>
  );
}
