# NextJs + TypeScript + SCSS – Starter Template

This custom starter template builds on the minimal NextJs + TypeScript + SCSS setup, adding enhanced styling support, improved linting, and a more scalable project structure.

## Features

- **TypeScript Integration**: Fully typed codebase for enhanced type safety and developer productivity.
- **SCSS with CSS Modules**: Supports SCSS and CSS Modules for scoped styling.
- **Modular Structure**: Organized folders for components, pages, hooks, providers, styles, and utilities to promote maintainability.
- **Global SCSS Variables**: Pre-imports media query variables from `src/styles/_media.scss` in all SCSS files for consistent styling (We are doing this because CSS variables doesn't work with media query widths/heights).
- **Theme Support**: Includes `src/styles/_theme.scss` with CSS variables along with light/dark mode support.
- **Dockerfile**: Dockerfiles setup for development and production.

## Folder Structure

```
public/
# Static assets served directly from the root URL

src/
  ├── app/
  │   # NextJs pages & layout components
  ├── assets/
  │   # Static assets (e.g., images)
  ├── components/
  │   # Smaller reusable UI components with some separations
  │   # Read as ui components, layout components, page components etc.
  ├── providers/
  │   # Context wrappers (e.g., ThemeProvider)
  ├── hooks/
  │   # Hooks (e.g., useAuth)
  ├── styles/
  │   ├── globals.scss
  │   │   # Entry point. Default styles for global HTML elements
  │   ├── _media.scss
  │   │   # Media query variables (to use in SCSS files)
  │   ├── _theme.scss
  │   │   # CSS vars and default theme with light/dark mode support
  │   ├── _components.scss
  │   │   # Global reusable styles for components
  │   ├── _pages.scss
  │   │   # Global reusable styles for layouts, pages
  ├── utils/
  │   # Utility functions (e.g., generative-functions.ts)
  ├── types/
  │   # Types (e.g., user-types.ts)
```

## Getting Started

1. **Clone the Template**:

   ```bash
   git clone -b next-ts-scss https://github.com/viraj-gamdha/aplance-app-templates.git my-project
   cd my-project
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Application**:

   - Development mode with hot reload:
     ```bash
     npm run dev
     ```
   - Production build:
     ```bash
     npm run build
     npm run start
     ```

4. **Access the Application**:
   - The server runs on `http://localhost:3000`.

## Scripts

- `npm run dev`: Start the Next.js development server with hot reloading on [http://localhost:3000](http://localhost:3000).
- `npm run build`: Build the Next.js application for production.
- `npm run start`: Start the production server after building.
- `npm run lint`: Run ESLint to check code style and catch potential issues.

## Notes

- **Scalability**: Add new components in `components/`, hooks in `hooks/`, and styles in `styles/` to grow your application modularly.
- **Customization**: Modify `next.config.ts` for custom configurations like image domains, redirects, or environment variables. Add utilities in `utils/` as needed.
- **Styling**: Use global styles in `styles/globals.css` or SCSS modules for scoped styling. For theming and media queries, consider organizing reusable variables in `styles/_theme.scss` and `styles/_media.scss`.
- **Deployment**: Utilize Docker for containerized deployment. Before building, set `output: 'standalone'` in `next.config.ts` to generate a minimal production bundle. This ensures all necessary files are included for running the app outside the development environment.

