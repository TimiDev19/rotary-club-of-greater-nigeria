"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, HeartHandshake, Mail, UsersRound, Lightbulb } from "lucide-react";

export function JoinCta() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="cta-band"
      aria-labelledby="join-cta-title"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="join-cta-copy">
        <motion.span
          className="eyebrow gold"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.45 }}
        >
          YOUR NEXT CHAPTER IN SERVICE
        </motion.span>
        <h2 id="join-cta-title">
          Bring your passion.
          <br />
          <em>Make a difference.</em>
        </h2>
        <p className="cta-description">
          Join people across Nigeria who turn their skills and care for others
          into meaningful action. Find fellowship, grow as a leader, and help
          build stronger communities—one project at a time.
        </p>
        <motion.a
          href="mailto:greaterrotaryeclub@gmail.com?subject=I%27d%20like%20to%20join%20Rotary%20E-Club%20of%20Greater%20Nigeria"
          className="button gold-button join-button"
          whileHover={reduceMotion ? undefined : { y: -3, scale: 1.025 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
        >
          <Mail size={17} aria-hidden="true" /> Reach Out To Join
          <ArrowUpRight size={16} aria-hidden="true" />
        </motion.a>
        <span className="cta-email">Start the conversation at greaterrotaryeclub@gmail.com</span>
      </div>
      <motion.aside
        className="join-cta-card"
        aria-label="What you can be part of"
        initial={reduceMotion ? false : { opacity: 0, x: 22, rotate: 1.5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.18, duration: 0.65, ease: "easeOut" }}
      >
        <span className="join-card-mark" aria-hidden="true">
          <img src="/club-logo.png" alt="" />
        </span>
        <span className="eyebrow">A PLACE TO</span>
        <h3>Serve with purpose.<br />Grow together.</h3>
        <div className="join-card-values">
          <span><HeartHandshake aria-hidden="true" /> Make an impact</span>
          <span><UsersRound aria-hidden="true" /> Find your people</span>
          <span><Lightbulb aria-hidden="true" /> Put ideas to work</span>
        </div>
        <span className="join-card-footer">SERVICE ABOVE SELF <i>✳</i> GREATER NIGERIA</span>
      </motion.aside>
    </motion.section>
  );
}
