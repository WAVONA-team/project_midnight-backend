# Project Midnight Backend

**Project Midnight Backend** is a robust Node.js/TypeScript server powering a modern music management platform. Designed for music enthusiasts and integrators, it enables seamless user authentication, multi-service music library management, and playlist curation. The backend is built to support scalable, secure, and extensible music experiences across web and mobile clients.

## Key Features

- **Multi-Service Music Integration**: Connects with YouTube, Spotify and SoundCloud for unified music management.
- **User-Centric Library**: Secure user authentication, personal search history, and favorite tracks.
- **Advanced Playlist Management**: Create, update, and organize custom playlists and saved tracks.
- **Rich Track Metadata**: Handles detailed track info, including source, author, and artwork.
- **Secure & Modern Auth**: OAuth with Passport.js, JWT, and refresh token flows.
- **Production-Ready API**: RESTful endpoints, input validation, and error handling.

## Technologies & Architecture

- **Core Stack**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL, managed via Prisma ORM (see [`prisma/schema.prisma`](prisma/schema.prisma)).
- **Authentication**: Passport.js (multi-provider OAuth), JWT, bcrypt for password security.
- **API Structure**: Modular routing (`src/routes/`), controller-service pattern (`src/controllers/`, `src/services/`), and Zod for schema validation.
- **Dev Experience**: TypeScript-first, ESLint/Prettier, hot-reload with Nodemon, environment config via dotenv.
- **Email & Notifications**: Nodemailer integration for user flows.
- **Extensibility**: Clean separation of concerns, easy to add new music providers or user features.

### Project Structure

```
src/
  controllers/   // Business logic for users, tracks, playlists, auth
  routes/        // API endpoints (auth, users, tracks, playlists, music services)
  services/      // Core services: user, track, playlist, auth, email, tokens
  middlewares/   // Validation, error handling, etc.
  zodSchemas/    // Input validation schemas
  types/         // Shared TypeScript types
prisma/
  schema.prisma  // Database models: User, Track, Playlist, Token
```
