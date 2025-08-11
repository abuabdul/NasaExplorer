# NasaExplorer

**An interactive space explorer app using NASA APIs to view Mars photos, APOD images, and share cosmic discoveries.**  
Built with Next.js and inspired by curiosity for the cosmos.

[Live Demo](https://nasa-explorer-zeta.vercel.app)

> Note: The backend API is hosted on render.com so cold boot would take ~50seconds to load after inactivity

---

## Table of Contents

1. [Features](#features)  
2. [Demo](#demo)  
3. [Folder Structure](#folder-structure)  
4. [Installation](#installation)  
5. [Usage](#usage)  
6. [Technologies](#technologies)  
7. [API Details](#api-details)  
8. [Testing](#testing)  
9. [Contributing](#contributing)  
10. [License](#license)  
11. [Acknowledgments](#acknowledgments)  

---

## Features

- Browse the **Astronomy Picture of the Day (APOD)** with explanations.  
- Explore **Mars Rover photos** with filters (e.g., rover, camera, date).  
- Search through a gallery of past APODs and Mars images.  
- Share your favorite cosmic discoveries on social media.

---

## Demo

Check out a live version of the app here: [NasaExplorer Demo](https://nasa-explorer-zeta.vercel.app)

---

## Folder Structure

**Note on `app/` Folder and Routes**  
The `app/` directory follows the Next.js App Router convention (introduced in Next.js 13).  
Each folder inside `app/` represents a route in the application.  

- `app/page.tsx` → `/` (Home page — displays APOD and quick links to Mars images)  
- `app/mars/page.tsx` → `/mars` (Mars Rover image explorer with filters)  
- `app/gallery/page.tsx` → `/gallery` (Past APODs and Mars images gallery)  
- `app/layout.tsx` → Application-wide layout (shared header, footer, and metadata)  

The App Router allows co-locating **page**, **loading**, **error**, and **layout** files per route, making the structure modular and easy to maintain.

```
NasaExplorer/
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── components/          # Reusable UI components
│   ├── app/                 # Next.js app and routes
│   ├── stores/              # Global store for gamification
│   ├── lib/                 # API calls and utility functions
│   ├── hooks/               # Custom React hooks
├── .env.local               # Environment variables (NASA API key)
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/abuabdul/NasaExplorer.git
cd NasaExplorer
```

Install dependencies (choose your package manager):

```bash
npm install
```

---

## Usage

Start the development server:

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000` to explore the app.

---

## Technologies

- **Framework**: Next.js (bootstrapped with create-next-app)  
- **Language**: TypeScript (~94%), CSS (~5%), JavaScript (~1%)  
- **Font Optimization**: Uses `next/font` with the Geist font family from Vercel  
- **Styling and Theme**: Uses `shadcn` with the space theme base color zinc
- **Deployment**: Easily deployable to Vercel  
- **Testing**: Jest + React Testing Library for unit/integration testing

---

## API Details

Uses NASA’s official public APIs:

1. **APOD (Astronomy Picture of the Day)**  
2. **Mars Rover Photos** — filter by rover, camera, sol (Martian day), date, etc.
2. **NASA Search Library** — Search by terms, keywords.

**Environment Variables Setup:**  
Create a `.env` file in the root of your project and add:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

You can get your API key from [NASA Open APIs](https://api.nasa.gov/).

---

## Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Testing is powered by:

- **Jest** — JavaScript testing framework  
- **React Testing Library** — For DOM component testing

Test commands in `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## License

This project is licensed under the **Apache 2.0 License**.

---

## Acknowledgments

- Inspired by NASA’s amazing public image APIs  
- Built with love using Next.js and Vercel tooling

---

**Ready to explore the cosmos?** Launch the app locally and embark on your NASA-powered journey!