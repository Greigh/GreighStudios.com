"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

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

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Name</span>
          <input className="field mt-2.5" name="name" required autoComplete="name" />
        </label>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input className="field mt-2.5" name="email" type="email" required autoComplete="email" />
        </label>
      </div>

      <label className="block">
        <span className="eyebrow">Project type</span>
        <select className="field mt-2.5" name="projectType" required defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option value="product">Studio product / partnership</option>
          <option value="client">Client project</option>
          <option value="other">Something else</option>
        </select>
      </label>

      <label className="block">
        <span className="eyebrow">Message</span>
        <textarea
          className="field mt-2.5 min-h-40 resize-y"
          name="message"
          required
          minLength={20}
          placeholder="What are you building, what’s the timeline, and where does it need help?"
        />
      </label>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" disabled={status === "loading"} className="btn btn-primary">
          {status === "loading" ? "Sending…" : "Send message"}
        </button>

        {message ? (
          <p
            className={`flex items-center gap-2 text-sm ${
              status === "success" ? "text-cyan-hi" : "text-red-300"
            }`}
            role="status"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 ${status === "success" ? "bg-cyan" : "bg-red-400"}`}
              aria-hidden
            />
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
