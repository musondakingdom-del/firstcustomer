# FirstCustomer

> **Research. Validate. Grow.**  
> Validate your idea before you build.

FirstCustomer is a free, open-source customer research, competitor analysis, and business idea validation web application. It guides first-time founders, student entrepreneurs, digital product creators, and freelancers through structured customer discovery, helping them collect empirical evidence before investing time or money into writing code.

---

## 🎯 Core Philosophy: Research First. Build Second.

Many beginners build products based purely on personal assumptions. They build tools without understanding:
- Who their actual customers are.
- What specific frictions customers experience daily.
- Whether customers are actively searching or paying for solutions.
- What alternatives (apps, spreadsheets, manual hacks) they currently use.
- What customers dislike about existing alternatives.

FirstCustomer teaches users to conduct real discovery interviews, study public community discussions, log competitor weaknesses, and maintain a rigorous validation board.

---

## ✨ Features

- **Project Workspace:** Manage multiple business concepts with distinct research datasets.
- **Customer Research Planner:**
  - Target customer profile builder.
  - Question builder with pre-loaded open-ended discovery templates and a built-in **Sales Pitch Detector** (flags hypothetical questions that lead to false positives).
  - Public discussion source tracker (Reddit threads, Discord servers, reviews).
  - Recurring findings log with observation counts and evidence tiers.
- **Competitor & Alternative Analysis:**
  - Detailed competitor profiles (pricing, features, strengths, weaknesses, customer complaints).
  - Side-by-side comparison matrix.
  - Dedicated *"What Existing Solutions Are Missing?"* market opportunity logger.
- **Validation Tracker:**
  - Evidence board across 7 core dimensions (Problem, Target Customer, Alternatives, Market Interest, Solution, Willingness to Pay, Customer Feedback).
  - Clear distinction between assumptions and corroborating evidence.
- **Customer Feedback Manager:**
  - Log authentic quotes with sentiment tagging (Supports vs Challenges).
  - Filter feedback by sentiment or tag.
- **Automated Readiness Reports:**
  - 12-section comprehensive report.
  - Deterministic, rule-based readiness evaluation.
  - Browser print stylesheet (Print / Save as PDF).
  - CSV export for competitors, questions, and feedback.
  - JSON full backup and restore.
- **Founder Collaboration:**
  - Transparent collaboration portal for young builders (ages 13–19) and first-time founders.

---

## 🔒 Privacy & Local Storage

FirstCustomer runs completely in your browser:
- **Zero remote databases or tracking servers.**
- **No account or login required (Guest mode by default).**
- All data is saved inside your browser's `localStorage`.
- Includes full **JSON Backup and Restore** to migrate your research across computers.
- Note: Local storage does not automatically sync across different devices or browsers.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or later
- npm or pnpm

### Installation

```bash
# Clone the repository (placeholder URL until official repository is configured)
git clone https://github.com/firstcustomer/firstcustomer.git

# Navigate into the project folder
cd firstcustomer

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Architecture

```
/
├── index.html                  # HTML entry point with metadata and typography
├── package.json                # Dependencies and npm scripts
├── README.md                   # Project documentation
├── LICENSE                     # MIT License
├── src/
│   ├── App.tsx                 # Main application controller and routing
│   ├── main.tsx                # React DOM root entry
│   ├── index.css               # Tailwind CSS & print media styling
│   ├── types/                  # TypeScript domain models
│   │   └── index.ts
│   ├── utils/
│   │   ├── storage.ts          # LocalStorage persistence, JSON/CSV exports
│   │   ├── seedData.ts         # Starter project and validation templates
│   │   └── analytics.ts        # Rule-based readiness & progress calculators
│   └── components/
│       ├── layout/             # Sidebar, Header, MobileNav
│       ├── dashboard/          # Dashboard view with hero & progress widgets
│       ├── workspace/          # Project creation, editing, duplication
│       ├── planner/            # Customer profile, question builder, sources
│       ├── competitors/        # Competitor matrix & market gap analysis
│       ├── validation/         # 7-dimension evidence tracker
│       ├── feedback/           # Customer feedback organizer
│       ├── reports/            # 12-section readiness summary & print view
│       ├── recruitment/        # Founder recruitment card and modal
│       ├── settings/           # Local storage settings, backup/restore
│       └── common/             # Confirmation modals & reusable dialogs
```

---

## 🤝 Founder Recruitment & Collaboration

Building something of your own? We value young builders, students, and first-time entrepreneurs interested in practical product development, design, and customer validation.

- **Email:** [businessworkflowsupport@gmail.com](mailto:businessworkflowsupport@gmail.com)
- **Instagram:** [@Clientready88](https://www.instagram.com/Clientready88/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
