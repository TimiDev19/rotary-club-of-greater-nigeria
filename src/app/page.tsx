import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  HeartHandshake,
  Facebook,
  Instagram,
  UsersRound,
} from "lucide-react";
import { Shell } from "@/components/site";
import { DataSection } from "@/components/content";
import { RotaryPrinciples } from "@/components/rotary-principles";
import { JoinCta } from "@/components/join-cta";
export default function Home() {
  return (
    <Shell>
      <main>
        <section id="top" className="hero">
          <div
            className="hero-image"
            role="img"
            aria-label="Community volunteers working together to plant a tree"
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <span className="eyebrow gold">SERVICE • FELLOWSHIP • IMPACT</span>
            <h1>
              Collaborate, Serve,
              <br />
              <em>Make an impact.</em>
            </h1>
            <p>
              Bringing people of action through digital connections, shared
              values, and a passion for service. As a Rotary eClub, we harness
              the power of technology and collaboration to inspire positive
              change, empower communities, and create lasting impact while
              staying united by our commitment to Service Above Self.
            </p>
            <div className="hero-actions">
              <Link className="button gold-button" href="/projects">
                Explore our projects <ArrowRight size={17} />
              </Link>
              <Link className="button outline-button" href="/clubhouse/login">
                Member clubhouse <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          {/* <div className="hero-note">
            <span>01 / COMMUNITY</span>
            <span>Good grows when we serve together.</span>
          </div>
          <div className="hero-credit">Stock photo: RDNE Stock project · <a href="https://www.pexels.com/photo/love-people-event-africa-6646861/" target="_blank" rel="noreferrer">Pexels</a></div> */}
        </section>
        <RotaryPrinciples />

        <DataSection
          id="projects"
          endpoint="/api/projects"
          title="Service, in action"
          kicker="OUR PROJECTS"
          href="/projects"
        />

        <section
          id="about"
          className="section about-home"
          aria-labelledby="about-home-title"
        >
          <div className="about-home-heading">
            <span className="eyebrow">WHO WE ARE</span>
            <h2 id="about-home-title">
              Service starts with <em>showing up.</em>
            </h2>
            <p>
              Rotary E-Club of Greater Nigeria is a community of people
              committed to service and fellowship.
            </p>
          </div>
          <div className="about-home-copy">
            <span className="about-home-rule" aria-hidden="true" />
            <div className="about-home-details">
              <article className="about-detail-card mission-card">
                <span className="eyebrow">OUR PURPOSE</span>
                <h3>Our mission</h3>
                <p>
                  We provide service to others, promote integrity, and advance
                  world understanding, goodwill, and peace through our
                  fellowship of business, professional, and community leaders.
                </p>
              </article>
              <article className="about-detail-card meeting-card">
                <span className="eyebrow">COME TOGETHER</span>
                <h3>Club meetings</h3>
                <p>
                  <strong>Every Saturday</strong>
                  <br />
                  20:30 West Africa Time (WAT)
                </p>
              </article>
              <article className="about-detail-card social-card">
                <span className="eyebrow">STAY CONNECTED</span>
                <h3>Follow our community</h3>
                <div className="social-links">
                  <a
                    href="https://www.facebook.com/rcgreaternig"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook size={19} aria-hidden="true" /> Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/rcgreaternig"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={19} aria-hidden="true" /> Instagram
                  </a>
                </div>
              </article>
            </div>
            <Link className="text-link" href="/projects">
              See our service projects <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <DataSection
          id="officers"
          endpoint="/api/club-officers"
          title="The people who guide us"
          kicker="CLUB OFFICERS"
          href="/officers"
        />

        <section className="intro">
          <span className="eyebrow">ROTARY E-CLUB OF GREATER NIGERIA</span>
          <h2>
            Connected by service.
            <br />
            <em>Rooted in community.</em>
          </h2>
          <p>
            We bring people together to turn care into action. Explore the
            projects, leaders and stories shared by our club.
          </p>
          <div className="intro-icons">
            <div>
              <HeartHandshake />
              <b>Service</b>
              <span>Practical action, shaped by community.</span>
            </div>
            <div>
              <UsersRound />
              <b>Fellowship</b>
              <span>Good people, working toward shared goals.</span>
            </div>
            <div>
              <Globe2 />
              <b>Connection</b>
              <span>Local commitment with a wider outlook.</span>
            </div>
          </div>
        </section>

        <DataSection
          id="past-presidents"
          endpoint="/api/past-presidents"
          title="A legacy of leadership"
          kicker="LEAGUE OF PAST PRESIDENTS"
          href="/past-presidents"
        />
        <DataSection
          id="bulletins"
          endpoint="/api/bulletins"
          title="Notes from our club"
          kicker="LATEST BULLETINS"
          href="/bulletins"
        />
        <JoinCta />
      </main>
    </Shell>
  );
}
