# AI Hub

This is my business command centre built on Next.js + Supabase + Vercel.

## Architecture

5-layer pipeline: Research → Synthesis → Human Review → Content Creation → Distribution

## Tech stack

- Next.js (app router)
- Supabase (database + auth)
- Vercel (hosting)
- Tailwind CSS (styling)
- Firecrawl + Tavily (research agents)

## Key files

- DESIGN.md — brand colours, fonts, and styling tokens
- lib/research/context.ts — business context that feeds all agents
- agent-templates/ — system prompts for each agent
- skills/ — project-level skill files

## Rules for this project

- Always check DESIGN.md before making any styling changes
- Use functional agent names, not creative or mythological names
- Never hardcode API keys — always use environment variables
- Always write in British English
- Never use em dashes
- Sentence case for all headings and titles