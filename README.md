## Usage

[Base url](https://project-midnight-backend.onrender.com/)

## Endpoints

- `users`
  <br>
  | Name | Method | Request | Response | Description |
  |-------|--------|-------------------------------------|------------------------------------------------|-------------------------------------------------|
  | `remove-app` | `PATCH` | - `{ provider: Spotify, userId: string }` - Request body | `NormalizedUser` type from `project_midnight` (lib) | Remove connected app |
- `track`
  <br>
  | Name | Method | Request | Response | Description |
  |-------|--------|-------------------------------------|------------------------------------------------|-------------------------------------------------|
  | `new` | `POST` | - `{ url: string, userId: string }` - Request body | `Track` type from `project_midnight` (lib) | Track creation |

## How to run localy

1. Add env's
2. Split your terminal and run `npm run buildDev` and then `npm run dev`

## Errors from server

We use `react-hook-form` to work with forms and give errors from server.
<br>
**Important**: `react-hook-form` is **not** used for validating data. It needs to show errors. The types of errors you can find in `src/shared/types/ServerError.ts`.
<br>
Here is the example backend response:
<br>
![alt text](https://iili.io/JM7u6Qe.jpg)
