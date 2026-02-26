# How Crypto Actually Works: Immersive Web Experience

This is the source code for the immersive web companion to Larry Cermak's book, ["How Crypto Actually Works"](https://github.com/lawmaster10/howcryptoworksbook). 

The application transforms 90,000+ words of technical content into an interactive "Protocol Simulator" using React, Three.js, and Framer Motion.

**Live Demo:** [https://how-crypto-works.pages.dev](https://how-crypto-works.pages.dev)

---

## 🚀 Key Features

- **Standard Web Mode:** A modern, clean reading interface optimized for all devices.
- **Kindle Edition:** A fully interactive 3D book spread with horizontal pagination and physics-based cover transitions.
- **Learning Lab:** The premium "Protocol Simulator" mode featuring:
  - **Scroll-Synced 3D Visuals:** Models that morph and react as you read through different technical sections.
  - **Active Context Glossary:** Real-time extraction of cryptographic terms from the visible section.
  - **Protocol Sandboxes:** Interaction-gated learning (e.g., mine a block to unlock content).
  - **Live Terminal Feed:** Real-time simulated logs from blockchain nodes (PoW, EVM, PoH).

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8 (Beta)
- **3D Engine:** React Three Fiber + Three.js
- **Animations:** Framer Motion
- **Markdown:** React Markdown + Remark GFM
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages

---

## 💻 Local Development

Follow these steps to run the website on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BidurS/how-crypto-works-immersive.git
   cd how-crypto-works-immersive/how-crypto-works-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Prepare Book Content:**
   The website syncs with the latest chapter content using a build-time script. Run this to bundle the chapters into the app:
   ```bash
   npm run prepare-book
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5173`.

---

## 🏗 Build & Deployment

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Cloudflare Pages Deployment
This project is configured for Cloudflare Pages. You can deploy manually using Wrangler:
```bash
npx wrangler pages deploy dist --project-name how-crypto-works
```

---

## 📖 Content Management

The book's raw markdown content is stored in the `.book_content` directory (synced via git submodule or manual copy). 

- **Adding Chapters:** Modify `scripts/prepare-book.js` and `src/chapters.json` to include new files.
- **Glossary:** Definitions are managed in `src/utils/glossary.tsx`.
- **Interactive Logic:** Chapter-specific gates and terminal logs are configured in `src/InteractiveMode.tsx`.

---

## ⚖️ License

Code is licensed under MIT.
Book content is licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).
