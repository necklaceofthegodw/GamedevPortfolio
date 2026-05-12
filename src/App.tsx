import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  FileText,
  Gamepad2,
  Mail,
  Mouse,
  Volume2,
  VolumeX,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const backgroundUrl = "/backgrounds/halfpipe-bg-04-skate-neon.png";
const musicUrl = "/OPM%20Heaven%20Is%20a%20Halfpipe.mp3";
const pathD =
  "M 180 375 C 178 560, 260 735, 436.5 827 C 590 907, 794 942, 980 940 C 1168 938, 1388 905, 1540.4 822.4 C 1690 741, 1735 555, 1733.5 384.5";

type SectionId = "about" | "projects" | "features" | "cv" | "contact";

const sectionRoutePositions = {
  about: 0,
  projects: 0.24380670983173452,
  features: 0.5050764845603399,
  cv: 0.7743726596881803,
  contact: 1,
} satisfies Record<SectionId, number>;

type Section = {
  id: SectionId;
  nav: string;
  label: string;
  teaser: string;
  icon: typeof UserRound;
  routePosition: number;
  labelSide: "left" | "right" | "above";
};

const cvEducation = [
  {
    date: "03.2018 - 11.2019",
    title: "Silesian University of Technology",
    detail:
      "Computer Science with specialization in computer graphics. Master thesis: Procedurally generated terrain models using fractal methods.",
  },
  {
    date: "10.2015 - 01.2018",
    title: "Silesian University of Technology",
    detail:
      "Interdisciplinary studies: Automatic Control and Robotics, Electronics and Telecommunication, Computer Science. Thesis: Osteoporosis Risk Calculator - 5-year probability of fracture.",
  },
];

const cvExperience = [
  {
    date: "11.2024 - now",
    title: "Warehouse Warrior (UE5)",
    detail:
      "My own project created from scratch: a warehouse worker box-pushing puzzle game. Learned how to release a game on Steam, create achievements, and use Steam Cloud for saves.",
  },
  {
    date: "08.2024 - 11.2024",
    title: "Cosmoscouts - Moon Mystery, UI Programmer (UE5)",
    detail:
      "Joined three months before release to fix UI bugs and make the interface match the design in a first-person shooter adventure game.",
  },
  {
    date: "06.2021 - 10.2023",
    title: "WeirdFish - Oddyssey: Your Space, Your Way, UI Programmer (UE4)",
    detail:
      "Implemented UI elements for a single-player and co-op space exploration game focused on resources, crew needs, and saving humanity.",
  },
  {
    date: "02.2021 - 02.2024",
    title: "Chemical Laboratory VR / 3D Geometry in VR, Trusense - Gameplay Programmer (UE4)",
    detail:
      "Built VR education simulations for chemistry and geometry lessons, including experiments and interactive 3D shape categories for schools.",
  },
  {
    date: "11.2020 - 02.2021",
    title: "AnimalShelter VR, Actum Lab - Gameplay Programmer (UE4)",
    detail:
      "Implemented VR pet-care mechanics such as washing the pet, fetching a ball, and snack vending machine interactions.",
  },
  {
    date: "03.2020 - 11.2020",
    title: "Horror Forest 3, Wenkly Studio - Gameplay Programmer (Unity)",
    detail:
      "Created testing tools for game difficulty and progression speed, and fixed gameplay systems including enemy aggro, weapon upgrades, and training.",
  },
  {
    date: "08.2019 - 03.2020",
    title: "Chernobylite, The Farm 51 - Junior Gameplay Programmer (UE4)",
    detail:
      "Fixed bugs, added features to existing systems, worked on dialogue creation tools, and rewrote the main menu with a new design.",
  },
];

const cvSkills = [
  "C#",
  "C++",
  "Unity",
  "Unreal Engine 5",
  "Git",
  "SVN",
  "Perforce",
  "HTML/CSS/JavaScript",
  "Java",
  "Excel / Word / PowerPoint",
];

const cvLanguages = ["English - C1", "German - Basic A2"];
const cvHobbies = ["Snowboarding", "Skateboarding", "Obstacle course racing", "RC cars, planes, and drones"];
const linkedInUrl = "https://www.linkedin.com/in/zbigniew-pamula/";
const contactEmail = "xiens2@gmail.com";

