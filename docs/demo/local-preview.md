# Local Preview Guide

## Goal

Start and stop Agora quickly in either interactive mode or safer read-only preview mode.

## Start Interactive Preview

```bash
./scripts/start-preview.sh interactive
```

Use this when you want to test write actions locally.

## Start Read-Only Preview

```bash
./scripts/start-preview.sh readonly YOUR_PASSWORD
```

Use this when you want a safer demo:

- the site is password-gated
- the UI disables write actions
- the API rejects write requests

## Stop Preview

```bash
./scripts/stop-preview.sh
```

## Check Status

```bash
./scripts/check-preview.sh
```
