export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Experience",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "skills",
    title: "Skills",
  },
  {
    id: "testimonials",
    title: "Testimonials",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: "web.png",
  },
  {
    title: "React Developer",
    icon: "mobile.png",
  },
  {
    title: "Backend Developer",
    icon: "backend.png",
  },
  {
    title: "Cloud Engineer",
    icon: "creator.png",
  },
];

const technologies = [
  {
    name: "JavaScript",
    icon: "javascript.png",
  },
  {
    name: "TypeScript",
    icon: "typescript.png",
  },
  {
    name: "React JS",
    icon: "reactjs.png",
  },
  {
    name: "Next JS",
    icon: "nextjs.png",
  },
  {
    name: "Node JS",
    icon: "nodejs.png",
  },
  {
    name: "MongoDB",
    icon: "mongodb.png",
  },
  {
    name: "Three JS",
    icon: "threejs.svg",
  },
  {
    name: "git",
    icon: "git.png",
  },
  {
    name: "docker",
    icon: "docker.png",
  },
  {
    name: "Kubernetes",
    icon: "kubernetes.png",
  },
  {
    name: "Java",
    icon: "java.png",
  },
  {
    name: "Python",
    icon: "python.png",
  },
  {
    name: "C",
    icon: "c.png",
  },
  {
    name: "C++",
    icon: "cpp.png",
  },
  {
    name: "Go",
    icon: "go.png",
  },
  {
    name: "Kotlin",
    icon: "kotlin.png",
  },
];

const experiences = [
  {
    title: "MCA Student",
    company_name: "Christ University",
    icon: "christ.png",
    iconBg: "#383E56",
    date: "2024 - 2026",
    points: [
      "Pursuing Master of Computer Applications with focus on advanced computing concepts.",
      "Specializing in cloud computing and distributed systems.",
      "Participating in hackathons and coding competitions.",
      "Developing full-stack applications with modern technologies."
    ],
  },
  {
    title: "BCA Graduate",
    company_name: "Kristu Jayanti College",
    icon: "kristu.png",
    iconBg: "#E6DEDD",
    date: "2021 - 2024",
    points: [
      "Completed Bachelor of Computer Applications with distinction.",
      "Focused on building a strong foundation in computer science fundamentals.",
      "Actively participated in college tech events and competitions.",
      "Developed key programming skills across multiple languages and platforms."
    ],
  },
  {
    title: "National-Level Coding Competition Winner",
    company_name: "AAROHANA '23",
    icon: "trophy.png",
    iconBg: "#383E56",
    date: "2023",
    points: [
      "Won first place in the national-level coding competition.",
      "Demonstrated problem-solving skills and algorithmic thinking.",
      "Collaborated with team members to optimize solutions.",
      "Implemented complex algorithms under time constraints."
    ],
  },
  {
    title: "IT Manager",
    company_name: "SHELLS '25",
    icon: "manager.png",
    iconBg: "#E6DEDD",
    date: "2025",
    points: [
      "Managed IT infrastructure and technical resources for the college fest.",
      "Coordinated with various teams to ensure seamless technology integration.",
      "Troubleshooted technical issues in real-time during event execution.",
      "Implemented digital solutions to streamline event management."
    ],
  },
  {
    title: "Event Lead",
    company_name: "Xactitude & Synchronize",
    icon: "event.png",
    iconBg: "#383E56",
    date: "2022 - 2023",
    points: [
      "Led technical events in college fests, managing team of volunteers.",
      "Designed challenging coding and technical problem-solving competitions.",
      "Evaluated participant submissions and provided constructive feedback.",
      "Ensured smooth execution of events with proper technical setups."
    ],
  },
];

const projects = [
  {
    name: "DataVista",
    description:
      "Real-time stock analytics platform with interactive 3D visualizations for market trends and financial data. Designed for both casual investors and financial professionals.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "three.js",
        color: "green-text-gradient",
      },
      {
        name: "firebase",
        color: "pink-text-gradient",
      },
      {
        name: "kubernetes",
        color: "orange-text-gradient",
      },
    ],
    image: "/images/datavista.jpeg",
    source_code_link: "https://github.com/Absenior03/DataVista",
    live_demo_link: "https://example.com/",
  },
  {
    name: "Annapurna Tours",
    description:
      "A comprehensive tour booking platform for adventure seekers, featuring secure payment processing, interactive maps, and personalized itinerary creation for travelers.",
    tags: [
      {
        name: "next.js",
        color: "blue-text-gradient",
      },
      {
        name: "stripe",
        color: "green-text-gradient",
      },
      {
        name: "google maps",
        color: "pink-text-gradient",
      },
    ],
    image: "/images/annapurna.png",
    source_code_link: "https://github.com/Absenior03/AnnapurnaTravels",
    live_demo_link: "https://annapurna-travels.vercel.app/",
  },
  {
    name: "Process Scheduler Simulator",
    description:
      "C-based Linux process scheduling simulator with POSIX threads, visualization tools, and performance analytics for comparing different scheduling algorithms.",
    tags: [
      {
        name: "c",
        color: "blue-text-gradient",
      },
      {
        name: "posix",
        color: "green-text-gradient",
      },
      {
        name: "gantt charts",
        color: "pink-text-gradient",
      },
    ],
    image: "/images/scheduler.png",
    source_code_link: "https://github.com/Absenior03/process-scheduler-simulator",
    live_demo_link: "https://example.com/",
  },
];