type ScrollStop = {
  sectionId: SectionId;
  panelIndex: number;
  routePosition: number;
};

type MotionState = {
  activeStop: number;
  routeProgress: number;
  rider: {
    x: number;
    y: number;
    angle: number;
  };
  markers: Array<{ x: number; y: number }>;
};

type PanelMedia =
  | {
      kind: "image";
      src: string;
      alt: string;
    }
  | {
      kind: "video";
      src: string;
      label: string;
    };

type Panel = {
  eyebrow: string;
  title: string;
  body?: string;
  stats: string[];
  media?: PanelMedia;
  href?: string;
};

const sections: Section[] = [
  {
    id: "about",
    nav: "About",
    label: "About Me",
    teaser: "Get to know me",
    icon: UserRound,
    routePosition: sectionRoutePositions.about,
    labelSide: "right",
  },
  {
    id: "projects",
    nav: "Projects",
    label: "Projects",
    teaser: "Games I've worked on",
    icon: BriefcaseBusiness,
    routePosition: sectionRoutePositions.projects,
    labelSide: "right",
  },
  {
    id: "features",
    nav: "Features",
    label: "Features",
    teaser: "Systems and mechanics",
    icon: Code2,
    routePosition: sectionRoutePositions.features,
    labelSide: "above",
  },
  {
    id: "cv",
    nav: "CV",
    label: "CV",
    teaser: "Experience and skills",
    icon: FileText,
    routePosition: sectionRoutePositions.cv,
    labelSide: "right",
  },
  {
    id: "contact",
    nav: "Contact",
    label: "Contact",
    teaser: "Let's connect",
    icon: Mail,
    routePosition: sectionRoutePositions.contact,
    labelSide: "left",
  },
];

const scrollStops: ScrollStop[] = [
  { sectionId: "about", panelIndex: 0, routePosition: sectionRoutePositions.about },
  { sectionId: "projects", panelIndex: 0, routePosition: sectionRoutePositions.projects },
  { sectionId: "projects", panelIndex: 1, routePosition: 0.33 },
  { sectionId: "projects", panelIndex: 2, routePosition: 0.42 },
  { sectionId: "features", panelIndex: 0, routePosition: sectionRoutePositions.features },
  { sectionId: "features", panelIndex: 1, routePosition: 0.59 },
  { sectionId: "features", panelIndex: 2, routePosition: 0.68 },
  { sectionId: "cv", panelIndex: 0, routePosition: sectionRoutePositions.cv },
  { sectionId: "contact", panelIndex: 0, routePosition: sectionRoutePositions.contact },
];

const sectionStartStops = sections.reduce(
  (map, section) => {
    map[section.id] = scrollStops.findIndex((stop) => stop.sectionId === section.id);
    return map;
  },
  {} as Record<SectionId, number>,
);

