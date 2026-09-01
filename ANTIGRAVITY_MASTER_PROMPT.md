# Antigravity Master Build Prompt

Build **GrowSwap Ottawa**, a production-quality responsive web application for hyperlocal food exchange in Ottawa, Ontario.

## Goal
Create a visually impressive live local-food network where household gardeners and small growers can sell, swap, give away, or rescue extra produce. The system must also provide map-based supply intelligence, local value indexing, automated multi-party swap matching, harvest forecasting, and next-season garden planning.

## Stack
- Next.js, TypeScript, React
- Tailwind CSS
- Supabase Postgres, PostGIS, Auth, Realtime, Storage
- Vercel
- Mapbox GL JS or MapLibre
- Recharts

## UX direction
Premium, modern, warm, and data-driven. Avoid rustic/farmhouse visual clichés. Think "technology powering local food." Use large maps, polished cards, animated counters, smooth map transitions, clear charts, and subtle motion.

## Required signature demo flow
1. Open `Ottawa is Growing` dashboard with hundreds of seeded growers.
2. Change map radius and toggle map layers.
3. Click a tomato cluster and open Ottawa Tomato Index.
4. Open the default demo user's garden and show expected surplus.
5. Run SwapMatch and show a deterministic 3-way trade with animated routes.
6. Open 2027 Planner and optimize the garden based on local projected demand.
7. End on Ottawa Food Grid.

## Core technical requirements
- All residential map points must use obfuscated public coordinates.
- Use RLS for all private user data.
- Support `NEXT_PUBLIC_DEMO_MODE=true` and `DEMO_DATE`.
- Include resettable deterministic seed data.
- Build provider abstraction for AI; do not use AI for deterministic pricing or matching.
- Use PostGIS for distance search and geographic queries.
- Build locale architecture for `en-CA` and `fr-CA`.

## Success criteria
The product should communicate this idea within one minute of use:
"Ottawa is one interconnected distributed farm, and GrowSwap helps its participants discover, exchange, and plan local food production intelligently."
