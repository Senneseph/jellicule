@echo off
REM Start the development environment
echo Starting Jellicule development environment...
docker-compose -f docker-compose.dev.yaml up -d

REM Print instructions
echo.
echo Development environment started!
echo Open your browser to http://localhost:7327/
echo.
echo Any changes to the components will automatically be reflected in the browser.
echo To stop the development environment, run: docker-compose -f docker-compose.dev.yaml down
