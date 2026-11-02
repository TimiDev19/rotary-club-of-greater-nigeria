"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, FileBadge2, Globe2 } from "lucide-react";

export function MakeupCta() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="makeup-card"
      className="makeup-landing-cta"
      aria-labelledby="makeup-landing-title"
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="makeup-landing-copy">
        <span className="eyebrow">VISITING ROTARIANS</span>
        <h2 id="makeup-landing-title">
          Your service travels <em>with you.</em>
        </h2>
        <p>
          Joined us for a meeting or service activity? Request a make-up card
          through our simple form. Our club team will review your details and,
          once approved, prepare your card.
        </p>
        <Link className="button blue-button makeup-landing-button" href="/makeup-card">
          Request a make-up card <ArrowRight size={17} />
        </Link>
      </div>

      <div className="makeup-landing-steps" aria-label="How to request a make-up card">
        <div className="makeup-landing-orbit" aria-hidden="true" />
        <div className="makeup-step-card">
          <span className="makeup-step-icon"><FileBadge2 size={22} /></span>
          <span><b>Send your details</b><small>Use the short visitor form</small></span>
          <span className="makeup-step-number">01</span>
        </div>
        <div className="makeup-step-card">
          <span className="makeup-step-icon gold"><BadgeCheck size={22} /></span>
          <span><b>We review your visit</b><small>Club admin verifies the request</small></span>
          <span className="makeup-step-number">02</span>
        </div>
        <div className="makeup-step-card">
          <span className="makeup-step-icon green"><Globe2 size={22} /></span>
          <span><b>Receive your card</b><small>After your request is approved</small></span>
          <span className="makeup-step-number">03</span>
        </div>
      </div>
    </motion.section>
  );
}
