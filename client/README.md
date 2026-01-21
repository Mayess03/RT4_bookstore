# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# Authentication & Role Redirection

This project implements a role-based authentication system.

After login:

- If the connected user has role **ADMIN**, he is automatically redirected to:  
  👉 `/admin`

- If the connected user has role **USER**, he is automatically redirected to:  
  👉 `/home`

This behavior is handled on the frontend by decoding the JWT token and checking the `role` field.

Two simple components were created for testing:

- `AdminComponent` → route: `/admin`
- `HomeComponent` → route: `/home`

They are currently basic placeholder pages used only to verify that the redirection and role guards work correctly.

Access control:
- `/home` is protected by `AuthGuard` (user must be logged in)
- `/admin` is protected by `AuthGuard` + `AdminGuard` (user must be logged in and have ADMIN role)
