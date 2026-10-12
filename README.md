# CompF1

CompF1 is a full-stack Formula 1 prediction platform where users predict driver performance across Grand Prix sessions and earn points based on positional accuracy.

The project is built to provide a simple alternative to traditional fantasy formats by focusing on race-weekend predictions and user competition.

## Features

- User signup and login
- Persistent authentication with HttpOnly cookies
- Formula 1 event and session data through FastF1
- Driver prediction submission
- Position-based scoring
- SQLite-backed user and prediction data
- League and competition features in development

## Tech Stack

**Frontend:** React, JavaScript, HTML/CSS  
**Backend:** Python, FastAPI  
**Data:** FastF1  
**Database:** SQLite  
**Tools:** Git, GitHub, Uvicorn, npm

## Scoring

Predictions are scored based on how close a driver finishes to the predicted position.

| Difference | Points |
| --- | ---: |
| Exact position | 5 |
| 1 position away | 3 |
| 2 positions away | 2 |
| 3 positions away | 1 |
| 4+ positions away | 0 |

## Current Progress

### Completed
- [x] Home page
- [x] Signup and login
- [x] Session-based authentication
- [x] FastF1 event retrieval
- [x] Prediction interface
- [x] Prediction storage
- [x] Basic scoring logic
- [x] League creation and membership

### In Progress
- [ ] User dashboard
- [ ] League leaderboards
- [ ] Head-to-head competition
- [ ] Prediction history and statistics

## Architecture

```text
React Frontend
      |
      | REST API
      v
FastAPI Backend
   |        |
   v        v
FastF1    SQLite
