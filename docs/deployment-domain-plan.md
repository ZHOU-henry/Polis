# Domain And Hosting Plan

## Goal

Move Agora from the temporary `trycloudflare.com` URL to a stable branded
domain, then choose between:

- cheapest local-machine hosting with a custom domain
- low-cost overseas VPS hosting
- China / Hong Kong oriented cloud hosting

## Option A - Cheapest Immediate Upgrade

Shape:

- buy a domain
- move DNS to Cloudflare
- replace the current quick tunnel with a named Cloudflare Tunnel
- point a custom hostname such as `agora.yourdomain.com` at the tunnel

Why:

- lowest cost
- keeps the current machine as the runtime
- easiest path from the current public demo

Tradeoffs:

- your local machine must stay online
- uptime and latency stay tied to the local network
- not ideal for real production operations

Estimated cost:

- domain only
- roughly `USD 9-11 / year` for a `.com`, depending on registrar

## Option B - Best Value Production Path

Shape:

- buy a domain
- use Cloudflare DNS and proxy
- deploy Agora on a small overseas cloud server
- run Next.js + Fastify + PostgreSQL on the server

Recommended starting profile:

- 2 vCPU
- 2-4 GB RAM
- 40-80 GB SSD

Why:

- much more stable than local hosting
- still inexpensive
- good enough for early product demos and small-scale real traffic

Recommended candidates:

- Hetzner Cloud
- DigitalOcean
- AWS Lightsail

## Option C - China / Hong Kong Friendly Path

Shape:

- if you want no ICP filing friction, use Hong Kong
- if you want mainland China hosting, expect ICP / BeiAn work before going live

Recommended starting profile:

- Tencent Cloud Lighthouse Hong Kong
- Alibaba Cloud Simple Application Server Hong Kong

Why:

- easier latency path for China-based use
- lower operations friction than managing a full mainland enterprise stack early

## Practical Recommendation

1. buy the domain now
2. move the current demo from Quick Tunnel to a named Cloudflare Tunnel on that domain
3. when product iteration slows down, move Agora to a low-cost VPS
4. keep Cloudflare in front for DNS, TLS, and caching
5. only move to mainland China hosting when you are ready to handle the compliance path

## Reference Sources

- Cloudflare Registrar: at-cost model
- Verisign `.com` registry wholesale fee
- Spaceship domain pricing
- Porkbun domain pricing
- Hetzner Cloud pricing
- DigitalOcean Droplets pricing
- AWS Lightsail pricing
- Tencent Cloud Lighthouse pricing
- Alibaba Cloud Simple Application Server example pricing
