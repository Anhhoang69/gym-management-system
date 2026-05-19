$headers = @{
    Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAzLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjAwMDAwMDAwLTAwMDMtMDAwMC0wMDAwLTAwMDAwMDAwMDAwNiIsImVtYWlsIjoic2FsZXMucTFAZ3ltZml0LnZuIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoic2FsZXMucTFAZ3ltZml0LnZuIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA8LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3RhZmYiLCJleHAiOjE3NzkxODgyODIsImlzcyI6Imd5bS1tYW5hZ2VtZW50LXN5c3RlbSIsImF1ZCI6Imd5bS1tYW5hZ2VtZW50LXN5c3RlbS1jbGllbnQifQ.J3l8b5b7-u22-z5H55x-gb1pvGDvI0qRUPFUiTQnK-M"
}

# Use the staffToken from postman_environment.json:
$envJson = Get-Content backend/postman_environment.json -Raw | ConvertFrom-Json
$staffToken = ($envJson.values | Where-Object { $_.key -eq "staffToken" }).value
$branchId = ($envJson.values | Where-Object { $_.key -eq "branchId" }).value
$leadSourceId = ($envJson.values | Where-Object { $_.key -eq "leadSourceId" }).value

$headers = @{
    Authorization = "Bearer $staffToken"
    "Content-Type" = "application/json"
}

$body = @{
    name = "Test Lead Auto"
    phone = "0941273543"
    email = "lead_12345@gmail.com"
    branchId = $branchId
    sourceId = $leadSourceId
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "http://localhost:5294/api/leads" -Headers $headers -Method Post -Body $body
    $res | ConvertTo-Json -Depth 5
} catch {
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $ErrResp = $streamReader.ReadToEnd()
    $streamReader.Close()
    $ErrResp
}
