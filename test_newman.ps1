$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running Postman Part 1: Auth & User..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npx newman run backend/postman_part1_auth.json -e backend/postman_environment.json --export-environment backend/postman_environment.json --delay-request 50

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Running Postman Part 2: Admin & Settings..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npx newman run backend/postman_part2_admin.json -e backend/postman_environment.json --export-environment backend/postman_environment.json --delay-request 50

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Running Postman Part 3: Membership & Invoices..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npx newman run backend/postman_part3_membership.json -e backend/postman_environment.json --export-environment backend/postman_environment.json --delay-request 50

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Running Postman Part 4: Attendance, Class, Payroll & Reports..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npx newman run backend/postman_part4_ops.json -e backend/postman_environment.json --export-environment backend/postman_environment.json --delay-request 50