const testimonials = [
  {
    testimonial:
      "Anirban's analytical thinking and problem-solving skills are exceptional. His ability to break down complex technical challenges is remarkable.",
    name: "Dr. Binayak",
    designation: "Associate Professor",
    company: "Christ University",
    image: "professor1.jpg",
  },
  {
    testimonial:
      "I've collaborated with Anirban on several projects. His coding standards and architectural decisions always ensure scalable and maintainable solutions.",
    name: "Somya Abichandani",
    designation: "Engineering Manager",
    company: "Corestrat",
    image: "colleague1.jpg",
  },
  {
    testimonial:
      "What sets Anirban apart is his dedication to performance optimization. He consistently delivers efficient code that runs seamlessly even under heavy loads.",
    name: "Gaurav Kumar",
    designation: "Business Analyst",
    company: "Cloudbyz",
    image: "colleague2.jpg",
  },
];

const skillCategories = [
  {
    title: "Programming Languages - Primary",
    skills: ["C++", "Java", "Python", "JavaScript (ES6+)", "TypeScript"],
  },
  {
    title: "Programming Languages - Mobile",
    skills: ["Dart (Flutter SDK)"],
  },
  {
    title: "Programming Languages - Systems & Scripting",
    skills: ["Go (Golang)", "C", "Bash/Shell"],
  },
  {
    title: "Programming Languages - Data",
    skills: ["SQL (PostgreSQL, MySQL)"],
  },
  {
    title: "Frontend & Mobile Development - Frameworks",
    skills: ["React 18", "Angular (17/18)", "Node.js", "Express.js"],
  },
  {
    title: "Frontend & Mobile Development - State Management",
    skills: ["Redux Toolkit (RTK Query)", "NgRx", "RxJS"],
  },
  {
    title: "Frontend & Mobile Development - UI & Visualization",
    skills: [
      "MUI 5 (Material UI)",
      "Tailwind CSS",
      "D3.js",
      "Chart.js",
      "ReactFlow",
      "Vite",
      "Webpack",
    ],
  },
  {
    title: "Frontend & Mobile Development - Mobile",
    skills: ["Flutter (Android/iOS cross-platform development)"],
  },
  {
    title: "Backend & Cloud Infrastructure - Cloud Platforms",
    skills: [
      "Amazon Web Services (AWS)",
      "Google Cloud Platform (GCP)",
      "Microsoft Azure (Portal & DevOps)",
    ],
  },
  {
    title: "Backend & Cloud Infrastructure - API Development",
    skills: ["FastAPI", "Flask", "Django", "RESTful APIs", "gRPC", "GraphQL"],
  },
  {
    title: "Backend & Cloud Infrastructure - Serverless",
    skills: ["AWS Lambda", "Google Cloud Run", "Cloud Functions"],
  },
  {
    title: "Backend & Cloud Infrastructure - Distributed Systems",
    skills: [
      "Microservices Architecture",
      "Event-Driven Design",
      "L7 Load Balancing",
      "VPC Peering",
    ],
  },
  {
    title: "Data Engineering & Databases - Big Data",
    skills: ["Apache Spark", "Apache Kafka", "ETL Pipelines"],
  },
  {
    title: "Data Engineering & Databases - Caching & Real-time",
    skills: ["Redis", "WebSockets (Socket.IO, WebRTC)"],
  },
  {
    title: "Data Engineering & Databases - Storage",
    skills: [
      "Google BigQuery",
      "Firestore",
      "Firebase",
      "Star Schema Modeling",
      "Columnar Databases",
    ],
  },
  {
    title: "DevOps & Observability - Containerization",
    skills: ["Docker", "Kubernetes (K8s)", "Helm"],
  },
  {
    title: "DevOps & Observability - Infrastructure as Code (IaC)",
    skills: ["Terraform"],
  },
  {
    title: "DevOps & Observability - CI/CD",
    skills: ["Azure DevOps", "GitHub Actions", "Jenkins"],
  },
  {
    title: "DevOps & Observability - Monitoring",
    skills: [
      "Prometheus",
      "Grafana",
      "CloudWatch",
      "Google Cloud Monitoring",
    ],
  },
  {
    title: "DevOps & Observability - Logging",
    skills: [
      "Relentless Auditing & Metric Monitoring",
      "Telemetry",
      "Log Analysis (Splunk)",
    ],
  },
  {
    title: "Security & Compliance - Identity",
    skills: ["OAuth 2.0", "OpenID Connect (OIDC)", "JWT", "Firebase Auth"],
  },
  {
    title: "Security & Compliance - Networking",
    skills: ["TLS/SSL Encryption", "DNS", "Firewalls"],
  },
  {
    title: "Security & Compliance - Standards",
    skills: [
      "FinTech Regulatory Compliance (KYC/AML)",
      "Zero-Trust Security",
      "IAM Policy Management",
      "WCAG 2.1 Accessibility",
    ],
  },
  {
    title: "Core Competencies - Computer Science",
    skills: [
      "Data Structures & Algorithms (DSA)",
      "System Design",
      "Object-Oriented Design (OOD)",
      "Functional Programming",
    ],
  },
  {
    title: "Core Competencies - Domain Expertise",
    skills: [
      "Localization (i18n)",
      "Multi-currency Logic",
      "FinTech Automation",
      "ATE (Automated Test Equipment)",
    ],
  },
  {
    title: "Core Competencies - Methodologies",
    skills: [
      "Agile/Scrum",
      "TDD (Test Driven Development)",
      "Root Cause Analysis (RCA)",
      "SDLC Documentation",
    ],
  },
];

export { services, technologies, experiences, testimonials, projects, skillCategories }; 