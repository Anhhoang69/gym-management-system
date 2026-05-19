$envJson = Get-Content backend/postman_environment.json -Raw | ConvertFrom-Json
$superAdminToken = ($envJson.values | Where-Object { $_.key -eq "superAdminToken" }).value
$pendingMemberUserId = ($envJson.values | Where-Object { $_.key -eq "pendingMemberUserId" }).value
$packageId = ($envJson.values | Where-Object { $_.key -eq "packageId" }).value
$pricingId = ($envJson.values | Where-Object { $_.key -eq "pricingId" }).value

$headers = @{
    Authorization = "Bearer $superAdminToken"
    "Content-Type" = "application/json"
}

$body = @{
    memberUserId = $pendingMemberUserId
    packageId = $packageId
    pricingId = $pricingId
    startDate = "2026-07-01T00:00:00Z"
} | ConvertTo-Json

"Sending Request with:"
"Token: $superAdminToken"
"pendingMemberUserId: $pendingMemberUserId"
"packageId: $packageId"
"pricingId: $pricingId"

try {
    $res = Invoke-WebRequest -Uri "http://localhost:5294/api/contracts/draft" -Headers $headers -Method Post -Body $body
    $res.Content
} catch {
    "STATUS CODE: " + $_.Exception.Response.StatusCode.value__
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $ErrResp = $streamReader.ReadToEnd()
    $streamReader.Close()
    $ErrResp
}
