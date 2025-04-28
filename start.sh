#!/bin/bash

cd frontend
bun i

cd ../backend
bun i

cd ..

# Launch Ptyxis with all services in tabs

ptyxis --tab --title="Frontend" -x "devbox run 'cd frontend && bun run start'" 
ptyxis --tab --title="Backend" -x "devbox run 'cd backend && bun run start:dev backend'" 
ptyxis --tab --title="Booking Service" -x "devbox run 'cd backend && bun run start:dev booking-service'" 
ptyxis --tab --title="Logging Service" -x "devbox run 'cd backend && bun run start:dev logging-service'"
ptyxis --tab --title="User Service" -x "devbox run 'cd backend && bun run start:dev user-service'"

echo "All services launched in Ptyxis terminal tabs"
