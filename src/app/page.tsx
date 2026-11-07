import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  HeartHandshake,
  Facebook,
  Instagram,
  Mail,
  UsersRound,
} from "lucide-react";
import { Shell } from "@/components/site";
import { DataSection } from "@/components/content";
import { RotaryPrinciples } from "@/components/rotary-principles";
import { JoinCta } from "@/components/join-cta";
import { MakeupCta } from "@/components/makeup-cta";
import { DonateCta } from "@/components/donate-cta";
import { PresidentMessage } from "@/components/president-message";
export default function Home() {
  return (
    <Shell>
      <main>
        <section id="top" className="hero">
          <div
            className="hero-image"
            role="img"
            aria-label="Rotary E-Club of Greater Nigeria members at a renovated physics laboratory"
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
              Bringing together people of action through digital connections,
              shared values, and a passion for service. As a Rotary E-Club, we
              harness the power of technology and collaboration to inspire
              positive change, empower communities, and create lasting impact
              while staying united by our commitment to Service Above Self.
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
        <PresidentMessage />

        <MakeupCta />

        <DataSection
          id="projects"
          endpoint="/api/projects"
          title="Service, in action"
          kicker="OUR PROJECTS"
          href="/projects"
        />

        <DonateCta />

        <section
          id="about"
          className="section about-home"
          aria-labelledby="about-home-title"
        >
          <div className="about-home-heading">
            <div className="about-home-kicker">
              <span className="eyebrow">WHO WE ARE</span>
              <span className="about-home-emblem">
                <img src="/emblem.jpg" alt="Rotary emblem" />
              </span>
            </div>
            <h2 id="about-home-title">
              Why join our <em>Rotary family?</em>
            </h2>
            <p>
              More than membership, it is an immediate opportunity to serve,
              make a difference, and connect with a global network of
              changemakers.
            </p>
          </div>
          <div className="about-home-copy">
            <span className="about-home-rule" aria-hidden="true" />
            <p className="about-home-story">
              Chartered in 2016, Rotary E-Club of Greater Nigeria is Nigeria’s
              oldest E-Club. We are a Rotary club like any other, with virtual
              meetings every Saturday at 8:30 p.m. Nigerian time—making Rotary
              accessible for busy schedules, frequent travel, and limited
              mobility.
            </p>
          </div>
          <div className="about-home-details">
            <article className="about-detail-card mission-card">
              <span className="eyebrow">OUR PURPOSE</span>
              <h3>Service from day one</h3>
              <p>
                Put your skills to work in impactful projects, build meaningful
                friendships, grow your leadership, and connect with
                professionals across the globe—all from your phone.
              </p>
            </article>
            <article className="about-detail-card meeting-card">
              <span className="eyebrow">A CLUB THAT FITS YOUR LIFE</span>
              <h3>Meet virtually</h3>
              <p>
                <strong>Every Saturday at 8:30 p.m.</strong>
                <br />
                Nigerian time (WAT), wherever you are.
              </p>
            </article>
            <article className="about-detail-card membership-card">
              <span className="eyebrow">A WELCOMING COMMUNITY</span>
              <h3>There’s room for you</h3>
              <p>
                Former Rotaractors, Rotarians seeking a new club, professionals,
                business owners, and anyone passionate about service and
                community development are welcome.
              </p>
            </article>
            <article className="about-detail-card leadership-card">
              <span className="eyebrow">LEADERSHIP IN ACTION</span>
              <h3>Growing leaders</h3>
              <p>
                We are proud to count the District Governor-Nominee among our
                members, set to serve as District Governor in the 2028–2029
                Rotary year.
              </p>
            </article>
            <article className="about-detail-card dues-card">
              <span className="eyebrow">ACCESSIBLE MEMBERSHIP</span>
              <h3>Affordable dues</h3>
              <p>
                Membership dues are affordable, with subsidised arrangements
                available for eligible former Rotaractors. Contact the club to
                learn more.
              </p>
              <a
                className="about-contact-link"
                href="mailto:greaterrotaryeclub@gmail.com?subject=Question%20about%20joining%20Rotary%20E-Club%20of%20Greater%20Nigeria"
              >
                <Mail size={16} aria-hidden="true" /> Contact the club
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
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
          <div className="about-home-footer">
            <p>
              Don’t just join Rotary. Join a club where you can begin serving
              from day one.
            </p>
            <a
              className="button blue-button"
              href="mailto:greaterrotaryeclub@gmail.com?subject=I%27d%20like%20to%20join%20Rotary%20E-Club%20of%20Greater%20Nigeria"
            >
              Reach out to join <ArrowUpRight size={16} aria-hidden="true" />
            </a>
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
            We bring people together to turn purpose into action. Explore the
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
