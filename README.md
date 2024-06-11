## Usage

[Base url](https://project-midnight-backend.onrender.com/)

## Endpoints

- `users`
  <br>
  | Name | Method | Request | Response | Description |
  |-------|--------|-------------------------------------|------------------------------------------------|-------------------------------------------------|
  | `remove-app` | `PATCH` | - `{ provider: Spotify, userId: string }` - Request body | `NormalizedUser` type from `project_midnight` (lib) | Remove connected app |
  | `search-history` | `GET` | - `{ userId: string }` - Request params | `Track`[] type from `project_midnight` (lib) | Get user search history |
  | `tracks` | `GET` | - `{ userId: string }` - Request params <br> - `{ page: string }` - Request query <br> - `{ query: string, sortType: string, order: string, isFavourite: boolean }` - Request query (optional) <br><br> `query` - by default empty <br><br> `sortType` has next values: <br> - `updatedAt` (By upload date, default value) <br> - `title` (By alphabet) <br> - `source` (By source) <br><br> `order` has next values: <br> - `asc` <br> - `desc` (by default) <br><br> `isFavourite` has next values: <br> - `true` (returns only favourite tracks) <br> - `false` (returns all user saved tracks including `query`, `sortType` and `order` ) | `Track`[] type from `project_midnight` (lib) | Get user saved tracks |
- `track`
  <br>
  | Name | Method | Request | Response | Description |
  |-------|--------|-------------------------------------|------------------------------------------------|-------------------------------------------------|
  | `new` | `POST` | - `{ userId: string, title: string, url: string, urlId: string, imgUrl: string, author: string, source: string, duration: string }` - Request body | `Track` type from `project_midnight` (lib) | Track creation |
  | `get-info` | `POST` | - `{ url: string, userId: string, duration: string }` - Request body | `{ id: string, userIdSearchHistory: string, createdAt: Date, updatedAt: Date, title: string, author: string, imgUrl: string, source: string, url: string, urlId: string, duration: string }` | Get track info |
  | `delete-from-saved` | `DELETE` | - `{ trackId: string }` - Request params | `Track` type from `project_midnight` (lib) | Remove track from saved |
  | `check-track` | `GET` | - `{ trackId: string, userId: string }` - Request params | `Track` type from `project_midnight` (lib) OR `404` if its not found | Check if track exsists in user saved tracks |

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
