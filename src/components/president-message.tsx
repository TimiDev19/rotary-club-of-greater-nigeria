"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { api, items, type Envelope } from "@/lib/api";

type PresidentMessageRecord = {
  id: string | number;
  president_name: string;
  year_served: string;
  message: string;
  image_url: string;
};

export function PresidentMessage() {
  const [record, setRecord] = useState<PresidentMessageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    api<Envelope<PresidentMessageRecord[]>>("/api/president-messages?page=1&limit=1")
      .then((response) => {
        if (active) setRecord(items<PresidentMessageRecord>(response)[0] || null);
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <section className="president-message-section" aria-label="Loading president’s message" aria-busy="true">
        <div className="president-message-skeleton">
          <span className="skeleton president-portrait-skeleton" />
          <div><span className="skeleton skeleton-kicker" /><span className="skeleton president-line" /><span className="skeleton president-line short" /><span className="skeleton president-copy-line" /><span className="skeleton president-copy-line" /><span className="skeleton president-copy-line short" /></div>
        </div>
      </section>
    );
  }

  if (!record) {
    if (error) return null;
    return null;
  }

  return (
    <motion.section
      className="president-message-section"
      aria-labelledby="president-message-title"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="president-message-wrap">
        <div className="president-message-intro">
          <span className="eyebrow">A NOTE FROM OUR LEADERSHIP</span>
          <h2 id="president-message-title">A message from <em>our president.</em></h2>
        </div>
        <article className="president-message-card">
          <div className="president-message-portrait-wrap">
            {record.image_url ? (
              <img className="president-message-portrait" src={record.image_url} alt={record.president_name} />
            ) : (
              <div className="president-message-portrait-placeholder" aria-label={`Portrait unavailable for ${record.president_name}`}>
                {record.president_name.trim().charAt(0).toUpperCase()}
              </div>
            )}
            <span className="president-message-year">{record.year_served}</span>
          </div>
          <div className="president-message-content">
            <MessageCircle className="president-message-quote-icon" size={31} aria-hidden="true" />
            <p className="president-message-text">{record.message}</p>
            <div className="president-message-signature">
              <strong>{record.president_name}</strong>
              <span>Club President · {record.year_served}</span>
            </div>
          </div>
        </article>
      </div>
    </motion.section>
  );
}
