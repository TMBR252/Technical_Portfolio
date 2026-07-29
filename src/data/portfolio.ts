import { PortfolioData } from '@/types';

export const portfolioData: PortfolioData = {
    personal: {
        name: 'Tyler Bryan',
        title: 'Design & Product Engineer',
        subtitle: 'Design & Product Engineer · AI Focus | Crafting interfaces and systems where intelligence feels inevitable',
        bio: 'NYC-based Design & Product Engineer building AI-native products where interface craft and intelligent systems meet. I design and ship polished experiences — from agentic workflows and RAG tools to full-stack product surfaces — with a focus on clarity, motion, and production-ready engineering.',
        avatar: '/about/tyler.webp',
        location: 'New York, NY',
        email: '',
        phone: '',
        resumeUrl: '/resume',
        website: 'https://github.com/TMBR252/Product_Engineer_Portfolio',
        linktreeUrl: 'https://linktr.ee/EastDigital',
        languages: [
            { name: 'English', level: 'Native' },
        ],
        socialLinks: [
            {
                platform: 'GitHub',
                url: 'https://github.com/TMBR252',
                icon: 'github',
                username: 'TMBR252',
            },
            {
                platform: 'LinkedIn',
                url: 'https://www.linkedin.com/in/tylermebryan/',
                icon: 'linkedin',
                username: 'tylermebryan',
            },
            {
                platform: 'Instagram',
                url: 'https://www.instagram.com/eaststudio.design',
                icon: 'instagram',
                username: 'eaststudio.design',
            },
        ],
    },
    projects: [
        {
            id: 'project-1',
            slug: 'browser-automation-agent',
            title: 'Browser Automation Agent',
            description: 'A command-line interface (CLI) tool for AI-driven browser automation.',
            longDescription: 'Agent Browser is a command-line interface (CLI) tool for AI-driven browser automation. Built on top of browser-use, this tool allows you to command an AI agent to perform complex browser interactions, scraping, and testing using natural language.',

            techStack: ['Python 3.11+', 'browser-use', 'Gemini', 'Groq'],
            tools: ['VS Code', 'CLI', 'uv'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#',
            startDate: '2026-04-01',
            role: 'AI Engineer',
            customTimeline: 'April 2026',
            team: 'Personal Project',

            highlights: ['Natural Language Control', 'Multiple LLM Support', 'Smart Rate Limiting'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Core Capabilities',
                    items: [
                        '**Natural Language Control**: Command the browser to navigate, click, fill forms, and extract information using simple text prompts.',
                        '**Multiple LLM Support**: Easily toggle between powerful models like Google Gemini and Groq.',
                        '**Vision Mode**: Support for standard screen rendering capability for complex sites.'
                    ]
                },
                {
                    title: 'Performance & Optimization',
                    items: [
                        '**Smart Rate Limiting**: Built-in delay mechanism and fallback handling to gracefully circumvent free-tier API rate limits.',
                        '**CLI Workflows**: Execute fast actions directly from your terminal using robust CLI commands.',
                        '**Optimized Setup**: Seamless dependency management using standard virtual environment or uv.'
                    ]
                },
                {
                    title: 'Logging & Outputs',
                    items: [
                        '**Execution Traces**: Application logs are automatically written to the logs/ directory for easy debugging.',
                        '**Data Exports**: Any graphical outputs (like screenshots from Vision mode) or data exports are saved to the outputs/ directory.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Clone and Setup',
                    code: 'git clone <repository-url>\ncd Browser-Automation-Agent\npython -m venv venv\nvenv\\Scripts\\activate',
                    type: 'code'
                },
                {
                    title: 'Install Dependencies',
                    code: 'pip install -e .',
                    type: 'code'
                },
                {
                    title: 'Environment Configuration',
                    code: 'cp .env.example .env\n# Fill in GOOGLE_API_KEY or GROQ_API_KEY',
                    type: 'code'
                },
                {
                    title: 'Run Agent',
                    code: 'agentbrowser run --help\nagentbrowser run "Search for US federal holidays 2026 on Google and summarize"',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "API Rate Limits Exhaustion",
                    solution: "Implemented a smart rate limiting delay mechanism and fallback handling to gracefully circumvent free-tier API restrictions (e.g., Gemini 15 RPM Free Tier)."
                },
                {
                    problem: "Complex DOM Navigation",
                    solution: "Integrated a Vision Mode to capture screenshots and allow the LLM to process visual context for dynamically rendered sites."
                },
                {
                    problem: "Command-Line Interface Scalability",
                    solution: "Engineered a robust CLI framework offering specific workflow executions, dynamic LLM toggling (--llm gemini), and vision toggles (--vision)."
                }
            ]
        },
        {
            id: 'project-2',
            slug: 'swarm-agent-orchestrator',
            title: 'Swarm AI Blog Writer',
            image: '/project/swarmaiblogwriter1.webp',
            description: 'Intelligent multi-agent system built with Vue 3, integrating multiple LLMs for automated, high-quality blog generation.',
            longDescription: 'Swarm AI Blog Writer is a production-grade, multi-agent blog generation engine where multiple specialized AI agents orchestrate in a synchronized pipeline to create long-form, research-backed blog posts exported as professional PDF reports. Powered by Pydantic AI structured validation and Groq\'s Llama 3.3 70B, the system features a Planner, Researcher, Writer, and Editor agent working in harmony. A premium SaaS-grade Vue.js 3 frontend with GSAP animations and a bento-grid layout delivers the interaction layer, while a serverless Flask backend handles AI inference and PDF generation.',

            techStack: ['Vue.js 3', 'Vite 5', 'TypeScript', 'Tailwind CSS 3', 'GSAP 3', 'Python', 'Flask', 'Pydantic v2', 'Groq API', 'Llama 3.3 70B', 'FPDF2'],
            tools: ['VS Code', 'Vercel', 'Postman', 'GitHub'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#',
            startDate: '2025-03-01',
            role: 'AI Engineer & Full Stack Developer',
            customTimeline: 'March 2025',
            team: 'Personal Project',

            highlights: ['Multi-Agent Orchestration', '70B LLM via Groq', 'Professional PDF Export'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Multi-Agent Orchestration',
                    items: [
                        '**Planner Agent**: Generates a structured 5-section blog outline validated by Pydantic v2 schemas before passing to the next stage.',
                        '**Researcher Agent**: Performs deep-dive research for each section using Llama 3.3 70B, enriching content with factual context.',
                        '**Writer Agent**: Crafts the final 1000+ word Markdown article from the research data, ensuring stylistic coherence.',
                        '**Editor Agent**: Reviews and refines the draft for clarity, grammar, and professional tone before PDF export.'
                    ]
                },
                {
                    title: 'Premium SaaS Frontend',
                    items: [
                        '**Vue.js 3 + GSAP**: Fluid, GSAP-powered animations on a high-contrast minimalist interface for a premium feel.',
                        '**Bento-Grid Layout**: Modern card-based feature showcase using Tailwind CSS 3 for a polished SaaS aesthetic.',
                        '**Live Generation Panel**: Real-time progress feed showing agent pipeline status as the blog is being generated.',
                        '**Lucide VueNext Icons**: Consistent, scalable icon system integrated throughout the UI components.'
                    ]
                },
                {
                    title: 'AI & Validation Pipeline',
                    items: [
                        '**Pydantic v2 Schemas**: Strict structured validation (BlogPlan, FinalBlog) enforced at each agent handoff to prevent hallucinated outputs.',
                        '**Groq Inference**: Standardized on Llama 3.3 70B via Groq API for superior reasoning speed and schema adherence.',
                        '**5-Section Planning**: Comprehensive outline generation covering introduction, body sections, and conclusion for long-form articles.'
                    ]
                },
                {
                    title: 'Infrastructure & Deployment',
                    items: [
                        '**Serverless Architecture**: Flask backend structured as a flat, serverless-compatible API for Vercel deployment.',
                        '**Professional PDF Export**: Automatic Markdown-to-PDF rendering via FPDF2 with automated artifact cleanup after delivery.',
                        '**Vercel Routing**: `vercel.json` routes all `/api/*` requests to the Flask serverless handler; Vite-built frontend served from `dist/`.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Clone the Repository',
                    code: 'git clone <repository-url>\ncd Swarm-Agent-Orchestrator',
                    type: 'code'
                },
                {
                    title: 'Install Frontend Dependencies',
                    code: 'npm install',
                    type: 'code'
                },
                {
                    title: 'Install Backend Dependencies',
                    code: 'pip install -r requirements.txt',
                    type: 'code'
                },
                {
                    title: 'Environment Configuration',
                    code: '# Create .env in the root directory\nGROQ_API_KEY=your_groq_key_here',
                    type: 'code'
                },
                {
                    title: 'Run Development Servers',
                    code: '# Terminal 1 — Frontend\nnpm run dev\n\n# Terminal 2 — Backend\npython api/index.py\n# Visit http://localhost:5173',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: 'Agent Pipeline Validation Failures',
                    solution: 'Enforced strict Pydantic v2 schemas (BlogPlan, FinalBlog) at every agent handoff boundary. Any malformed LLM output triggers a re-prompt before the pipeline advances, ensuring 100% schema-valid data flow.'
                },
                {
                    problem: 'Serverless Cold-Start Latency',
                    solution: 'Restructured the Flask application into a flat, serverless-compatible API layout for Vercel, minimizing dependency loading overhead and achieving sub-400ms cold-start initialization.'
                },
                {
                    problem: 'PDF Encoding Artifacts',
                    solution: 'Built a custom Markdown sanitization layer before FPDF2 rendering that strips unsupported Unicode characters and normalizes heading/emphasis syntax, producing clean, professional PDF output without encoding errors.'
                }
            ]
        },
        {
            id: 'project-3',
            slug: 'creative-portfolio-website',
            title: 'Creative Portfolio Website',
            image: '/project/creativeportfoliowebsite1.webp',
            description: 'Modern, animated portfolio with 3D elements and smooth animations.',
            longDescription: 'A production-grade creative portfolio engineered to demonstrate high-level proficiency in Artificial Intelligence, Blockchain, and Modern Web Architectures. This platform transcends traditional static websites by offering a high-performance interactive experience powered by advanced WebGL shaders, physics-based simulations, and real-time data integration. It serves as a living laboratory for experimenting with cutting-edge frontend technologies while maintaing strict accessibility and SEO standards.',

            techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'GSAP'],
            tools: ['VS Code', 'Figma', 'GitHub'],
            status: 'completed',
            demoUrl: '#',
            repoUrl: '#',
            startDate: '2025-01-20',
            highlights: ['3D animations', 'Scroll effects', 'Bilingual EN/ID'], // Keep for backward compatibility if needed, or rely on features
            category: 'Creative Tech',
            features: [
                {
                    title: 'Immersive 3D Experience',
                    items: [
                        '**Interactive 3D Lanyard**: A physics-simulated 3D ID Card in the hero section that reacts to mouse movements.',
                        '**Hyperspeed Backgrounds**: Custom shader-based warp effects for a futuristic Web3 aesthetic.',
                        '**Particle Systems**: Dynamic background particles that enhance depth and interactivity.'
                    ]
                },
                {
                    title: 'Professional Insights',
                    items: [
                        '**Real-time Coding Stats**: Integrated WakaTime cards showing your top languages and coding activity.',
                        '**Dynamic GitHub Metrics**: Live cards displaying repository stats and contributions.',
                        '**Interactive Timeline**: A visual journey of your career across design and product engineering roles.'
                    ]
                },
                {
                    title: 'Performance & UX',
                    items: [
                        '**Bilingual (EN/ID)**: Complete internationalization support.',
                        '**Smooth Scroll**: Lenis-based smooth scrolling for a premium feel.',
                        '**Theme Engine**: System-preferred dark/light mode with a custom "Click Spark" effect.',
                        '**Responsive Architecture**: Pixel-perfect layouts for mobile, tablet, and desktop.'
                    ]
                },
                {
                    title: 'Scalable Ecosystem',
                    items: [
                        '**Modular Components**: Atomic design architecture for maximum reusability.',
                        '**Type Safety**: Full TypeScript implementation for robust code reliability.',
                        '**SEO Optimized**: Semantic HTML and meta tags for maximum visibility.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Clone the Repository',
                    code: 'git clone <repository-url>\ncd PersonalBlog',
                    type: 'code'
                },
                {
                    title: 'Install Dependencies',
                    code: 'npm install',
                    type: 'code'
                },
                {
                    title: 'Environment Variables',
                    type: 'text',
                    code:
                        `Create a .env.local file in the root directory:

NEXT_PUBLIC_GITHUB_USERNAME=TMBR252
WAKATIME_API_KEY=your_wakatime_key`
                },
                {
                    title: 'Launch Development Server',
                    code: 'npm run dev',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Performance Bottlenecks with Heavy 3D Assets",
                    solution: "Engineered a custom rendering pipeline using Instanced Meshes and aggressive DRaco compression, reducing initial load time by 60% while maintaining a consistent 60 FPS on mobile devices through dynamic quality scaling."
                },
                {
                    problem: "Seamless State Synchronization",
                    solution: "Implemented a robust global state management system using Zustand to orchestrate complex interactions between the React UI layer and the 3D Canvas, ensuring perfectly synchronized animations without prop-drilling overhead."
                },
                {
                    problem: "Cross-Browser Shader Compatibility",
                    solution: "Developed fallback materials and uniform-based capability detection to ensure the custom GLSL shaders render correctly across inconsistent WebGL implementations on Safari and older Android browsers."
                }
            ],

        },
        {
            id: 'project-6',
            slug: 'docsinsight-engine',
            title: 'DocsInsight Engine',
            description: 'Enterprise RAG System for intelligent document analysis.',
            longDescription: 'DocsInsight Engine is a high-performance, private Retrieval-Augmented Generation (RAG) platform. It allows users to upload complex documents and interact with them through a neural search interface powered by local Large Language Models (LLMs). Built on a robust Python/Flask backend and orchestrated by LangChain, it ensures sensitive data never leaves your infrastructure while delivering enterprise-grade search capabilities.',

            techStack: ['Python', 'Flask', 'LangChain', 'Ollama', 'ChromaDB', 'Docker'],
            tools: ['VS Code', 'Docker', 'Ollama'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Set to '#' to trigger specific disabled state
            startDate: '2024-11-01',
            role: 'AI Engineer',
            customTimeline: 'Oct - Nov 2025',

            highlights: ['Local LLM Execution', 'Multi-Format Support', 'Neural Retrieval'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Core Capabilities',
                    items: [
                        '**Multi-Format Support**: Seamlessly process PDF, DOCX, XLSX, CSV, and TXT files.',
                        '**Privacy-Centric**: Fully local execution using **Ollama**. Your sensitive data never leaves your infrastructure.',
                        '**Neural Retrieval**: Uses **ChromaDB** for high-speed vector similarity search.'
                    ]
                },
                {
                    title: 'Modern Interface',
                    items: [
                        '**Glassmorphism UI**: A sleek, dark-themed interface with real-time markdown rendering.',
                        '**Code Highlighting**: Automatic syntax highlighting for technical responses.',
                        '**Source Verification**: Every answer comes with citations from uploaded documents to prevent hallucinations.'
                    ]
                },
                {
                    title: 'Technical Architecture',
                    items: [
                        '**Backend**: Python 3.11 with Flask and LangChain orchestration.',
                        '**Vector DB**: ChromaDB for persistent document embeddings.',
                        '**One-Command Setup**: Production-ready deployment with Docker and Docker Compose.'
                    ]
                },
                {
                    title: 'System Insights',
                    items: [
                        '**Scalability**: The `VectorStoreManager` handles multiple documents simultaneously by filtering searches based on unique file hashes.',
                        '**Performance**: Document chunking is optimized with a `1000` character size and `200` character overlap.',
                        '**Security**: Strictly enforced policies to prevent sensitive credentials (`.env`) or local databases from being exposed.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Clone and Setup',
                    code: 'git clone <repository-url>\ncd rag-docsinsight-engine',
                    type: 'code'
                },
                {
                    title: 'Launch with Docker',
                    code: 'docker-compose up --build',
                    type: 'code'
                },
                {
                    title: 'Access Application',
                    code: 'Open http://localhost:5000',
                    type: 'text'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Scalability with Multiple Documents",
                    solution: "Designed a `VectorStoreManager` that filters searches based on unique file hashes, allowing the system to handle multiple uploaded documents simultaneously without cross-contamination."
                },
                {
                    problem: "Context Window Efficiency",
                    solution: "Optimized document chunking with a 1000-character size and 200-character overlap to maintain context coherence while fitting within the Llama 3 context window."
                },
                {
                    problem: "Data Security",
                    solution: "Implemented strict `.dockerignore` and `.gitignore` policies to prevent sensitive credentials (`.env`) or local vector databases from being leaked to version control."
                }
            ]
        },
        {
            id: 'project-8',
            slug: 'security-automation-genai',
            title: 'Security Automation with GenAI',
            description: 'AI-driven cybersecurity threat detection system using Transformers.',
            longDescription: 'Security Automation with GenAI is a research-driven project exploring the intersection of deep learning and cybersecurity. It leverages state-of-the-art Transformer architectures and Adaptive Attention mechanisms to automate the detection of complex threats like SQL Injection, DDoS, and network intrusions, providing a robust defense framework for modern digital infrastructures.',

            techStack: ['Python', 'TensorFlow', 'Keras', 'Transformers', 'Pandas', 'Scikit-learn', 'Adaptive Attention'],
            tools: ['VS Code', 'Jupyter Notebook', 'Google Colab', 'Wireshark'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Research-based platform
            startDate: '2024-09-01',
            role: 'AI Developer',
            customTimeline: 'Nov - Dec 2025',
            team: 'SOC Intern Project',

            highlights: ['Transformer-Based SQLi Detection', 'Adaptive Attention for DDoS', 'Multi-Modal Data Fusion'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Threat Intelligence',
                    items: [
                        '**SQLi Transformer**: Contextual learning model that recognizes malicious SQL patterns in HTTP requests.',
                        '**Phishing BERT**: Bidirectional analysis of URLs and email text to identify deceptive social engineering attempts.',
                        '**Malware Classification**: Network traffic sequence analysis to detect C2 communications.'
                    ]
                },
                {
                    title: 'Network Defense',
                    items: [
                        '**Adaptive DDoS Protection**: Real-time traffic analysis using dynamic attention weights for spike detection.',
                        '**Intrusion Detection**: High-precision classification of unauthorized access patterns using UNSW-NB15 datasets.',
                        '**MitM Identification**: Anomaly detection in communication sequences to identify packet interception.'
                    ]
                },
                {
                    title: 'Research Domains',
                    items: [
                        '**Zero-Day Detection**: Unsupervised learning approach to identify previously unmapped attack behaviors.',
                        '**Ransomware Prediction**: Sequence modeling for sudden encryption patterns in packet data.',
                        '**Insider Threat Analysis**: Comprehensive user activity log analysis for unusual access patterns.'
                    ]
                },
                {
                    title: 'Performance Analytics',
                    items: [
                        '**Comprehensive Metrics**: Evaluation using precision-recall curves, F1-scores, and confusion matrices.',
                        '**Visual Insights**: Deep data distribution analysis using Matplotlib and Seaborn.',
                        '**Temporal Analysis**: Understanding data flow over time to identify slow-burning APT (Advanced Persistent Threats).'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Setup Environment',
                    code: 'git clone <repository-url>\ncd security-automation-ai-genai\n# Recommended: use a virtual environment',
                    type: 'code'
                },
                {
                    title: 'Install Dependencies',
                    code: 'pip install tensorflow pandas numpy matplotlib seaborn scikit-learn jupyter',
                    type: 'code'
                },
                {
                    title: 'Run Research Notebooks',
                    code: 'cd [target_source_dir]\njupyter notebook\n# Open the .ipynb files in the notebook subdirectory',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Signature-Based Limitations",
                    solution: "Transformed security operations by implementing Transformer models that learn from behavior and context rather than static signatures."
                },
                {
                    problem: "Dynamic Attack Patterns",
                    solution: "Developed an Adaptive Attention mechanism that dynamically adjusts focus to specific traffic segments during active DDoS attempts."
                },
                {
                    problem: "Multi-Modal Data Synchronization",
                    solution: "Engineered a data fusion pipeline to integrate network traffic, file logs, and process behavior into a unified Transformer input layer."
                }
            ]
        },
        {
            id: 'project-9',
            slug: 'web3-guestbook-dapp',
            title: 'Web3 Guestbook DApp',
            description: 'Decentralized guestbook on Ethereum allowing for immutable messages.',
            longDescription: 'Web3GuestbookDapp is a decentralized application that bridges modern Web2 interfaces with the Ethereum blockchain. It allows users to connect their MetaMask wallets and sign a persistent guestbook, creating immutable records of their visit. The project demonstrates the full lifecycle of a DApp, from smart contract development with Solidity to a responsive frontend built with Next.js.',

            techStack: ['Solidity', 'Hardhat', 'Next.js', 'Ethereum', 'Web3.js', 'MetaMask', 'Ethers.js'],
            tools: ['VS Code', 'MetaMask', 'Remix IDE', 'Vercel'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#',
            startDate: '2025-01-01',
            role: 'Blockchain Developer',
            customTimeline: 'Jan - Feb 2026',
            team: 'Personal Project',

            highlights: ['Immutable Blockchain Records', 'MetaMask Integration', 'Smart Contract Automation'],
            category: 'Blockchain',
            features: [
                {
                    title: 'Wallet Integration',
                    items: [
                        '**MetaMask Connection**: Seamless user authentication through industry-standard Web3 providers.',
                        '**Account Status**: Real-time monitoring of wallet connection and network synchronization.',
                        '**Auto-Recovery**: Graceful handling of network switches and account changes.'
                    ]
                },
                {
                    title: 'Blockchain Logic',
                    items: [
                        '**Solidity Smart Contract**: Robust logic for managing guestbook entries stored on-chain.',
                        '**Hardhat Environment**: Comprehensive suite for testing, compiling, and deploying contracts.',
                        '**Immutable Logs**: Every signature is a permanent transaction on the Ethereum network.'
                    ]
                },
                {
                    title: 'Real-time Interaction',
                    items: [
                        '**Auto-Fetch Feed**: Instant update of guestbook entries upon successful blockchain confirmation.',
                        '**Transaction Feedback**: Visual indicators for transaction pending, success, and error states.',
                        '**Wave Reactions**: Interactive "Wave" feature that sends a blockchain-verified greeting.'
                    ]
                },
                {
                    title: 'Optimized Frontend',
                    items: [
                        '**Next.js 14**: High-performance interface with optimized rendering and asset delivery.',
                        '**Tailwind Styling**: Modern, clean UI designed for a professional Web3 experience.',
                        '**ABI Bridge**: Secure integration between Javascript logic and the smart contract interface.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Clone & Install',
                    code: 'git clone <repository-url>\ncd web3guestbookdapp\nnpm install',
                    type: 'code'
                },
                {
                    title: 'Blockchain Setup',
                    code: 'cd backend\nnpx hardhat node\n# In a new terminal:\nnpx hardhat run scripts/deploy.js --network localhost',
                    type: 'code'
                },
                {
                    title: 'Frontend Configuration',
                    code: 'cd ../frontend\n# Update contract-address.json with the deployed address\nnpm run dev',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Blockchain Nonce Desynchronization",
                    solution: "Implemented a custom activity reset workflow and state-sync logic to handle cases where local blockchain resets caused mismatching nonces in MetaMask."
                },
                {
                    problem: "Contract ABI Management",
                    solution: "Automated the ABI extraction process into the frontend environment to ensure the bridge between Web2 and Web3 remains perfectly aligned during contract updates."
                },
                {
                    problem: "Ethereum Event Handling",
                    solution: "Utilized Ethers.js event listeners to trigger UI updates directly from the blockchain state, ensuring the feed remains real-time without polling."
                }
            ]
        },
        {
            id: 'project-13',
            slug: 'deep-learning-image-classifier',
            title: 'Deep Learning Image Classifier',
            description: 'Interactive educational platform for visualizing CNN and Transfer Learning mechanics.',
            longDescription: 'The Deep Learning Image Classifier is an interactive educational platform designed to demystify the inner workings of Convolutional Neural Networks (CNN) and Transfer Learning. Built with Streamlit and TensorFlow, the application provides real-time visualizations of image preprocessing, RGB channel analysis, convolution operations, and intermediate feature maps, allowing users to watch as the model extracts features and reaches a classification decision.',

            techStack: ['Python', 'TensorFlow', 'Keras', 'Streamlit', 'Plotly', 'NumPy', 'SciPy', 'MobileNetV2', 'Pillow'],
            tools: ['Jupyter Notebook', 'Google Colab', 'Streamlit Cloud', 'VS Code'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: 'https://ca-modul03-handson.streamlit.app/',
            startDate: '2024-06-01',
            role: 'AI Research Engineer',
            customTimeline: 'Nov 2025',
            team: 'Personal Project',

            highlights: ['Real-time Feature Map Visualization', 'Interactive Layer Breakdown', 'CNN vs Transfer Learning Comparison'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Interactive Analytics',
                    items: [
                        '**RGB Matrix Analysis**: Dynamic heatmaps and histograms for detailed color channel decomposition.',
                        '**Feature Map Extraction**: Live visualization of intermediate layer outputs to understand what the model "sees".',
                        '**Prediction Confidence**: Interactive probability distributions and confidence meters for classification results.'
                    ]
                },
                {
                    title: 'Architecture Deep-Dive',
                    items: [
                        '**Custom CNN Workflow**: Step-by-step breakdown of a 3-layer convolutional network for hand gesture recognition.',
                        '**Conv Operations**: Real-time demonstration of filters extracting edges, textures, and patterns.',
                        '**MobileNetV2 Integration**: Implementation of pre-trained ImageNet models for high-accuracy Cheetah vs Hyena classification.'
                    ]
                },
                {
                    title: 'Model Learning',
                    items: [
                        '**Transfer Learning Mechanics**: Visual explanation of frozen base models and custom classifier fine-tuning.',
                        '**Hyperparameter Insights**: Interactive Sliders to adjust visualization parameters and model thresholds.',
                        '**Performance Reporting**: Detailed accuracy and loss metrics comparison between custom and pre-trained architectures.'
                    ]
                },
                {
                    title: 'Educational UX',
                    items: [
                        '**Progressive Visualization**: Managed learning path from raw image input to final classification probability.',
                        '**Interactive Documentation**: Integrated explanations of convolution, pooling, and activation functions.',
                        '**Dual-Model Comparison**: Parallel demonstration of standard CNN vs state-of-the-art Transfer Learning (MobileNetV2).'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Environment Setup',
                    code: 'git clone <repository-url>\ncd CA-Modul03-HandsOn\npython -m venv venv\nsource venv/bin/activate',
                    type: 'code'
                },
                {
                    title: 'Install Dependencies',
                    code: 'pip install -r requirements.txt',
                    type: 'code'
                },
                {
                    title: 'Launch Platform',
                    code: 'streamlit run app.py',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Intermediate Activation Capture",
                    solution: "Constructed sub-models using the Keras Functional API to extract output tensors from specific intermediate layers without interrupting the main inference pipeline."
                },
                {
                    problem: "High-Resolution Heatmap Lag",
                    solution: "Optimized RGB intensity distributions using Plotly's WebGL-accelerated rendering and data downsampling for ultra-smooth interactive charts."
                },
                {
                    problem: "Limited Computation on Edge",
                    solution: "Utilized depthwise separable convolutions from MobileNetV2 to achieve 96%+ accuracy while maintaining low-latency inference on standard CPU-based instances."
                }
            ]
        },
        {
            id: 'project-14',
            slug: 'ai-book-discovery-platform',
            title: 'AI Book Discovery Platform',
            description: 'Local RAG-based book recommendation system with semantic search.',
            longDescription: 'The AI Book Discovery Platform is an intelligent recommendation system that moves beyond simple keyword matching to understand the semantic context of user queries. Powered by Ollama, it leverages the \"nomic-embed-text\" model for vector-based search and \"llama3.2:1b\" for expert-level book analysis. The entire system runs 100% locally, ensuring complete user privacy while providing deep insights into search intent and reader profiling.',

            techStack: ['Python', 'Streamlit', 'Ollama', 'LangChain', 'Nomic Embed', 'Llama 3.2', 'Pandas', 'Scikit-learn'],
            tools: ['VS Code', 'Ollama Runtime', 'Streamlit Cloud', 'Jupyter Notebook'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Local AI service
            startDate: '2024-05-01',
            role: 'Ai & Software Developer',
            customTimeline: 'Oct - Nov 2025',
            team: 'Personal Project',

            highlights: ['Semantic Search Engine', '100% Local LLM Inference', 'Privacy-First Architecture'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Search Architecture',
                    items: [
                        '**Semantic Discovery**: Natural language understanding using vector embeddings to find books by theme and intent.',
                        '**Vector Search**: Implementation of Cosine Similarity algorithms to rank matches by semantic relevance.',
                        '**Contextual Logic**: Ability to find relevant titles even without matching exact keywords in descriptions.'
                    ]
                },
                {
                    title: 'Local AI Intelligence',
                    items: [
                        '**LLM Analysis**: Leveraging Llama 3.2 to generate expert book reviews, summaries, and audience insights.',
                        '**Query Decomposition**: Intelligent breakdown of user search descriptions to identify hidden reading preferences.',
                        '**Reader Profiling**: AI-generated reports on the user\'s reading style based on their historical search history.'
                    ]
                },
                {
                    title: 'Data Management',
                    items: [
                        '**Curated Datasets**: Pre-loaded collection of diverse literature for immediate discovery.',
                        '**Custom Ingestion**: Support for user-uploaded CSV datasets to enable search across personal libraries.',
                        '**Dynamic Tabulation**: Real-time processing and ranking of large book catalogs using optimized Pandas pipelines.'
                    ]
                },
                {
                    title: 'Privacy & Performance',
                    items: [
                        '**Edge Computing**: 100% local inference via Ollama, ensuring no data ever leaves the user\'s machine.',
                        '**Inference Optimization**: Fine-tuned model parameters (top_k, temperature) to balance generation speed and analytical depth.',
                        '**Responsive UI**: Instant feedback loops in Streamlit for embedding generation and generation status.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Ollama Setup',
                    code: 'ollama pull nomic-embed-text\nollama pull llama3.2:1b\n# Ensure Ollama serve is running',
                    type: 'code'
                },
                {
                    title: 'Environment Launch',
                    code: 'git clone <repository-url>\npip install -r requirements.txt\nstreamlit run OllamaLLM.py',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Vector Storage Overhead",
                    solution: "Developed an on-demand embedding generation and caching strategy for local datasets to eliminate the need for an external vector database."
                },
                {
                    problem: "LLM Hallucination Control",
                    solution: "Implemented strict system prompts and few-shot examples within the RAG pipeline to ensure generated reviews stay grounded in the provided book metadata."
                },
                {
                    problem: "System Resource Management",
                    solution: "Optimized the transition between the embedding model and generative model to prevent VRAM spikes on machines with limited hardware."
                }
            ]
        },
        {
            id: 'project-16',
            slug: 'neurovision-real-time-detection',
            title: 'NeuroVision (Real-time Detection)',
            description: 'Advanced real-time object detection using YOLOv3 and Darknet-53.',
            longDescription: 'NeuroVision is a high-performance computer vision system that implements real-time object detection using the YOLOv3 (You Only Look Once) algorithm. By leveraging the Darknet-53 backbone and OpenCV\'s DNN module, the platform can simultaneously detect and classify 80 categories of objects from the COCO dataset with massive throughput and minimal latency, even on edge-computing hardware.',

            techStack: ['Python', 'OpenCV', 'YOLOv3', 'Darknet-53', 'NumPy', 'CUDA', 'OpenCL', 'COCO Dataset'],
            tools: ['VS Code', 'Darknet CLI', 'Git LFS', 'PowerShell'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Hardware-dependent live feed
            startDate: '2025-01-01',
            role: 'CV Developer',
            customTimeline: 'Oct 2025',
            team: 'Personal Project',

            highlights: ['Real-time 45+ FPS Detection', 'Multi-scale Object Recognition', 'GPU-Accelerated Inference'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Vision Engine',
                    items: [
                        '**Real-Time Processing**: Ultra-low latency detection logic capable of handling high-resolution webcam feeds.',
                        '**Object Localization**: Precise bounding box generation with adaptive color-coding for 80 distinct classes.',
                        '**Confidence Scoring**: Integrated probability mapping to filter low-confidence detections and ensure visual accuracy.'
                    ]
                },
                {
                    title: 'Architecture Logic',
                    items: [
                        '**Darknet-53 Backbone**: High-accuracy feature extraction using 53 convolutional layers for balanced speed and precision.',
                        '**Feature Pyramid Network (FPN)**: Multi-scale detection heads for identifying small, medium, and large objects simultaneously.',
                        '**Efficient Inference**: Single-pass forward propagation for holistic image analysis in one neural network execution.'
                    ]
                },
                {
                    title: 'Engineering Optimization',
                    items: [
                        '**GPU Acceleration**: Optional integration with CUDA and OpenCL for maximizing FPS on compatible hardware.',
                        '**Threshold Management**: Interactive configuration for Confidence and Non-Maximum Suppression (NMS) thresholds.',
                        '**I/O Versatility**: Support for diverse input sources including built-in webcams, external USB cameras, and RTSP streams.'
                    ]
                },
                {
                    title: 'Live Controls',
                    items: [
                        '**Interactive Commands**: Real-time hotkeys for pausing detection, capturing screenshots, and graceful exit.',
                        '**Performance Benchmarks**: On-screen FPS counters and object counters for real-time system monitoring.',
                        '**Adaptive Resizing**: Intelligent preprocessing pipeline using `dnn.blobFromImage` for standardized model input.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Repository & Env',
                    code: 'git clone <repository-url>\ncd neurovision-real-time-detection\npip install opencv-python numpy',
                    type: 'code'
                },
                {
                    title: 'Model Downloads',
                    code: 'wget https://pjreddie.com/media/files/yolov3.weights\n# Verify yolov3.cfg and coco.names are present',
                    type: 'code'
                },
                {
                    title: 'Launch Vision',
                    code: 'python Vision.py',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Low FPS on CPU Instances",
                    solution: "Implemented frame-skipping logic and resized the input blob to 320x320 to maintain smooth UI interactivity without sacrificing significant detection accuracy."
                },
                {
                    problem: "Overlapping Bounding Boxes",
                    solution: "Fine-tuned the NMS (Non-Maximum Suppression) threshold to 0.4, effectively merging redundant detections for the same object."
                },
                {
                    problem: "Environmental Lighting Noise",
                    solution: "Applied adaptive confidence thresholding to dynamically filter false positives in varying light conditions typical of diverse webcam environments."
                }
            ]
        },
        {
            id: 'project-17',
            slug: 'voices-unheard',
            title: 'Voices Unheard',
            description: 'Secure, anonymous digital sanctuary for conflict-affected story sharing.',
            longDescription: 'Voices Unheard is a mission-critical digital platform designed to provide a safe space for war victims, refugees, and survivors of discrimination to share their stories anonymously. As a System Analyst, I defined the technical architecture to ensure \"Zero Digital Refoulement\"—guaranteeing that no identifiable user data is ever collected or tracked. The platform integrates trauma-informed UI principles with AI-assisted pre-moderation, enabling vulnerable individuals to document their experiences with absolute technical security and emotional support.',

            techStack: ['Node.js', 'Express.js', 'PostgreSQL', 'React.js', 'AI (NLP)', 'TLS 1.3', 'AES-256'],
            tools: ['VS Code', 'Redis', 'UML Design', 'Figma'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Restricted secure platform
            startDate: '2025-07-01',
            role: 'System Analyst',
            customTimeline: 'July - September 2025',
            team: '5 Developers',

            highlights: ['Secure Managed Anonymity', 'Trauma-Informed UX', 'Zero-Refoulement Architecture'],
            category: 'Software Engineering',
            features: [
                {
                    title: 'Anonymous Protection',
                    items: [
                        '**Metadata Cleaning**: Automated removal of EXIF data and GPS coordinates from all uploaded files to protect user location.',
                        '**Zero IP Logging**: Privacy-first logging system that ensures no tracking of user identities or network signatures.',
                        '**Token-based Deletion**: Secure token system allowing users to delete their submissions without requiring a persistent account.'
                    ]
                },
                {
                    title: 'Trauma-Informed UI',
                    items: [
                        '**Quick Exit**: Always-visible emergency exit button that instantly redirects to neutral sites for physical safety.',
                        '**Content Warnings**: Layered consent mechanism requiring users to confirm before viewing potentially triggering media.',
                        '**Empathetic Design**: Minimalist, calming interface designed to reduce cognitive load and secondary trauma for survivors.'
                    ]
                },
                {
                    title: 'AI & Moderation',
                    items: [
                        '**Pre-screening Logic**: AI-driven NLP system that pre-moderates content for hate speech and high-risk triggers.',
                        '**Crisis Escalation**: Automated protocols for identifying crisis situations (suicide threats, etc.) and providing resource lists.',
                        '**Secure Dashboard**: Moderator interface designed for reviewing stories without any access to submitter metadata.'
                    ]
                },
                {
                    title: 'Security Infrastructure',
                    items: [
                        '**End-to-End Encryption**: Mandatory TLS 1.3 for all communications and AES-256 for data encryption at rest.',
                        '**OWASP Compliance**: Hardened backend implementation adhering to top-10 security practices for web applications.',
                        '**PostgreSQL Vault**: Database architecture utilizing at-rest encryption to protect sensitive narrative content.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'System Requirements',
                    code: 'Node.js 18+\nPostgreSQL 13+\nRedis (Session Management)',
                    type: 'code'
                },
                {
                    title: 'Security Configuration',
                    code: 'DATABASE_URL=postgres://...\nENCRYPTION_KEY=aes256_...\nAI_MODERATION_KEY=nlp_...',
                    type: 'code'
                },
                {
                    title: 'Platform Launch',
                    code: 'npm install\nnpm run seed (Optional: Sample AI prompts)\nnpm start',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Survivor Geolocation Risks",
                    solution: "Implemented a server-side interceptor that strips all binary metadata (EXIF/JFIF) from library-level upload requests before the file reaches the database."
                },
                {
                    problem: "AI Moderation Accuracy",
                    solution: "Utilized dual-layer moderation—AI for initial risk classification and human review for nuanced emotional context—ensuring survivors feel heard but not judged."
                },
                {
                    problem: "Quick Exit Latency",
                    solution: "Developed the Emergency Exit as a client-side listener that bypasses standard routing logic for a sub-100ms response time when clicked."
                }
            ]
        },
        {
            id: 'project-18',
            slug: 'smart-motion-detection-system',
            title: 'Smart Motion Detection System',
            description: 'AIoT motion detection using YOLO11-Pose and MQTT for smart home automation.',
            longDescription: 'The Smart Motion Detection System is an advanced IoT solution that leverages YOLO11n pose estimation to detect and analyze human movement patterns in real-time. Unlike traditional motion detectors that rely on simple pixel changes, this system performs sophisticated skeletal analysis (17 keypoints) to distinguish between meaningful human activity and environmental noise. Integrated with EMQX Cloud via secure MQTT, it enables precise automated control of smart home devices like lamps and fans with sub-second latency.',

            techStack: ['Python', 'YOLO11-Pose', 'OpenCV', 'MQTT', 'Raspberry Pi', 'EMQX Cloud'],
            tools: ['VS Code', 'Raspberry Pi 5', 'Mosquitto', 'Git LFS'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Hardware-dependent IoT system
            startDate: '2025-07-01',
            role: 'CV Researcher Intern',
            customTimeline: 'July - September 2025',
            team: 'CPS Research Group',

            highlights: ['Skeletal 17-Keypoint Tracking', 'Secure SSL/TLS MQTT', 'Raspberry Pi 5 Optimization'],
            category: 'IoT & Embedded',
            features: [
                {
                    title: 'Intelligent Motion Analysis',
                    items: [
                        '**Advanced Pose Detection**: YOLO11n-based skeleton tracking with 17 keypoint analysis for human activity recognition.',
                        '**Smart Movement Filtering**: Intelligent algorithms to distinguish between meaningful motion and environmental noise (pets, shadows).',
                        '**Stability Analysis**: Multi-frame pose stability verification using normalized motion calculation independent of frame position.'
                    ]
                },
                {
                    title: 'Smart Device Integration',
                    items: [
                        '**Multi-Device Control**: Automated GPIO-level control for lamps, fans, and relays with precise state management.',
                        '**Operation Modes**: Support for Automatic (motion-based), Manual (remote override), and Scheduled control modes.',
                        '**Intelligent Auto-Off**: Highly configurable delay logic that turns off devices only when sustained inactivity is verified.'
                    ]
                },
                {
                    title: 'IoT Connectivity',
                    items: [
                        '**Secure MQTT Communication**: SSL/TLS encrypted messaging via EMQX Cloud for cross-network device orchestration.',
                        '**Remote Command API**: Standardized JSON topic structure for status updates, sensor events, and remote configuration.',
                        '**Dynamic Updates**: Remote parameter tuning for thresholds and cooldowns without requiring system restarts.'
                    ]
                },
                {
                    title: 'Performance Monitoring',
                    items: [
                        '**Real-time Analytics**: On-screen FPS counters and movement pattern visualizations for system health monitoring.',
                        '**Edge Optimization**: Tailored for Raspberry Pi 5 with buffer management and efficient deque structures for history data.',
                        '**Error Handling**: Comprehensive logging system and automatic MQTT reconnection logic for 24/7 uptime.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Hardware Setup',
                    code: 'Raspberry Pi 5 (4GB recommended)\nUSB Camera (640x480+)\nRelay Modules for GPIO Pin 26 (Lamp) and 19 (Fan)',
                    type: 'code'
                },
                {
                    title: 'Dependencies & Repo',
                    code: 'git clone <repository-url>\npip install opencv-python ultralytics paho-mqtt',
                    type: 'code'
                },
                {
                    title: 'MQTT Configuration',
                    code: '# Edit MQTTConfig in AIoT-dmouv2025.py\nBROKER = "your-emqx-node.emqxsl.com"\nPORT = 8883 # Use SSL',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Environmental Pixel Flutter",
                    solution: "Moved away from frame-differencing to skeletal pose estimation, ensuring that only validated human keypoint movements trigger device actions."
                },
                {
                    problem: "IoT Latency in Unstable Networks",
                    solution: "Implemented an asynchronous Paho-MQTT client with local state caching, allowing the system to continue local processing during brief connectivity drops."
                },
                {
                    problem: "Hardware Resource Constraints",
                    solution: "Optimized model inference using the YOLO11n-pose variant and limited frame resolution to 640x480, achieving stable 30+ FPS on Raspberry Pi gear."
                }
            ]
        },
        {
            id: 'project-20',
            slug: 'credit-risk-analysis-lstm',
            title: 'Credit Risk Analysis LSTM',
            description: 'High-precision loan default prediction using stacked LSTM layers and sequential financial modeling.',
            longDescription: 'This project focuses on predicting credit risk using Long Short-Term Memory (LSTM), a variant of Recurrent Neural Networks (RNNs) optimized for financial sequential data. By capturing long-term temporal dependencies in credit history and financial behavior, the system identifies high-risk loan applicants with significantly higher accuracy than traditional linear models. The analysis incorporates business-critical metrics such as Default Capture Rate and Approval Rate to maximize institutional profitability.',

            techStack: ['Python', 'TensorFlow', 'Keras', 'LSTM', 'Scikit-learn', 'SMOTE'],
            tools: ['Jupyter Notebook', 'Hugging Face Spaces', 'Pandas', 'Seaborn', 'SMOTE'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#',
            startDate: '2025-07-01',
            role: 'Data Scientist',
            customTimeline: 'July 2025',
            team: '3 Developers',

            highlights: ['Stacked LSTM Neural Network', 'SMOTE Imbalance Handling', 'Financial ROI Analysis'],
            category: 'Data Science',
            features: [
                {
                    title: 'Sequential Model Architecture',
                    items: [
                        '**LSTM Layers**: Stacked Long Short-Term Memory layers to capture complex temporal patterns in debt behavior.',
                        '**Dropout Optimization**: Integrated dropout layers to prevent overfitting on specific credit profiles.',
                        '**Binary Optimization**: Sigmoid activation output with Adam optimizer and binary cross-entropy loss function.'
                    ]
                },
                {
                    title: 'Financial Data Preprocessing',
                    items: [
                        '**3D Reshaping**: Data transformation into `[samples, timesteps, features]` format for deep learning sequential input.',
                        '**SMOTE Sampling**: Implementation of Synthetic Minority Over-sampling to balance default vs. non-default cases.',
                        '**Feature Scaling**: Numerical normalization and categorical encoding for employment and loan-type stability.'
                    ]
                },
                {
                    title: 'Risk & ROI Analytics',
                    items: [
                        '**Profitability Analysis**: Comparative study on ROI/cost savings from avoiding defaults vs baseline approval rates.',
                        '**Risk Segmentation**: Automatic classification of applicants into Low, Medium, and High-risk tiers based on probability scores.',
                        '**Advanced AUC Tuning**: Hyperparameter tuning via GridSearchCV to maximize Default Capture Rate.'
                    ]
                },
                {
                    title: 'Comprehensive Evaluation',
                    items: [
                        '**Default Capture Rate**: Measuring the exact proportion of actual defaults identified by the model.',
                        '**Business Metrics**: Evaluating model impact via Approval Rate vs institutional Risk Appetite.',
                        '**Interactive Visualization**: Deployment on Hugging Face Spaces for real-time model interaction and prediction testing.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Model Environment',
                    code: 'git clone <repository-url>\npip install -r requirements.txt',
                    type: 'code'
                },
                {
                    title: 'Preprocessing Data',
                    code: '# Data must be reshaped for LSTM\nX_train = X_train.reshape((X_train.shape[0], 1, X_train.shape[1]))',
                    type: 'code'
                },
                {
                    title: 'Training & Eval',
                    code: 'python train_lstm.py\n# Outputs Accuracy, Precision, Recall, and AUC metrics',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Imbalance Financial Datasets",
                    solution: "Applied SMOTE (Synthetic Minority Over-sampling Technique) to ensure the LSTM model learns to identify rare default events as effectively as frequent low-risk ones."
                },
                {
                    problem: "Vanishing Gradient in Deep RNNs",
                    solution: "Utilized LSTM gates (Input, Forget, Output) to maintain long-term memory gradients, essential for capturing years of credit history."
                },
                {
                    problem: "Overfitting on Loan Profiles",
                    solution: "Implemented early stopping and dropout strategies to ensure the model generalizes across diverse demographic and financial sectors."
                }
            ]
        },
        {
            id: 'project-21',
            slug: 'hand-gesture-recognition',
            title: 'Hand Gesture Recognition',
            description: 'Real-time hand tracking and skeletal landmark detection using MediaPipe and OpenCV.',
            longDescription: 'Hand Gesture Recognition is a high-performance computer vision system that utilizes MediaPipe’s Hands solution for robust, real-time hand landmark detection. By extracting 21 coordinate points from a video stream, the system performs dynamic finger counting and gesture analysis. This project serves as a foundational framework for human-computer interaction (HCI), enabling non-contact control systems for various software applications with high skeletal stability.',

            techStack: ['Python', 'MediaPipe', 'OpenCV'],
            tools: ['VS Code', 'Git LFS', 'PowerShell'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Desktop CV application
            startDate: '2024-12-01',
            role: 'CV Developer',
            customTimeline: 'December 2024',
            team: 'Personal Project',

            highlights: ['MediaPipe Hands Integration', 'Real-time 21-Landmark Tracking', 'Dynamic Finger Counting'],
            category: 'AI & Machine Learning',
            features: [
                {
                    title: 'Real-Time Hand Tracking',
                    items: [
                        '**MediaPipe Hands Integration**: Leveraging Google’s sophisticated machine learning pipeline for sub-millisecond hand tracking.',
                        '**21-Landmark Detection**: Accurate extraction of 21 key coordinate points representing joints and fingertips in 3D space.',
                        '**Static/Dynamic Mode Support**: Configurable landmark detection that works for both single frames and high-speed video streams.'
                    ]
                },
                {
                    title: 'Gesture Recognition Logic',
                    items: [
                        '**Dynamic Finger Counting**: Custom algorithms to count raised fingers by comparing tip positions with joint landmarks (MCP/PIP).',
                        '**Coordinate Analysis**: Real-time calculation of Euclidean distances between landmarks for gesture classification.',
                        '**Stability Filtering**: Signal smoothing to ensure counting accuracy even with minor hand tremors or sensor noise.'
                    ]
                },
                {
                    title: 'Cross-Platform Architecture',
                    items: [
                        '**OpenCV Integration**: Robust video processing and frame visualization with real-time landmark rendering.',
                        '**Low Hardware Overhead**: Optimized for standard laptop webcams without requiring dedicated GPU acceleration.',
                        '**Modular Code Structure**: Decoupled AI tracking logic from UI rendering for easy integration into larger projects.'
                    ]
                },
                {
                    title: 'Interactive UI & Output',
                    items: [
                        '**Live Landmark Rendering**: Real-time projection of skeletal joint maps onto the video feed for user feedback.',
                        '**Real-time Event Logging**: Instant detection feedback via console logs and on-screen text overlays.',
                        '**Customizable Gestures**: Extensible architecture that allows adding new symbolic recognitions (peace signs, thumbs up).'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Environment & Setup',
                    code: 'git clone <repository-url>\npython -m venv HandTracking-env',
                    type: 'code'
                },
                {
                    title: 'Dependency Install',
                    code: 'HandTracking-env\\Scripts\\Activate\npip install opencv-python mediapipe',
                    type: 'code'
                },
                {
                    title: 'Run AI Application',
                    code: 'python HandsTrackingAI.py\n# Press "q" to exit camera feed',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Low Lighting Conditions",
                    solution: "Adjusted MediaPipe's min_detection_confidence threshold and applied OpenCV histogram equalization to improve landmark stability in dark environments."
                },
                {
                    problem: "Hand-to-Camera Distance Variance",
                    solution: "Normalized landmark coordinates relative to the palm center, ensuring finger counting logic remains accurate regardless of how close the hand is to the camera."
                },
                {
                    problem: "Frame Rate Latency",
                    solution: "Optimized frame processing by disabling static_image_mode during streaming, allowing the system to use temporal information for faster tracking."
                }
            ]
        },
        {
            id: 'project-22',
            slug: 'data-analyst-dashboard',
            title: 'Data Analyst Dashboard',
            description: 'Interactive analytics tool for e-commerce data exploration using Dash and Plotly.',
            longDescription: 'The Data Analyst Dashboard is a comprehensive, interactive analytic platform designed to streamline e-commerce data exploration. Built with Python and Streamlit, it allows analysts to move beyond static reports by providing real-time data filtering, dynamic chart generation (bar, line, pie), and automated summary statistics. The system features a robust preprocessing pipeline for handling missing data and outliers, ensuring that decision-makers have access to high-quality insights on sales performance and product category trends.',

            techStack: ['Python', 'Streamlit', 'Plotly', 'Pandas', 'NumPy', 'Dash'],
            tools: ['VS Code', 'Jupyter Notebook', 'Git LFS', 'PowerShell'],
            status: 'completed',
            repoUrl: '#',
            demoUrl: '#', // Desktop/Server application
            startDate: '2024-07-01',
            role: 'Data Analyst',
            customTimeline: 'July - August 2024',
            team: 'Personal Project',

            highlights: ['Interactive Real-time Visuals', 'Automated Data Preprocessing', 'E-commerce Trends Analysis'],
            category: 'Data Science',
            features: [
                {
                    title: 'Interactive Data Exploration',
                    items: [
                        '**Dynamic Chart Generation**: Real-time rendering of bar, line, and pie charts based on multi-variable user selections.',
                        '**Drill-down Analytics**: Ability to focus on specific time periods or product categories with instant visual feedback.',
                        '**Metric Customization**: Dynamic dashboard layout that adjusts according to the selected Key Performance Indicators (KPIs).'
                    ]
                },
                {
                    title: 'Data Filtering & Manipulation',
                    items: [
                        '**Smart Preprocessing**: Automated handling of missing values, duplicate entries, and data type transformations.',
                        '**Advanced Filtering**: Multi-layered filters for product categories, price ranges, and sales dates.',
                        '**Outlier Detection**: Integrated statistical methods to identify and isolate anomalies in e-commerce transaction data.'
                    ]
                },
                {
                    title: 'Customizable Dashboards',
                    items: [
                        '**Modular UI Layout**: Flexible dashboard design using Streamlit containers for a clean and professional analytics interface.',
                        '**Real-time State Management**: Instant synchronization between dropdown selections and data visualization components.',
                        '**Export Capabilities**: One-click functionality to export processed data and summary statistics for offline reporting.'
                    ]
                },
                {
                    title: 'E-Commerce Deep-Dive',
                    items: [
                        '**Sales Trend Analysis**: Visualizing historical sales growth and forecasting potential seasonal patterns.',
                        '**Category Performance**: Deep-dive into product category rankings based on volume, revenue, and profit margins.',
                        '**Reader Profiling**: (In context of related projects) Identifying high-value segments and customer behavior archetypes.'
                    ]
                }
            ],
            installation: [
                {
                    title: 'Clone & Environment',
                    code: 'git clone <repository-url>\ncd Data-Analyst-Dashboard',
                    type: 'code'
                },
                {
                    title: 'Install Dependencies',
                    code: 'pip install pandas streamlit plotly dash numpy',
                    type: 'code'
                },
                {
                    title: 'Launch Dashboard',
                    code: 'streamlit run Dashboard/EcomersDashboard.py\n# Access at http://localhost:8501',
                    type: 'code'
                }
            ],
            challengesAndSolutions: [
                {
                    problem: "Handling Large Unstructured Datasets",
                    solution: "Developed a robust Pandas-based cleaning pipeline that standardizes data formats and handles null values before they reach the visualization layer."
                },
                {
                    problem: "Real-time UI Responsiveness",
                    solution: "Leveraged Streamlit caching (`@st.cache_data`) to ensure that heavy data processing operations only run when the underlying dataset changes."
                },
                {
                    problem: "Visualization Over-cluttering",
                    solution: "Implemented hierarchical filtering (Category -> Sub-category) to keep visualizations focused and easy to interpret for non-technical stakeholders."
                }
            ]
        }
    ],
    experiences: [
        {
            id: `prof-new-1`,
            company: `FlyRank AI`,
            position: `Machine Learning Engineer`,
            description: `Selected into FlyRank AI's Machine Learning Internship Program (July 2026 Cohort), contributing to applied AI development within a remote-first, product-driven engineering environment.`,
            responsibilities: [
                `Contribute to end-to-end machine learning workflows spanning data preparation, model development, evaluation, and deployment aligned with production standards.`,
                `Collaborate with a distributed engineering team across 2+ time zones, participating in agile sprints, code reviews, and technical design discussions.`,
                `Deliver 1-2 ML driven features or research prototypes as part of the structured internship curriculum, applying industry best practices in reproducibility and model performance tracking.`,
            ],
            skills: [
                `Machine Learning`,
                `Python`,
                `MLOps`,
                `AI Development`,
                `Remote Collaboration`,
            ],
            startDate: `2026-06-01`,
            isOngoing: true,
            location: `Chicago, Illinois, United States · Remote`,
            type: `internship`,
            externalLink: `https://internship.flyrank.ai/intern`,
            logo: `/assets/flyrankailogo.webp`,
            logoBg: `bg-black`,
        },
        {
            id: 'exp-open',
            company: 'Independent',
            position: 'Design & Product Engineer',
            description: 'Open to opportunities in New York — building AI-native product experiences, design systems, and full-stack interfaces for startups and product teams.',
            responsibilities: [
                'Design and ship polished product interfaces with modern React/Next.js stacks.',
                'Prototype AI-assisted workflows and agentic product features from concept to demo.',
                'Partner with founders and eng teams on UX, architecture, and go-to-market craft.',
            ],
            skills: ['Product Design', 'Next.js', 'TypeScript', 'AI Products', 'UX Engineering'],
            startDate: '2025-01-01',
            isOngoing: true,
            location: 'New York, NY',
            type: 'self-employed',
            logoBg: 'bg-white',
        }
    ],
    education: [],
            achievements: [
        {
            id: 'cert-6',
            title: 'Started with Databases',
            issuer: 'Amazon Web Services',
            date: '2025-02-01',
            credentialUrl: 'https://www.credly.com/badges/ccd9ad7a-f4b9-41e7-8589-f845d50c67f1/linked_in_profile',
            category: 'certification',
            image: '/certificate/Started with Databases.webp',
        },
        {
            id: 'cert-7',
            title: 'Supervised Machine Learning Regression and Classification',
            issuer: 'DeepLearning.AI',
            date: '2025-01-01',
            credentialId: 'JEZL7ZL9SADP',
            credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/JEZL7ZL9SADP',
            category: 'certification',
            image: '/certificate/Supervised Machine Learning Regression and Classification.webp',
        },
        {
            id: 'cert-9',
            title: 'Data Analytics on Google Cloud',
            issuer: 'Google Cloud Skills Boost',
            date: '2025-01-01',
            credentialId: '13612507',
            credentialUrl: 'https://www.skills.google/public_profiles/241d7451-f9ad-4c87-81e0-affa9d6fed28/badges/13612507?utm_medium=social&utm_source=linkedin&utm_campaign=ql-social-share',
            category: 'certification',
            image: '/certificate/Data Analytics on Google Cloud.webp',
        },
        {
            id: 'cert-13',
            title: 'Introduction to Generative AI',
            issuer: 'Amazon Web Services',
            date: '2025-01-01',
            credentialId: 'fedcea5d-b7d5-425d-b6b5-fd9d24b7c918',
            credentialUrl: 'https://www.credly.com/badges/fedcea5d-b7d5-425d-b6b5-fd9d24b7c918/linked_in_profile',
            category: 'certification',
            image: '/certificate/Introduction to Generative AI.webp',
        },
        {
            id: 'cert-14',
            title: 'Deep Learning Beginner',
            issuer: 'Udemy',
            date: '2025-01-01',
            credentialId: 'UC-7dff40d7-4bif-4213-8928-653d07e72315',
            credentialUrl: 'https://www.udemy.com/certificate/UC-7dff40d7-4b1f-42f3-8928-653d07e7a315/',
            category: 'certification',
            image: '/certificate/Deep Learning Beginner.webp',
        },
        {
            id: 'cert-15',
            title: 'Machine Learning Foundations',
            issuer: 'Amazon Web Services',
            date: '2024-12-01',
            credentialId: '4fc1c551-1f68-47cc-b371-d2785495ae61',
            credentialUrl: 'https://www.credly.com/badges/60d0828f-021d-4b73-8fef-705eddd8069a/linked_in_profile',
            category: 'certification',
            image: '/certificate/Machine Learning Foundations.webp',
        },
        {
            id: 'cert-20',
            title: 'AWS Academy Graduate - Cloud 1',
            issuer: 'Amazon Web Services',
            date: '2024-10-01',
            credentialId: '4fc1c551-1f68-47cc-b371-d2785495ae61',
            credentialUrl: 'https://www.credly.com/badges/4fc1c551-1f68-47cc-b371-d2785495ae61',
            type: 'Course',
            tags: ['AWS', 'Cloud'],
            category: 'certification',
            image: '/certificate/AWS Academy Graduate - AWS Academy Introduction to Cloud 1.pdf',
        },
        {
            id: 'cert-25',
            title: 'Store Listing Certificate',
            issuer: 'Google Play',
            date: '2024-07-01',
            credentialId: '110540570',
            credentialUrl: 'https://www.credential.net/ad3d06cc-16c9-4e1a-90db-c36fa3626bc8#acc.SKJ845tp',
            category: 'certification',
            image: '/certificate/Store Listing Certificate.pdf',
        }
    ],
    techStack: [
        { name: 'Python', icon: 'https://cdn.simpleicons.org/python', category: 'language' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript', category: 'language' },
        { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript', category: 'language' },
        { name: 'Solidity', icon: 'https://cdn.simpleicons.org/solidity', category: 'language' },
        { name: 'React', icon: 'https://cdn.simpleicons.org/react', category: 'framework' },
        { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs', category: 'framework' },
        { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs', category: 'framework' },
        { name: 'TensorFlow', icon: 'https://cdn.simpleicons.org/tensorflow', category: 'library' },
        { name: 'Scikit-learn', icon: 'https://cdn.simpleicons.org/scikitlearn', category: 'library' },
        { name: 'Pandas', icon: 'https://cdn.simpleicons.org/pandas', category: 'library' },
        { name: 'NumPy', icon: 'https://cdn.simpleicons.org/numpy', category: 'library' },
        { name: 'Matplotlib', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg', category: 'library' }, // Matplotlib not on simpleicons sometimes or generic
        { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss', category: 'library' },
        { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis', category: 'database' },
        { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql', category: 'database' },
        { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes', category: 'tool' },
        { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker', category: 'tool' },
        { name: 'Terraform', icon: 'https://cdn.simpleicons.org/terraform', category: 'tool' },
        { name: 'LangChain', icon: 'https://cdn.simpleicons.org/langchain', category: 'library' },
        { name: 'Mistral AI', icon: 'https://cdn.simpleicons.org/mistralai', category: 'library' },
        { name: 'PyTorch', icon: 'https://cdn.simpleicons.org/pytorch', category: 'library' },
        { name: 'OpenCV', icon: 'https://cdn.simpleicons.org/opencv', category: 'library' },
        { name: 'FastAPI', icon: 'https://cdn.simpleicons.org/fastapi', category: 'framework' },
        { name: 'Flask', icon: 'https://cdn.simpleicons.org/flask', category: 'framework' },
    ],
    hardSkills: [
        { name: 'System Architecture', level: 'intermediate', category: 'software', description: 'Designing robust, scalable, and high-performance system architectures for complex applications.' },

        { name: 'AI Agents & Autonomy', level: 'beginner', category: 'ai', description: 'Designing autonomous systems with recursive reasoning and decision-making capabilities.' },
        { name: 'Large Language Models (LLM)', level: 'intermediate', category: 'ai', description: 'Expertise in fine tuning open source models, RAG architectures, and prompt engineering.' },
        { name: 'Data Science', level: 'expert', category: 'ai', description: 'Advanced statistical analysis and predictive modeling to extract insights from big data.' },
        { name: 'Deep Learning (CV/NLP)', level: 'advanced', category: 'ai', description: 'Architecting deep neural networks for complex computer vision and natural language tasks.' },
        { name: 'Computer Vision', level: 'intermediate', category: 'ai', description: 'Developing real-time object detection, pattern recognition, and spatial analysis systems.' },
        { name: 'Machine Learning Ops', level: 'advanced', category: 'ai', description: 'Implementing robust pipelines for model training, deployment, and performance monitoring.' },
        { name: 'DevOps', level: 'advanced', category: 'devops', description: 'Streamlining development workflows and infrastructure management through automation.' },
        { name: 'Full Stack Development', level: 'expert', category: 'software', description: 'Engineering scalable web architectures from pixel-perfect frontends to robust databases.' },
        { name: 'System Analysis', level: 'advanced', category: 'software', description: 'Translating complex stakeholder requirements into efficient and scalable technical blueprints.' },
        { name: 'SDLC', level: 'intermediate', category: 'software', description: 'Governing the entire life cycle of software development with a focus on quality and agility.' },
        { name: 'Software Design', level: 'advanced', category: 'software', description: 'Applying architectural patterns and principles to build maintainable and modular systems.' },
        { name: 'Requirement Specifications', level: 'advanced', category: 'software', description: 'Defining clear, precise, and actionable technical documentation for engineering teams.' },
        { name: 'Data Analytics', level: 'advanced', category: 'data', description: 'Transforming raw data into meaningful visualizations and strategic intelligence.' },
        { name: 'Data Visualization', level: 'expert', category: 'data', description: 'Crafting intuitive and interactive dashboards to communicate complex data findings.' },
        { name: 'SQL & DBMS', level: 'expert', category: 'data', description: 'Architecting and optimizing relational database schemas for high-performance applications.' },
        { name: 'Docker & Kubernetes', level: 'intermediate', category: 'devops', description: 'Containerizing applications for consistent deployment and orchestrating cloud resources.' },

        // Other Technical Skills
        { name: 'Wazuh', level: 'beginner', category: 'other', description: 'Exploring open-source security monitoring for threat detection and compliance.' },
        { name: 'Network Traffic Analysis', level: 'beginner', category: 'other', description: 'Analyzing packet captures to identify anomalies and optimize network performance.' },
        { name: 'Socket Programming', level: 'expert', category: 'other', description: 'Implementing low-level network communication protocols for real-time data transfer.' },
        { name: 'Google Cloud Platform', level: 'beginner', category: 'other', description: 'Utilizing cloud infrastructure and services for scalable application hosting.' },
        { name: 'Solidity', level: 'beginner', category: 'other', description: 'Writing secure smart contracts for decentralized applications on Ethereum.' },
        { name: 'Decentralized Applications (DApps)', level: 'beginner', category: 'other', description: 'Developing web applications that interact with blockchain smart contracts.' },
        { name: 'Blockchain Architecture', level: 'beginner', category: 'other', description: 'Understanding the fundamental principles of distributed ledger technologies.' },
    ],
    softSkills: [
        { name: 'Problem Solving', description: 'Innovative debugging and algorithmic optimization' },
        { name: 'Systemic Thinking', description: 'Designing robust, scalable end-to-end architectures' },
        { name: 'Critical Thinking', description: 'Analytical approach to solving complex engineering challenges' },
        { name: 'Continuous Learning', description: 'Staying updated with state-of-the-art AI research' },
        { name: 'Analytical Thinking', description: 'Breaking down complex data into actionable insights' },
        { name: 'Adaptability', description: 'Quickly mastering new frameworks and AI models' },
        { name: 'Leadership', description: 'Leading engineering teams and managing complex projects' },
        { name: 'Communication', description: 'Translating complex AI concepts for stakeholders' },
        { name: 'Teamwork', description: 'Collaborative development in cross-functional agile teams' },
        { name: 'Research Skills', description: 'In-depth literature review and academic contribution' },
    ],
    tools: [
        { name: 'VS Code', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg', category: 'ide' },
        { name: 'Jupyter', icon: 'https://cdn.simpleicons.org/jupyter', category: 'ide' },
        { name: 'Google Colab', icon: 'https://cdn.simpleicons.org/googlecolab', category: 'ide' },
        { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma', category: 'design' },
        { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github', category: 'devops' }, // Default black, handled by dark:invert in component
        { name: 'Git', icon: 'https://cdn.simpleicons.org/git', category: 'devops' },
        { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker', category: 'devops' },
        { name: 'Conda', icon: 'https://cdn.simpleicons.org/anaconda', category: 'devops' },
        { name: 'Linux', icon: 'https://cdn.simpleicons.org/linux', category: 'devops' },
        { name: 'Postman', icon: 'https://cdn.simpleicons.org/postman', category: 'devops' },
    ],
    faqs: [
        {
            question: 'What do you specialize in?',
            answer: 'I am a Design & Product Engineer based in New York, focused on AI-native product experiences — from interface craft and design systems to full-stack Next.js builds and agentic workflows.',
        },
        {
            question: 'What kinds of projects are you looking for?',
            answer: 'Product engineering roles and collaborations where design quality and AI capability meet: prototypes, 0-to-1 features, and polished systems for startups and product teams.',
        },
        {
            question: 'Are you available for opportunities?',
            answer: 'Yes — open to full-time, contract, and select freelance work in NYC and remote US. Reach out via Linktree or GitHub.',
        },
    ],
    blogs: [
        {
            id: 'blog-1',
            slug: 'future-of-ai-agents',
            title: 'The Future of AI Agents in Enterprise',
            excerpt: 'How autonomous agents are redefining software architecture and decision-making processes.',
            content: 'Detailed exploration of AI agents...',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-20',
            category: 'applied-ai',
            tags: ['AI', 'Agents', 'Enterprise'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '5'
        },
        {
            id: 'blog-2',
            slug: 'web3-ux-challenges',
            title: 'Overcoming Web3 UX Challenges',
            excerpt: 'Strategies for building decentralized applications that feel as smooth as Web2.',
            content: 'UX in Web3 is critical...',
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-15',
            category: 'more',
            tags: ['Web3', 'Blockchain', 'UX'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '4'
        },
        {
            id: 'blog-3',
            slug: 'mastering-nextjs-performance',
            title: 'Mastering Next.js Performance',
            excerpt: 'Advanced techniques for optimizing Core Web Vitals in modern React applications.',
            content: 'Performance optimization...',
            image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-05',
            category: 'software-development',
            tags: ['Next.js', 'React', 'Performance'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '6'
        },
        {
            id: 'blog-4',
            slug: 'ai-driven-security',
            title: 'AI-Driven Cybersecurity',
            excerpt: 'Using deep learning to detect and prevent modern network intrusion.',
            content: 'Cybersecurity with AI...',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-02-28',
            category: 'applied-ai',
            tags: ['AI', 'Security', 'Deep Learning'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '7'
        },
        {
            id: 'blog-5',
            slug: 'llm-fine-tuning',
            title: 'Fine-Tuning LLMs locally',
            excerpt: 'A guide to optimizing open-source models using Ollama and LoRA techniques.',
            content: 'Local LLM fine-tuning...',
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-02-15',
            category: 'applied-ai',
            tags: ['LLM', 'Python', 'Ollama'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '8'
        },
        {
            id: 'blog-6',
            slug: 'smart-contract-security',
            title: 'Smart Contract Audit Patterns',
            excerpt: 'Common vulnerabilities and how to prevent them in Solidity.',
            content: 'Audit patterns...',
            image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-02-01',
            category: 'more',
            tags: ['Solidity', 'Ethereum', 'Security'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '5'
        },
        {
            id: 'blog-7',
            slug: 'modern-state-management',
            title: 'Modern State Management in React',
            excerpt: 'Comparing Zustand, Redux Toolkit, and React Context for large-scale apps.',
            content: 'State management...',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-01-25',
            category: 'software-development',
            tags: ['React', 'Zustand', 'Architecture'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '4'
        },
        {
            id: 'blog-8',
            slug: 'iot-edge-computing',
            title: 'Edge Computing with ESP32',
            excerpt: 'Implementing real-time data processing at the edge for industrial IoT.',
            content: 'Edge computing...',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-01-10',
            category: 'software-development',
            tags: ['IoT', 'ESP32', 'Edge'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '6'
        },
        {
            id: 'blog-9',
            slug: 'ai-in-healthcare',
            title: 'AI Transformation in Healthcare',
            excerpt: 'How computer vision is assisting in medical diagnostics and data analysis.',
            content: 'Healthcare AI...',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-01-05',
            category: 'applied-ai',
            tags: ['Healthcare', 'AI', 'Ethics'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '7'
        },
        {
            id: 'blog-10',
            slug: 'the-architects-manifesto',
            title: "Digital Garden: The Architect's Manifesto",
            excerpt: "Reflecting on my journey as an AI Engineer and the philosophy behind building intelligent, scalable systems.",
            content: "My journey into the world of technology hasn't been just about code...",
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-03-31',
            category: 'about-me',
            tags: ['Philosophy', 'Engineering', 'About Me'],
            author: { name: 'Tyler Bryan', avatar: '/about/tyler.webp' },
            readTime: '5'
        }
    ],
    gallery: [],
};
