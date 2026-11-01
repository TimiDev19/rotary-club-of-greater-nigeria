import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  HeartHandshake,
  UsersRound,
} from "lucide-react";
import { Shell } from "@/components/site";
import { DataSection } from "@/components/content";
export default function Home() {
  return (
    <Shell>
      <main>
        <section className="hero">
          <div
            className="hero-image"
            role="img"
            aria-label="Community service in Nigeria"
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <span className="eyebrow gold">SERVICE • FELLOWSHIP • IMPACT</span>
            <h1>
              Small acts.
              <br />
              <em>Lasting change.</em>
            </h1>
            <p>
              Neighbors, professionals and people of action, working together
              for stronger communities across Nigeria.
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
          <div className="hero-note">
            <span>01 / COMMUNITY</span>
            <span>Good grows when we serve together.</span>
          </div>
          <div className="hero-credit">Photo: Mohammed Bayero Yayandi / <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a> · <a href="https://commons.wikimedia.org/wiki/File:Community_Clean_Up.jpg" target="_blank" rel="noreferrer">Wikimedia Commons</a></div>
        </section>
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
          endpoint="/api/projects"
          title="Service, in action"
          kicker="OUR PROJECTS"
          href="/projects"
        />
        <DataSection
          endpoint="/api/club-officers"
          title="The people who guide us"
          kicker="CLUB OFFICERS"
          href="/officers"
        />
        <DataSection
          endpoint="/api/past-presidents"
          title="A legacy of leadership"
          kicker="PAST PRESIDENTS"
          href="/past-presidents"
        />
        <DataSection
          endpoint="/api/bulletins"
          title="Notes from our club"
          kicker="LATEST BULLETINS"
          href="/bulletins"
        />
        <section className="cta-band">
          <span className="eyebrow gold">THERE'S A PLACE FOR YOU</span>
          <h2>
            Make service part
            <br />
            of your story.
          </h2>
          <Link href="/about" className="button gold-button">
            Get to know us <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    </Shell>
  );
}
