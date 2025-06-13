# Nufa Studio Application

This is a web application for creating and managing storyboards, featuring a detailed storyboard generation form.

## Development

To start the development server:

```bash
npm install
npm run dev
```

This will typically start the server on `http://localhost:5173`.

## Environment Variables

Create a `.env.local` file in the root of the project and add your Supabase credentials:

```
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
VITE_API_KEY="YOUR_GEMINI_API_KEY" # If using Gemini features
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project URL and anonymous key.
Replace `YOUR_GEMINI_API_KEY` with your Gemini API Key if you are using features that require it.

## Build

To create a production build:

```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment (General Guide for Static Hosting)

You can deploy the `dist/` folder to any static hosting service like Vercel, Netlify, GitHub Pages, or Supabase Static Hosting.

1.  **Configure Build Command**: Most platforms will auto-detect Vite, but ensure the build command is set to `npm run build` or `vite build`.
2.  **Output Directory**: Ensure the output/publish directory is set to `dist`.
3.  **Environment Variables**: Set up the same environment variables ( `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_KEY`) in your hosting provider's settings.
4.  **Base Path (If deploying to a subfolder)**: If your application is not deployed at the root of your domain (e.g., `yourdomain.com/nufa-studio/`), you need to configure the `base` option in `vite.config.ts`. For example:
    ```ts
    // vite.config.ts
    export default defineConfig({
      // ... other config
      base: '/your-project-name/', 
    });
    ```
    Rebuild your project after changing the `base` path.

### Example: Deploying to Vercel/Netlify

- Connect your Git repository.
- Configure build command: `npm run build` (or `vite build`).
- Configure output directory: `dist`.
- Add environment variables through their dashboard.

### Example: Supabase Static Hosting

Supabase offers static hosting. You can deploy using their CLI:

1. Install Supabase CLI: `npm install supabase --save-dev` (or globally)
2. Login: `npx supabase login`
3. Link project: `npx supabase link --project-ref YOUR_PROJECT_ID`
4. Deploy: `npx supabase functions deploy --no-verify-jwt dist` (Adjust command as needed for static files, this is an example often used for functions, for static sites it might be simpler or involve GitHub actions)

Refer to the specific documentation of your chosen hosting provider for detailed instructions.