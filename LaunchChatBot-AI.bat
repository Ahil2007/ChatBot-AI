@echo off
cd /d "%~dp0"   # Change directory to the location of the batch file
start /B node server.js  # Start the Node.js server in the background
timeout /t 2  # Wait for 2 seconds to ensure the server starts
start "" "http://localhost:3000"  # Open the chatbot interface in the default web browser
exit
