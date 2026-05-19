$envFile = Get-Content "backend/postman_environment.json" | ConvertFrom-Json
$baseUrl = "http://localhost:5294"

# Login as staff to get token
$loginBody = @{
    emailOrPhone = "sales.q1@gymfit.vn"
    password = "123456Aa@"
} | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.data.token
Write-Host "Staff Token: $token"

# Create a lead
$rand = Get-Random -Minimum 10000000 -Maximum 99999999
$phone = "09$rand"
$email = "lead_$rand@gmail.com"

$leadBody = @{
    name = "Test Lead Newman Debug"
    phone = $phone
    email = $email
    branchId = "aaaaaaaa-0001-0000-0000-000000000003"
    sourceId = "dddddddd-0001-0000-0000-000000000001"
} | ConvertTo-Json

$leadRes = Invoke-RestMethod -Uri "$baseUrl/api/leads" -Method Post -Body $leadBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
$leadId = $leadRes.data.leadId
Write-Host "Lead Created: $leadId"

# Convert lead
$convertBody = @{
    packageId = "cccccccc-0001-0000-0000-000000000001"
    pricingId = "afab75bb-d6fb-46d1-8532-ac06e85e0637"
    startDate = "2026-06-01"
} | ConvertTo-Json

try {
    $convertRes = Invoke-RestMethod -Uri "$baseUrl/api/leads/$leadId/convert-to-member" -Method Post -Body $convertBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
    Write-Host "Convert Success: " ($convertRes | ConvertTo-Json -Depth 5)
} catch {
    $streamReader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
    $errRes = $streamReader.ReadToEnd()
    Write-Host "Convert Failed: " $errRes
}
