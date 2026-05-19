$baseUrl = "http://localhost:5294"

# 1. Login as Member
$memberBody = @{
    emailOrPhone = "nguyen.van.an@gmail.com"
    password = "123456Aa@"
} | ConvertTo-Json
$memberRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $memberBody -ContentType "application/json"
$memberToken = $memberRes.data.token
Write-Host "Member Token obtained."

# 2. Book Class 4
try {
    $bookRes = Invoke-RestMethod -Uri "$baseUrl/api/classes/cccccccc-0002-0000-0000-000000000004/book" -Method Post -ContentType "application/json" -Headers @{ Authorization = "Bearer $memberToken" }
    Write-Host "Book Success: " ($bookRes | ConvertTo-Json -Depth 5)
} catch {
    $streamReader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
    $errRes = $streamReader.ReadToEnd()
    Write-Host "Book Failed: " $errRes
}
