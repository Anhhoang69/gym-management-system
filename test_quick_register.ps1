$envJson = Get-Content backend/postman_environment.json -Raw | ConvertFrom-Json
$staffToken = ($envJson.values | Where-Object { $_.key -eq "staffToken" }).value
$branchId = ($envJson.values | Where-Object { $_.key -eq "branchId" }).value
$packageId = ($envJson.values | Where-Object { $_.key -eq "packageId" }).value
$pricingId = ($envJson.values | Where-Object { $_.key -eq "pricingId" }).value

$headers = @{
    Authorization = "Bearer $staffToken"
    "Content-Type" = "application/json"
}

$body = @{
    fullName = "Quick Member Test"
    email = "qmember_12345@gym.local"
    phoneNumber = "0941273999"
    packageId = $packageId
    pricingId = $pricingId
    branchId = $branchId
    startDate = "2026-06-01"
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "http://localhost:5294/api/members/quick-register" -Headers $headers -Method Post -Body $body
    $res | ConvertTo-Json -Depth 5
} catch {
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $ErrResp = $streamReader.ReadToEnd()
    $streamReader.Close()
    $ErrResp
}
