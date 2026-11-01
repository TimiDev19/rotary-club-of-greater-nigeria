"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass, HeartHandshake, Sparkles } from "lucide-react";

const principles = [
  {
    number: "01",
    question: "Is it the TRUTH?",
    emphasis: "TRUTH",
  },
  {
    number: "02",
    question: "Is it FAIR to all concerned?",
    emphasis: "FAIR",
  },
  {
    number: "03",
    question: "Will it build GOODWILL and BETTER FRIENDSHIPS?",
    emphasis: "GOODWILL",
  },
  {
    number: "04",
    question: "Will it be BENEFICIAL to all concerned?",
    emphasis: "BENEFICIAL",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function RotaryPrinciples() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "visible" : "hidden";

  return (
    <section className="principles-section" aria-labelledby="principles-title">
      <div className="principles-wrap">
        <motion.header
          className="principles-heading"
          variants={reveal}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <span className="eyebrow">A COMPASS FOR SERVICE</span>
          <h2 id="principles-title">
            Good work starts with <em>good principles.</em>
          </h2>
          <p>
            What we believe shapes how we show up for one another and our
            communities.
          </p>
        </motion.header>

        <div className="principles-pillars">
          <motion.article
            className="principle-card mission-card"
            variants={reveal}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.05, ease: "easeOut" }}
            whileHover={reduceMotion ? undefined : { y: -5 }}
          >
            <div className="principle-icon">
              <HeartHandshake aria-hidden="true" />
            </div>
            <span className="principle-label">OUR MISSION</span>
            <p>
              Rotary provides service to others, promotes integrity, and
              advances world understanding, goodwill, and peace through its
              fellowship of business, professional, and community leaders
            </p>
            <span className="principle-orbit" aria-hidden="true">
              ✳
            </span>
          </motion.article>

          <motion.article
            className="principle-card vision-card"
            variants={reveal}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            whileHover={reduceMotion ? undefined : { y: -5 }}
          >
            <div className="principle-icon">
              <Compass aria-hidden="true" />
            </div>
            <span className="principle-label">OUR VISION</span>
            <p>
              Together, we see a world where people unite and take action to
              create lasting change — across the globe, in our communities, and
              in ourselves.
            </p>
            <span className="vision-watermark" aria-hidden="true">
              TOGETHER
            </span>
          </motion.article>
        </div>

        <motion.div
          className="four-way-panel"
          variants={reveal}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="four-way-heading">
            <div className="four-way-mark">
              <Sparkles aria-hidden="true" />
            </div>
            <div>
              <span className="four-way-kicker">
                A simple check. A lasting impact.
              </span>
              <h3>THE FOUR-WAY TEST</h3>
              <p>Of the things we think, say, or do:</p>
            </div>
          </div>
          <div className="four-way-grid">
            {principles.map((item, index) => (
              <motion.article
                className="four-way-item"
                key={item.number}
                variants={reveal}
                initial={initial}
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: reduceMotion ? 0 : index * 0.09,
                  ease: "easeOut",
                }}
              >
                <span className="four-way-number">{item.number}</span>
                <p>
                  {item.question.split(item.emphasis)[0]}
                  <strong>{item.emphasis}</strong>
                  {item.question.split(item.emphasis)[1]}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
