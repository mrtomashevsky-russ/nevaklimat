"use client";

import { useRef, useState } from "react";
import type { Recommendation } from "@/config/site";
import { phoneValid } from "@/lib/phone";
import { submitLead } from "@/lib/lead-client";
import { Btn, Icon, PhoneField } from "@/components/ui";

export function useLeadSender(onSuccess?: (message: string) => void) {
  const [pending, setPending] = useState(false);

  async function send(input: {
    phone: string;
    source: string;
    payload?: Record<string, unknown>;
    rec?: Recommendation;
    website?: string;
    startedAt?: number;
  }) {
    setPending(true);
    try {
      await submitLead(input);
      onSuccess?.("Заявка принята — перезвоним за 15 минут");
    } finally {
      setPending(false);
    }
  }

  return { send, pending };
}

export function InlineLead({
  onLead,
  source,
  cta,
  secondary,
  onSecondary,
  light
}: {
  onLead: (input: { phone: string; source: string; website?: string; startedAt?: number }) => Promise<void>;
  source: string;
  cta: string;
  secondary?: string;
  onSecondary?: () => void;
  light?: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const startedAt = useRef(Date.now());

  async function submit() {
    if (!phoneValid(phone)) {
      setErr(true);
      return;
    }
    setPending(true);
    try {
      await onLead({ source, phone, website, startedAt: startedAt.current });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className={`inlead inlead--done ${light ? "inlead--light" : ""}`}>
        <span className="inlead__ok">
          <Icon name="check" size={20} stroke={2.5} />
        </span>
        <div>
          <b>Заявка принята!</b>
          <span>Перезвоним за 15 минут с ценой и подарком.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inlead ${light ? "inlead--light" : ""}`}>
      <input
        className="hp-field"
        tabIndex={-1}
        autoComplete="off"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        aria-hidden="true"
      />
      <div className="inlead__row">
        <PhoneField
          value={phone}
          onChange={(value) => {
            setPhone(value);
            setErr(false);
          }}
          onEnter={submit}
          invalid={err}
        />
        <Btn variant="cta" size="lg" onClick={submit} icon="arrow" disabled={pending}>
          {pending ? "Отправляем..." : cta}
        </Btn>
      </div>
      {err && <div className="field-err">Введите корректный номер телефона</div>}
      <div className="inlead__foot">
        {secondary && (
          <button className="linkbtn" type="button" onClick={onSecondary}>
            {secondary}
          </button>
        )}
        <span className="policy policy--inline">
          <Icon name="shield" size={13} />
          <span>Без спама. Перезвоним за 15 минут.</span>
        </span>
      </div>
    </div>
  );
}
