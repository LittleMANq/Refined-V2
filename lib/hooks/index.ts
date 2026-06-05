// App data hooks: TanStack Query over the thin data-access layer + AI clients.
// All reads/writes run with the user's session under RLS; AI goes through the
// Edge Functions (no client keys).
export * from './queries';
export * from './outfit';
