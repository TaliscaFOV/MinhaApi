# Copilot instructions for MinhaApi

## Project overview

This repository is a full-stack application made of two main parts:

- An ASP.NET Core Web API in `MinhaApi/` for business logic and persistence.
- A Vite + React + TypeScript frontend in `frontend/` for the UI.
- A MySQL schema defined in `banco.sql` and configured via `MinhaApi/appsettings.json`.

The API is organized around the `Controller -> Service -> Repository` pattern. The frontend mirrors this in feature modules such as `Cliente`, `Produto`, and `Venda`, with pages, forms, lists, and service wrappers under `frontend/src/`.

## Build, run, and validation commands

### Backend API

Run these from the repository root:

```bash
dotnet restore "MinhaApi/MinhaApi.csproj"
dotnet build "MinhaApi/MinhaApi.csproj"
dotnet run --project "MinhaApi/MinhaApi.csproj"
```

When the API is running locally, Swagger is exposed in development at:

```text
http://localhost:5150/swagger
```

### Frontend app

Run these from the repository root or inside `frontend/`:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

The frontend is a Vite app and runs on the default Vite port:

```text
http://localhost:5173
```

### Tests

This repository does not currently include an automated test project or a configured test runner. There is no repo-specific single-test command to run today.

If a test project is added later, prefer targeted execution instead of the full suite:

```bash
dotnet test "<path-to-test-project>.csproj" --filter "Name~<TestName>"
```

## High-level architecture

### Backend

The ASP.NET Core app in `MinhaApi/` is configured in `Program.cs` and does the following:

- registers controllers and Swagger
- enables CORS for `http://localhost:5173`
- registers repositories and services with dependency injection
- configures JWT authentication using the `Jwt` section from `appsettings.json`
- maps API controllers under `/api`

The repository uses direct MySQL access instead of Entity Framework Core. The pattern is:

- `Controllers/*Controller.cs` handle HTTP requests and status codes
- `Services/*Service.cs` contain the business behavior and validation
- `Repositories/*Repository.cs` talk to MySQL with `MySqlConnection` and parameterized queries
- `Models/` and `DTO/` hold the domain and request/response structures

This is a data-entry/admin API with modules such as `cliente`, `produto`, `venda`, `fornecedor`, `departamento`, and `tipo`.

### Frontend

The frontend is a React single-page app in `frontend/src/`:

- `App.tsx` and `main.tsx` bootstrap routing and the application shell
- `pages/` contains page-level screens such as `LoginPage`, `ClientePage`, `ProdutoPage`, and `VendaPage`
- `components/` stores reusable UI for forms and list tables and navigation
- `services/` wraps API calls and centralizes HTTP behavior
- `context/AuthContext.tsx` persists login state in `localStorage`

The frontend attaches the JWT automatically through `frontend/src/services/api.ts` on each request, and the backend expects `Authorization: Bearer ...` headers for protected endpoints.

### Data and auth

- `banco.sql` is the local schema seed for the database and includes the `usuarios` table used for login.
- `MinhaApi/Models/LoginRequest.cs` and `MinhaApi/Services/AuthService.cs` implement the login flow.
- Protected API controllers use `[Authorize]`, while `AuthController` exposes an anonymous `[HttpPost("login")]` endpoint.

## Key conventions in this repository

- Keep the current layered structure: controller -> service -> repository. Do not bypass the service layer for business logic.
- Use the route convention already present in the API: `[Route("api/[controller]")]` with controller names matching the entity (for example, `ProdutoController`, `ClienteController`).
- Prefer parameterized queries in repository code. This project uses direct SQL and `@Parameter` names rather than string interpolation.
- Follow the MySQL naming conventions already used in the schema: table names such as `produto`, `cliente`, `venda`, and `usuarios`, with IDs like `idProduto`, `idCliente`, `idVenda` or `id` depending on the table.
- Keep CORS and local URLs aligned with the Vite frontend. The backend currently allows `http://localhost:5173` only.
- Keep auth behavior centralized: login state is persisted in `localStorage` on the frontend, and the Authorization header is attached in `frontend/src/services/api.ts`.
- Treat `banco.sql` as the local database source of truth; if schema changes are needed, update both the SQL script and the matching model/repository code.
- The project is not using a full-blown .NET solution pattern for tests or layered infrastructure; keep changes consistent with the compact structure already present in the repo.

## Working in this repo

When making changes:

- prefer the existing conventions over introducing new frameworks or layers
- update both the API and the frontend together when a new field or endpoint is added
- keep database changes aligned with the schema in `banco.sql`
- use the existing naming and folder structure (`Controllers`, `Services`, `Repositories`, `Models`, `DTO`, `src/pages`, `src/components`, `src/services`) instead of creating a different architecture for one feature
