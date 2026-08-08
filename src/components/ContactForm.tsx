"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

type FieldName = "name" | "email" | "projectType" | "message";
type Errors = Partial<Record<FieldName, string>>;

const MIN_MESSAGE = 20;

/* Tab order is the order we walk when reporting the first problem, so the
   user lands on the earliest field they need to fix rather than the last. */
const FIELD_ORDER: FieldName[] = ["name", "email", "projectType", "message"];

const fieldId = (name: FieldName) => `contact-${name}`;
const errorId = (name: FieldName) => `contact-${name}-error`;

/* Deliberately permissive — the job here is to catch a typo like a missing
   "@", not to adjudicate RFC 5322. The server does the authoritative check. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const value = (key: FieldName) => String(data.get(key) ?? "").trim();

  if (!value("name")) {
    errors.name = "Enter your name.";
  }

  const email = value("email");
  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL.test(email)) {
    errors.email = "Enter an email address in the format name@example.com.";
  }

  if (!value("projectType")) {
    errors.projectType = "Choose a project type.";
  }

  const message = value("message");
  if (!message) {
    errors.message = "Tell us what you’re building.";
  } else if (message.length < MIN_MESSAGE) {
    const remaining = MIN_MESSAGE - message.length;
    errors.message = `Add ${remaining} more character${remaining === 1 ? "" : "s"} — ${MIN_MESSAGE} minimum.`;
  }

  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  /* Clearing on edit rather than waiting for the next submit — leaving a
     resolved error on screen makes the form feel like it isn't listening. */
  const clearError = (name: FieldName) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const describedBy = (name: FieldName, ...extra: string[]) => {
    const ids = [...extra, errors[name] ? errorId(name) : null].filter(Boolean);
    return ids.length ? ids.join(" ") : undefined;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      const count = Object.keys(found).length;
      setStatus("error");
      setMessage(
        `${count} field${count === 1 ? "" : "s"} need${count === 1 ? "s" : ""} attention before this can send.`,
      );
      const first = FIELD_ORDER.find((name) => found[name]);
      // Focus after React commits, so the field's aria-describedby already
      // points at its error message when the screen reader reads it. Focusing
      // synchronously here would announce the field with no reason attached.
      if (first) {
        requestAnimationFrame(() => document.getElementById(fieldId(first))?.focus());
      }
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          projectType: data.get("projectType"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "The message didn’t send. Try again in a moment.");
      }

      setStatus("success");
      setMessage("Message sent. You’ll hear back from the studio soon.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "The message didn’t send. Try again in a moment.",
      );
    }
  }

  const busy = status === "loading";

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate aria-busy={busy}>
      {/* Honeypot. Hidden from everyone, sighted and otherwise, so a real user
          can never be tripped by it. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <p className="field-hint mt-0!">
        Required fields are marked <span className="required-mark">*</span>
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="eyebrow block" htmlFor={fieldId("name")}>
            Name
            <span className="required-mark" aria-hidden>
              *
            </span>
          </label>
          <input
            id={fieldId("name")}
            className="field mt-2.5"
            name="name"
            required
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            onChange={() => clearError("name")}
          />
          {errors.name ? (
            <p className="field-error" id={errorId("name")}>
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-current" aria-hidden />
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="eyebrow block" htmlFor={fieldId("email")}>
            Email
            <span className="required-mark" aria-hidden>
              *
            </span>
          </label>
          <input
            id={fieldId("email")}
            className="field mt-2.5"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            onChange={() => clearError("email")}
          />
          {errors.email ? (
            <p className="field-error" id={errorId("email")}>
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-current" aria-hidden />
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="eyebrow block" htmlFor={fieldId("projectType")}>
          Project type
          <span className="required-mark" aria-hidden>
            *
          </span>
        </label>
        <select
          id={fieldId("projectType")}
          className="field mt-2.5"
          name="projectType"
          required
          defaultValue=""
          aria-invalid={errors.projectType ? true : undefined}
          aria-describedby={describedBy("projectType")}
          onChange={() => clearError("projectType")}
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="product">Studio product / partnership</option>
          <option value="client">Client project</option>
          <option value="other">Something else</option>
        </select>
        {errors.projectType ? (
          <p className="field-error" id={errorId("projectType")}>
            <span className="mt-1.5 h-1 w-1 shrink-0 bg-current" aria-hidden />
            {errors.projectType}
          </p>
        ) : null}
      </div>

      <div>
        <label className="eyebrow block" htmlFor={fieldId("message")}>
          Message
          <span className="required-mark" aria-hidden>
            *
          </span>
        </label>
        {/* The prompt moves out of the placeholder and into a hint: placeholder
            text disappears the moment you start typing, and it isn't a
            reliable accessible description. */}
        <textarea
          id={fieldId("message")}
          className="field mt-2.5 min-h-40 resize-y"
          name="message"
          required
          minLength={MIN_MESSAGE}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", "contact-message-hint")}
          onChange={() => clearError("message")}
        />
        <p className="field-hint" id="contact-message-hint">
          What are you building, what’s the timeline, and where does it need help? At least{" "}
          {MIN_MESSAGE} characters.
        </p>
        {errors.message ? (
          <p className="field-error" id={errorId("message")}>
            <span className="mt-1.5 h-1 w-1 shrink-0 bg-current" aria-hidden />
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        {/* aria-disabled, not disabled: a disabled button drops out of the tab
            order mid-submit and dumps focus on <body>. */}
        <button
          type="submit"
          aria-disabled={busy}
          className="btn btn-primary"
          onClick={(event) => {
            if (busy) event.preventDefault();
          }}
        >
          {busy ? "Sending…" : "Send message"}
        </button>

        {/* Both regions stay mounted. A live region inserted at the same moment
            as its text is frequently missed — the region has to already exist
            for the change to be picked up. */}
        <p
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-cyan-hi"
        >
          {status === "success" && message ? (
            <>
              <span className="h-1.5 w-1.5 shrink-0 bg-cyan" aria-hidden />
              {message}
            </>
          ) : null}
        </p>
        <p role="alert" className="flex items-center gap-2 text-sm text-danger">
          {status === "error" && message ? (
            <>
              <span className="h-1.5 w-1.5 shrink-0 bg-danger" aria-hidden />
              {message}
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
