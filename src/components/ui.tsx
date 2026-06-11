"use client";

import { useEffect, useRef } from "react";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { IconName } from "@/config/site";
import { formatPhone } from "@/lib/phone";

const ICON_PATHS: Record<IconName, string> = {
  clean: '<path d="M3 21h6M6 21V9m0 0 9-6 3 4.5L9 9m9 12V11"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"/>',
  guard: '<path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/>',
  ruble: '<path d="M8 4h5a4 4 0 0 1 0 8H8m0 0v8m0-8H6m2 4h-2m2 0h5"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  broom: '<path d="m19 5-7 7M5 21l4-1 8-8-3-3-8 8-1 4zM14 7l3 3"/>',
  quiet: '<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M16 9c1 1 1 5 0 6M3 3l18 18"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/>',
  tg: '<path d="m22 3-2 16-6-3-3 3-2-4 11-8-13 6-4-2 19-8z"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20l1.3-3.9A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  star: '<path d="m12 2 3 6.5 7 .9-5 4.8 1.2 7L12 17.8 5.6 21.2 6.8 14l-5-4.8 7-.9L12 2z"/>',
  close: '<path d="M6 6 18 18M18 6 6 18"/>',
  home: '<path d="m3 11 9-8 9 8M5 10v10h14V10"/>',
  bed: '<path d="M3 18v-6h18v6M3 12V7h12v5M3 18v2M21 18v2"/>',
  sofa: '<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M3 11a2 2 0 0 1 2 2v4h14v-4a2 2 0 0 1 2-2M5 17v3M19 17v3"/>',
  rooms: '<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  gift: '<path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7S11 3 8.5 3 6 5.5 6 7M12 7s1-4 3.5-4S18 5.5 18 7"/>',
  spark: '<path d="M12 2v20M3.3 7 20.7 17M20.7 7 3.3 17M14 4.5 12 2 10 4.5M14 19.5 12 22 10 19.5M19.5 10 20.7 7 17.5 6.5M6.5 6.5 3.3 7 4.5 10M6.5 17.5 3.3 17 4.5 14M19.5 14 20.7 17 17.5 17.5"/>',
  map: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
};

export function Icon({
  name,
  size = 24,
  stroke = 2,
  className = "",
  style
}: {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}

export function Btn({
  children,
  variant = "primary",
  size = "md",
  full,
  href,
  icon,
  className = "",
  ...buttonProps
}: {
  children: ReactNode;
  variant?: "primary" | "cta" | "soft";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  href?: string;
  icon?: IconName;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `btn btn--${variant} btn--${size} ${full ? "btn--full" : ""} ${className}`.trim();
  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} size={size === "lg" ? 20 : 18} />}
    </>
  );

  if (href) {
    return (
      <a className={cls} href={href}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={cls} {...buttonProps}>
      {inner}
    </button>
  );
}

export function PhoneField({
  value,
  onChange,
  onEnter,
  autoFocus,
  placeholder = "+7 (___) ___-__-__",
  invalid
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
  invalid?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <input
      ref={ref}
      className={`field field--phone${invalid ? " field--err" : ""}`}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder={placeholder}
      value={value}
      aria-invalid={invalid ? "true" : undefined}
      onChange={(event) => onChange(formatPhone(event.target.value))}
      onKeyDown={(event) => {
        if (event.key === "Enter" && onEnter) onEnter();
      }}
    />
  );
}

export function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="stars" aria-label={`${n} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={16}
          stroke={1.5}
          style={{
            color: i < n ? "var(--gold)" : "var(--line)",
            fill: i < n ? "var(--gold)" : "none"
          }}
        />
      ))}
    </span>
  );
}

export function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const timeout = window.setTimeout(onDone, 3200);
    return () => window.clearTimeout(timeout);
  }, [msg, onDone]);

  if (!msg) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name="check" size={18} /> {msg}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  sub,
  children,
  narrow,
  alt
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  sub?: string;
  children: ReactNode;
  narrow?: boolean;
  alt?: boolean;
}) {
  return (
    <section id={id} className={`sec ${alt ? "sec--alt" : ""}`}>
      <div className={`wrap ${narrow ? "wrap--narrow" : ""}`}>
        {(eyebrow || title) && (
          <div className="sec__head">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2 className="sec__title">{title}</h2>}
            {sub && <p className="sec__sub">{sub}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function SuccessBody({ title, text }: { title: string; text: string }) {
  return (
    <div className="success">
      <div className="success__ring">
        <Icon name="check" size={34} stroke={2.5} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="success__chips">
        <span className="chip">
          <Icon name="clock" size={15} /> Перезвоним за 15 минут
        </span>
        <span className="chip">
          <Icon name="gift" size={15} /> Подарок закреплён за вами
        </span>
      </div>
    </div>
  );
}