const panelContent: Record<SectionId, Panel[]> = {
  about: [
    {
      eyebrow: "About me",
      title: "Hello :)",
      body: "My name is Zbyszek and I'm a game developer. I started my journey with professional game development in 2019. Since then, I've gained a lot of experience implementing gameplay systems and UI elements. The thing I enjoy most in programming games is that every day I learn something new.\n\nAfter a hard day of solving bugs and thinking through problems, I like to clear my head by focusing on my hobbies: skateboarding, snowboarding, and obstacle course racing.",
      stats: ["Gameplay systems", "UI elements", "Game developer since 2019"],
    },
  ],
  projects: [
    {
      eyebrow: "Project 01",
      title: "Chernobylite",
      body: "Chernobylite is a survival-horror game focused on realistic graphics, photogrammetry, and story. I joined the team two months before the early access release and helped by fixing bugs, adding new features to existing systems, working on the dialogue creation tool, and rewriting the main menu with a new design.",
      stats: ["Survival horror", "Gameplay systems", "Dialogue tools"],
      href: "https://store.steampowered.com/app/1016800/Chernobylite_Enhanced_Edition/",
      media: {
        kind: "image",
        src: "/projects/chernobylite.jpg",
        alt: "Chernobylite project artwork",
      },
    },
    {
      eyebrow: "Project 02",
      title: "Oddyssey",
      body: "Oddyssey is an adventure game designed for single-player and co-op play. The game focuses on space exploration, collecting resources, and taking care of the crew's needs in order to save humanity. The game was published by 505 Games. I worked on it for two years and was responsible for implementing all UI elements according to the design.",
      stats: ["Adventure", "Co-op", "UI implementation"],
      href: "https://store.steampowered.com/app/1414230/Oddyssey_Your_Space_Your_Way/",
      media: {
        kind: "image",
        src: "/projects/oddyssey.jpg",
        alt: "Oddyssey project artwork",
      },
    },
    {
      eyebrow: "Project 03",
      title: "Laboratorium Chemiczne",
      body: "A VR simulation of a school science lab where students can perform different chemical experiments that would be hard to replicate in the real world. This project was developed for Nowa Era book publisher and is used in schools for chemistry lessons.",
      stats: ["VR simulation", "Education", "Chemistry lessons"],
      href: "https://www.nowaera.pl/wirtualne-laboratorium/czym-jest-wirtualne-laboratorium",
      media: {
        kind: "image",
        src: "/projects/chemia.png",
        alt: "Laboratorium Chemiczne project screenshot",
      },
    },
  ],
  features: [
    {
      eyebrow: "Feature reel",
      title: "Inventory system",
      body: "A scroll-through inventory system divided into four sections depending on the item type.",
      stats: [],
      media: {
        kind: "video",
        src: "/features/oddyssey_inventory.mp4",
        label: "Inventory system feature video",
      },
    },
    {
      eyebrow: "Feature reel",
      title: "Atom model",
      body: "A tool that generates atom models from a chemical formula, automatically creating electron shells, positioning electrons, and arranging protons and neutrons in a sphere.",
      stats: [],
      media: {
        kind: "video",
        src: "/features/chemia_model_atomu.mp4",
        label: "Atom model feature video",
      },
    },
    {
      eyebrow: "Feature reel",
      title: "Fetching Ball",
      body: "In PetsVR, you play with a little puppy and take care of his needs. For this interaction, you throw a ball and he brings it back to you.",
      stats: [],
      media: {
        kind: "video",
        src: "/features/PetsVR_FetchingBall.mp4",
        label: "Fetching Ball feature video",
      },
    },
  ],
  cv: [
    {
      eyebrow: "CV",
      title: "Experience Timeline",
      body: "A scrollable overview of my education, professional game development experience, skills, languages, and hobbies.",
      stats: ["Unity", "Unreal Engine", "Gameplay", "UI"],
    },
  ],
  contact: [
    {
      eyebrow: "Contact",
      title: "Let’s build something together.",
      body: "Reach out for polished gameplay code, UI implementation, tools, prototypes, or thoughtful game-feel work.",
      stats: ["LinkedIn", "Email", "Portfolio"],
    },
  ],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function interpolateRoute(stopProgress: number) {
  const maxIndex = scrollStops.length - 1;
  const scaled = clamp(stopProgress, 0, 1) * maxIndex;
  const left = Math.floor(scaled);
  const right = Math.min(left + 1, maxIndex);
  const local = scaled - left;

  return (
    scrollStops[left].routePosition +
    (scrollStops[right].routePosition - scrollStops[left].routePosition) * local
  );
}

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const targetProgressRef = useRef(0);
  const renderedProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const hasTriedMusicRef = useRef(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [motion, setMotion] = useState<MotionState>({
    activeStop: 0,
    routeProgress: scrollStops[0].routePosition,
    rider: { x: 180, y: 375, angle: 0 },
    markers: sections.map(() => ({ x: 0, y: 0 })),
  });

  const activeStop = scrollStops[motion.activeStop];
  const activeSection = sections.find((section) => section.id === activeStop.sectionId) ?? sections[0];
  const activePanel = panelContent[activeSection.id][activeStop.panelIndex] ?? panelContent[activeSection.id][0];
  const activePanelCount = panelContent[activeSection.id].length;

  const updateTargetProgress = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetProgressRef.current = maxScroll <= 0 ? 0 : clamp(window.scrollY / maxScroll, 0, 1);
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.28;

    try {
      await audio.play();
      setIsMusicPlaying(true);
    } catch {
      setIsMusicPlaying(false);
    }
  }, []);

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setIsMusicPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      void playMusic();
    }
  }, [isMusicPlaying, pauseMusic, playMusic]);

  useEffect(() => {
    const startMusicOnInteraction = () => {
      if (hasTriedMusicRef.current) {
        return;
      }

      hasTriedMusicRef.current = true;
      void playMusic();
    };

    window.addEventListener("click", startMusicOnInteraction, { once: true });
    window.addEventListener("keydown", startMusicOnInteraction, { once: true });
    window.addEventListener("scroll", startMusicOnInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", startMusicOnInteraction, { once: true, passive: true });
    window.addEventListener("wheel", startMusicOnInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("click", startMusicOnInteraction);
      window.removeEventListener("keydown", startMusicOnInteraction);
      window.removeEventListener("scroll", startMusicOnInteraction);
      window.removeEventListener("touchstart", startMusicOnInteraction);
      window.removeEventListener("wheel", startMusicOnInteraction);
    };
  }, [playMusic]);

  useEffect(() => {
    updateTargetProgress();
    window.addEventListener("scroll", updateTargetProgress, { passive: true });
    window.addEventListener("resize", updateTargetProgress);

    const tick = () => {
      const path = pathRef.current;
      const target = targetProgressRef.current;
      const current = renderedProgressRef.current;
      const next = Math.abs(target - current) < 0.001 ? target : current + (target - current) * 0.13;

      renderedProgressRef.current = next;

      if (path) {
        const pathLength = path.getTotalLength();
        const routeProgress = interpolateRoute(next);
        const distance = clamp(routeProgress, 0, 1) * pathLength;
        const point = path.getPointAtLength(distance);
        const tangent = path.getPointAtLength(clamp(distance + 8, 0, pathLength));
        const angle = (Math.atan2(tangent.y - point.y, tangent.x - point.x) * 180) / Math.PI;
        const normalAngle = ((angle - 90) * Math.PI) / 180;
        const riderOffset = 45;
        const endpointLift =
          Math.max(0, 1 - routeProgress / 0.12) * 34 +
          Math.max(0, 1 - (1 - routeProgress) / 0.12) * 34;
        const activeStopIndex = clamp(Math.round(next * (scrollStops.length - 1)), 0, scrollStops.length - 1);
        const markers = sections.map((section) => {
          const markerPoint = path.getPointAtLength(clamp(section.routePosition, 0, 1) * pathLength);
          return { x: markerPoint.x, y: markerPoint.y };
        });

        setMotion({
          activeStop: activeStopIndex,
          routeProgress,
          rider: {
            x: point.x + Math.cos(normalAngle) * riderOffset,
            y: point.y + Math.sin(normalAngle) * riderOffset - endpointLift,
            angle,
          },
          markers,
        });
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTargetProgress);
      window.removeEventListener("resize", updateTargetProgress);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTargetProgress]);

  const scrollToStop = useCallback((stopIndex: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = clamp(stopIndex / (scrollStops.length - 1), 0, 1);
    window.scrollTo({ top: maxScroll * progress, behavior: "smooth" });
  }, []);

  const sectionProgressText = useMemo(() => {
    if (activePanelCount === 1) {
      return "01 / 01";
    }

    return `${String(activeStop.panelIndex + 1).padStart(2, "0")} / ${String(activePanelCount).padStart(2, "0")}`;
  }, [activePanelCount, activeStop.panelIndex]);
  const mobileStopProgress =
    scrollStops.length <= 1 ? 0 : motion.activeStop / (scrollStops.length - 1);

  return (
    <main
      className="portfolio-scroll"
      style={{ "--scroll-stops": scrollStops.length } as React.CSSProperties}
    >
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      <section className="rider-stage" aria-label="Scroll-driven halfpipe portfolio">
        <img className="stage-background" src={backgroundUrl} alt="" />
        <div className="stage-shade" />
        <div className="viewport-frame" />

        <header className="guide-header">
          <nav className="guide-nav" aria-label="Portfolio sections">
            {sections.map((section) => (
              <button
                className={section.id === activeSection.id ? "nav-link is-active" : "nav-link"}
                key={section.id}
                type="button"
                onClick={() => scrollToStop(sectionStartStops[section.id])}
              >
                {section.nav}
              </button>
            ))}
          </nav>
        </header>

        <div className="billboard-copy" aria-hidden="true">
          <span>Building</span>
          <span>Playable</span>
          <span>Experiences</span>
        </div>

        <svg className="route-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                result="glow"
                values="1 0 0 0 0.98 0 0.55 0 0 0.37 0 0 0.08 0 0.02 0 0 0 0.8 0"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="skaterGlow" x="-45%" y="-45%" width="190%" height="190%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="outline" />
              <feFlood floodColor="#ff9a2e" floodOpacity="0.95" result="orange" />
              <feComposite in="orange" in2="outline" operator="in" result="orangeOutline" />
              <feGaussianBlur in="orangeOutline" stdDeviation="3" result="softGlow" />
              <feColorMatrix
                in="SourceGraphic"
                result="warmFigure"
                values="0 0 0 0 0.16
                        0 0 0 0 0.16
                        0 0 0 0 0.15
                        0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="orangeOutline" />
                <feMergeNode in="warmFigure" />
              </feMerge>
            </filter>
          </defs>
          <path className="route-glow" d={pathD} />
          <path ref={pathRef} className="route-line" d={pathD} />
          <g
            className="skater"
            style={{
              transform: `translate(${motion.rider.x}px, ${motion.rider.y}px) rotate(${motion.rider.angle}deg)`,
            }}
          >
            <ellipse className="skater-shadow" cx="0" cy="-9" rx="36" ry="7" />
            <image
              className="skater-image"
              href="/backgrounds/skateboarder.png"
              x="-37"
              y="-37"
              width="74"
              height="74"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </svg>

        <svg className="marker-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeSection.id;
            const markerPoint = motion.markers[sections.indexOf(section)];
            const objectWidth = section.labelSide === "above" ? 260 : 300;
            const objectHeight = section.labelSide === "above" ? 100 : 84;
            const objectX =
              section.labelSide === "left"
                ? markerPoint.x - objectWidth + 24
                : section.labelSide === "above"
                  ? markerPoint.x - objectWidth / 2
                  : markerPoint.x - 26;
            const objectY = section.labelSide === "above" ? markerPoint.y - 105 : markerPoint.y - 42;

            return (
              <foreignObject
                className="marker-object"
                key={section.id}
                x={objectX}
                y={objectY}
                width={objectWidth}
                height={objectHeight}
              >
                <button
                  className={`section-marker marker-${section.labelSide} ${
                    isActive ? "is-active" : ""
                  }`}
                  type="button"
                  onClick={() => scrollToStop(sectionStartStops[section.id])}
                >
                  <span className="marker-node">
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <span className="marker-copy">
                    <strong>{section.label}</strong>
                    <small>{section.teaser}</small>
                  </span>
                </button>
              </foreignObject>
            );
          })}
        </svg>

        <article
          className={`content-card ${activePanel.media ? "has-media" : ""} ${
            activePanel.body ? "" : "is-title-only"
          } ${activeSection.id === "cv" ? "is-cv" : ""}`}
          key={`${activeSection.id}-${activeStop.panelIndex}`}
        >
          {activeSection.id === "cv" ? (
            <div className="cv-panel">
              <div className="content-meta">
                <span>CV</span>
              </div>
              <h1>Experience Timeline</h1>
              <div className="cv-scroll" tabIndex={0}>
                <section className="cv-section">
                  <h2>Professional Experience</h2>
                  <div className="cv-timeline">
                    {cvExperience.map((item) => (
                      <article className="cv-entry" key={`${item.date}-${item.title}`}>
                        <time>{item.date}</time>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="cv-section">
                  <h2>Education</h2>
                  <div className="cv-timeline">
                    {cvEducation.map((item) => (
                      <article className="cv-entry" key={`${item.date}-${item.title}`}>
                        <time>{item.date}</time>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="cv-section">
                  <h2>Skills</h2>
                  <div className="cv-chip-grid">
                    {cvSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </section>

                <section className="cv-section cv-two-column">
                  <div>
                    <h2>Languages</h2>
                    <ul>
                      {cvLanguages.map((language) => (
                        <li key={language}>{language}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2>Hobbies</h2>
                    <ul>
                      {cvHobbies.map((hobby) => (
                        <li key={hobby}>{hobby}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <>
              <div className="content-copy">
                {activePanel.media ? null : (
                  <div className="content-meta">
                    <span>{activePanel.eyebrow}</span>
                    {activePanelCount === 1 ? null : <span>{sectionProgressText}</span>}
                  </div>
                )}
                {activePanel.media ? null : (
                  <h1>
                    {activePanel.href ? (
                      <a href={activePanel.href} target="_blank" rel="noreferrer">
                        {activePanel.title}
                      </a>
                    ) : (
                      activePanel.title
                    )}
                  </h1>
                )}
                {activePanel.body ? (
                  <div className="content-body">
                    {activePanel.body.split("\n\n").map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                {!activePanel.media && activePanel.stats.length > 0 ? (
                  activeSection.id === "contact" ? null : (
                    <div className="pill-row">
                      {activePanel.stats.map((stat) => (
                        <span key={stat}>{stat}</span>
                      ))}
                    </div>
                  )
                ) : null}
                {!activePanel.media && activePanel.href ? (
                  <a className="panel-action" href={activePanel.href} target="_blank" rel="noreferrer">
                    <ArrowUpRight size={16} aria-hidden="true" />
                    View project
                  </a>
                ) : null}
                {activeSection.id === "contact" ? (
                  <>
                    <a className="panel-action" href={linkedInUrl} target="_blank" rel="noreferrer">
                      <BriefcaseBusiness size={16} aria-hidden="true" />
                      LinkedIn
                    </a>
                    <a className="panel-action" href={`mailto:${contactEmail}`}>
                      <Mail size={16} aria-hidden="true" />
                      {contactEmail}
                    </a>
                  </>
                ) : null}
              </div>

              {activePanel.media ? (
                <div className={`panel-media panel-media-${activePanel.media.kind}`}>
                  <span className="media-title">{activePanel.title}</span>
                  {activePanel.media.kind === "image" ? (
                    activePanel.href ? (
                      <a href={activePanel.href} target="_blank" rel="noreferrer" aria-label={`Open ${activePanel.title}`}>
                        <img src={activePanel.media.src} alt={activePanel.media.alt} />
                      </a>
                    ) : (
                      <img src={activePanel.media.src} alt={activePanel.media.alt} />
                    )
                  ) : (
                    <video
                      aria-label={activePanel.media.label}
                      controls
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      src={activePanel.media.src}
                    />
                  )}
                </div>
              ) : null}
            </>
          )}
        </article>

        <section
          className="mobile-deck-shell"
          aria-label="Mobile skateboard deck portfolio"
          style={
            {
              "--mobile-stop-index": motion.activeStop,
              "--mobile-stop-count": scrollStops.length,
              "--mobile-progress": mobileStopProgress,
            } as React.CSSProperties
          }
        >
          <div className="mobile-rail">
            <div className="mobile-section-bolts">
              {sections.map((section) => {
                const Icon = section.icon;
                const stopIndex = sectionStartStops[section.id];
                const boltProgress = scrollStops.length <= 1 ? 0 : stopIndex / (scrollStops.length - 1);

                return (
                  <button
                    className={`mobile-section-bolt ${
                      section.id === activeSection.id ? "is-active" : ""
                    }`}
                    key={section.id}
                    type="button"
                    onClick={() => scrollToStop(stopIndex)}
                    aria-label={section.label}
                    style={{ "--bolt-progress": boltProgress } as React.CSSProperties}
                  >
                    <Icon size={13} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
            <div className="mobile-truck">
              <img src="/backgrounds/skate_truck.png" alt="" />
            </div>
          </div>

          <article
            className={`mobile-deck-card ${
              activePanel.media ? "has-media" : ""
            } ${activeSection.id === "cv" ? "is-cv" : ""}`}
            key={`mobile-${activeSection.id}-${activeStop.panelIndex}`}
          >
            <div className="mobile-deck-meta">
              <span>{activePanel.eyebrow}</span>
              <span>{sectionProgressText}</span>
            </div>

            {activeSection.id === "cv" ? (
              <>
                <h1>Experience Timeline</h1>
                <div className="mobile-cv-scroll" tabIndex={0}>
                  <section className="mobile-cv-section">
                    <h2>Professional Experience</h2>
                    <div className="mobile-cv-timeline">
                      {cvExperience.map((item) => (
                        <article className="mobile-cv-entry" key={`${item.date}-${item.title}`}>
                          <time>{item.date}</time>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mobile-cv-section">
                    <h2>Education</h2>
                    <div className="mobile-cv-timeline">
                      {cvEducation.map((item) => (
                        <article className="mobile-cv-entry" key={`${item.date}-${item.title}`}>
                          <time>{item.date}</time>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mobile-cv-section">
                    <h2>Skills</h2>
                    <div className="mobile-chip-grid">
                      {cvSkills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </section>

                  <section className="mobile-cv-section">
                    <h2>Languages & Hobbies</h2>
                    <div className="mobile-chip-grid">
                      {[...cvLanguages, ...cvHobbies].map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </section>
                </div>
              </>
            ) : (
              <>
                {activePanel.media ? (
                  <div className={`mobile-panel-media mobile-panel-media-${activePanel.media.kind}`}>
                    {activePanel.media.kind === "image" ? (
                      activePanel.href ? (
                        <a href={activePanel.href} target="_blank" rel="noreferrer" aria-label={`Open ${activePanel.title}`}>
                          <img src={activePanel.media.src} alt={activePanel.media.alt} />
                        </a>
                      ) : (
                        <img src={activePanel.media.src} alt={activePanel.media.alt} />
                      )
                    ) : (
                      <video
                        aria-label={activePanel.media.label}
                        controls
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        src={activePanel.media.src}
                      />
                    )}
                  </div>
                ) : null}

                <h1>
                  {activePanel.href ? (
                    <a href={activePanel.href} target="_blank" rel="noreferrer">
                      {activePanel.title}
                    </a>
                  ) : (
                    activePanel.title
                  )}
                </h1>

                {activePanel.body ? (
                  <div className="mobile-content-body">
                    {activePanel.body.split("\n\n").map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}

                {activePanel.stats.length > 0 && activeSection.id !== "contact" ? (
                  <div className="mobile-chip-grid">
                    {activePanel.stats.map((stat) => (
                      <span key={stat}>{stat}</span>
                    ))}
                  </div>
                ) : null}

                {activeSection.id === "contact" ? (
                  <div className="mobile-action-row">
                    <a className="mobile-panel-action" href={linkedInUrl} target="_blank" rel="noreferrer">
                      <BriefcaseBusiness size={16} aria-hidden="true" />
                      LinkedIn
                    </a>
                    <a className="mobile-panel-action" href={`mailto:${contactEmail}`}>
                      <Mail size={16} aria-hidden="true" />
                      Email
                    </a>
                  </div>
                ) : null}
              </>
            )}
          </article>

          <nav className="mobile-bottom-nav" aria-label="Mobile portfolio sections">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <button
                  className={section.id === activeSection.id ? "is-active" : ""}
                  key={section.id}
                  type="button"
                  onClick={() => scrollToStop(sectionStartStops[section.id])}
                  aria-label={section.label}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{section.nav}</span>
                </button>
              );
            })}
          </nav>
        </section>

        <div className="scroll-hint" aria-hidden="true">
          <Mouse size={18} />
          <span>Scroll to ride</span>
        </div>

        <div className="social-links" aria-label="Social links">
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? "Pause background music" : "Play background music"}
          >
            {isMusicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <a href="#github" onClick={(event) => event.preventDefault()} aria-label="GitHub">
            <Code2 size={18} />
          </a>
          <a href={linkedInUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <BriefcaseBusiness size={18} />
          </a>
          <a href={`mailto:${contactEmail}`} aria-label="Email">
            <Mail size={18} />
          </a>
          <a href="#portfolio" onClick={(event) => event.preventDefault()} aria-label="Portfolio action">
            <Gamepad2 size={18} />
          </a>
        </div>
      </section>
      <div className="scroll-space" aria-hidden="true" />
    </main>
  );
}

export default App;
