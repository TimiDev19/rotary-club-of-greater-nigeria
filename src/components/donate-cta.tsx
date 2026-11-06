"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, HeartHandshake, X } from "lucide-react";

const ACCOUNT_NUMBER = "1032610545";

export function DonateCta() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function copyAccountNumber() {
    setCopyError("");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      } else {
        const input = document.createElement("textarea");
        input.value = ACCOUNT_NUMBER;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const success = document.execCommand("copy");
        input.remove();
        if (!success) throw new Error("Copy command was not available");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError("Could not copy automatically. Please select and copy the account number.");
    }
  }

  return (
    <>
      <motion.section
        id="donate"
        className="donate-band"
        aria-labelledby="donate-title"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="donate-mark" aria-hidden="true"><HeartHandshake size={28} /></div>
        <div className="donate-copy">
          <span className="eyebrow">GIVE TO LOCAL IMPACT</span>
          <h2 id="donate-title">Help good work <em>go further.</em></h2>
          <p>Your support helps our club serve communities and create lasting change across Nigeria.</p>
        </div>
        <button className="button gold-button donate-open-button" onClick={() => { setOpen(true); setCopied(false); setCopyError(""); }}>
          Donate <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </motion.section>

      {open && (
        <div
          className="donate-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
        >
          <section className="donate-modal" role="dialog" aria-modal="true" aria-labelledby="donate-modal-title" aria-describedby="donate-modal-description">
            <button className="donate-modal-close" onClick={() => setOpen(false)} aria-label="Close donation details" autoFocus>
              <X size={20} aria-hidden="true" />
            </button>
            <span className="donate-modal-icon"><HeartHandshake size={25} aria-hidden="true" /></span>
            <span className="eyebrow">THANK YOU FOR YOUR SUPPORT</span>
            <h2 id="donate-modal-title">Make a contribution</h2>
            <p id="donate-modal-description">Use the club account details below to support our service projects.</p>
            <dl className="donate-account-details">
              <div><dt>Account name</dt><dd>E-Club of Greater Nigeria</dd></div>
              <div className="donate-account-number"><dt>Account number</dt><dd>{ACCOUNT_NUMBER}</dd></div>
              <div><dt>Bank</dt><dd>FCMB</dd></div>
            </dl>
            <button className="button blue-button donate-copy-button" onClick={copyAccountNumber}>
              {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
              {copied ? "Account number copied" : "Copy account number"}
            </button>
            {copyError && <p className="donate-copy-error" role="alert">{copyError}</p>}
          </section>
        </div>
      )}
    </>
  );
}
