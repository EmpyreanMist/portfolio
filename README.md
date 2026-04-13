# Christian's Portfolio

A personal portfolio showcasing real projects, technical experiments, and things I build out of curiosity.

## What's inside

- A short introduction about me
- Work experience and certifications
- Selected projects I've worked on
- A Labs section with experiments and live data integrations
- Tools and technologies I use
- A way to get in touch

## Labs

The Labs section is where I explore ideas, test APIs, and build small focused experiments.
It’s less about polish and more about learning, problem-solving, and technical depth.

Examples include:
- Live statistics fetched from external APIs
- UI and UX experiments
- Small tools and technical explorations

### Garmin steps

The Labs Garmin card reads today's step count from `/api/garmin/steps` and refreshes once per hour. The default path uses the unofficial Node package `garmin-connect`:

- `GARMIN_USERNAME` or `GARMIN_EMAIL`
- `GARMIN_PASSWORD`
- `GARMIN_DOMAIN` (optional, defaults to `garmin.com`)
- `GARMIN_STEPS_TIME_ZONE` (optional, defaults to `Europe/Stockholm`)
- `GARMIN_STEPS_GOAL` (optional, defaults to `10000`)

Wrap `GARMIN_PASSWORD` in quotes if it contains `#` or other shell/env special characters.

`garmin-connect` does not currently handle MFA, so accounts requiring a one-time code may fail to log in. As a fallback, configure a Garmin Health API proxy or an Android/Health Connect automation endpoint with:

- `GARMIN_STEPS_ENDPOINT`
- `GARMIN_STEPS_BEARER_TOKEN` (optional)
- `GARMIN_STEPS_API_KEY` (optional)
- `GARMIN_STEPS_API_KEY_HEADER` (optional, defaults to `x-api-key`)

The endpoint can return JSON such as `{ "steps": 7450, "goal": 10000, "monthSteps": 123456, "monthGoalDays": 8, "date": "2026-04-12" }`.

## Tech Stack

Built with **Next.js**, **React**, and **Tailwind CSS**.
