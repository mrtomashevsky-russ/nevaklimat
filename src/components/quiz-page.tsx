"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BRAND, QUIZ, TRUST, areaFromQuiz, recommend } from "@/config/site";
import { money } from "@/lib/money";
import { phoneValid } from "@/lib/phone";
import { captureUtmFromLocation } from "@/lib/utm";
import { Btn, Icon, PhoneField, Toast } from "@/components/ui";
import { useLeadSender } from "@/components/lead-form";

export function QuizPageApp() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState("");
  const startedAt = useRef(Date.now());
  const { send, pending } = useLeadSender(setToast);

  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  const total = QUIZ.length;
  const onResult = step >= total && !done;
  const rec = recommend(areaFromQuiz(ans.area));
  const pct = done ? 100 : onResult ? 100 : (step / total) * 100;

  function pick(key: string, value: string) {
    setAns((current) => ({ ...current, [key]: value }));
    window.setTimeout(() => setStep((current) => current + 1), 160);
  }

  async function submit() {
    if (!phoneValid(phone)) {
      setErr(true);
      return;
    }

    try {
      await send({
        source: "Квиз-подбор",
        phone,
        payload: ans,
        rec,
        website,
        startedAt: startedAt.current
      });
      setDone(true);
    } catch {
      setErr(true);
    }
  }

  return (
    <div className="qpage">
      <div className="qpage__bg" />
      <header className="qpage__top">
        <Link className="logo" href="/">
          <span className="logo__mark">
            <Icon name="spark" size={20} stroke={2.4} />
          </span>
          <span className="logo__txt">{BRAND.name}</span>
        </Link>
        <Link className="qpage__back" href="/">
          <Icon name="close" size={16} /> На сайт
        </Link>
      </header>

      <main className="qpage__main">
        <div className="qpage__card">
          <input
            className="hp-field"
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            aria-hidden="true"
          />
          {done ? (
            <div className="success">
              <div className="success__ring">
                <Icon name="check" size={34} stroke={2.5} />
              </div>
              <h2>Готово! Заявка принята</h2>
              <p>Подобрали {rec.model}. Менеджер перезвонит за 15 минут и подтвердит точную цену под ключ.</p>
              <div className="success__chips">
                <span className="chip">
                  <Icon name="clock" size={15} /> Перезвоним за 15 минут
                </span>
                <span className="chip">
                  <Icon name="gift" size={15} /> Подарок закреплён за вами
                </span>
              </div>
              <Link className="btn btn--soft btn--lg" href="/" style={{ marginTop: 24 }}>
                Вернуться на сайт
              </Link>
            </div>
          ) : onResult ? (
            <div className="qpage__res">
              <div className="eyebrow">Ваш подбор готов</div>
              <h2>Рекомендуем: {rec.model}</h2>
              <div className="qpage__resprice">
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
              <button className="quiz__back" type="button" onClick={() => setStep(total - 1)}>
                ← Изменить ответы
              </button>
              <div className="policy">Нажимая, вы соглашаетесь с обработкой данных. Без спама.</div>
            </div>
          ) : (
            <div className="quiz">
              <div className="quiz__bar">
                <span style={{ width: `${pct}%` }} />
              </div>
              <div className="quiz__count">
                Шаг {step + 1} из {total}
              </div>
              <h2 className="quiz__q">{QUIZ[step].q}</h2>
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
        </div>

        <div className="qpage__trust">
          {TRUST.slice(0, 3).map((item) => (
            <div className="qpage__trustitem" key={item.l}>
              <b>{item.n}</b>
              <span>{item.l}</span>
            </div>
          ))}
        </div>
      </main>
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}
