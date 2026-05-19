$token = (Get-Content backend/postman_environment.json | ConvertFrom-Json).values | Where-Object key -eq "superAdminToken" | Select-Object -ExpandProperty value

$body = @{
    code = "SUMMER2025"
    discountType = "Percentage"
    discountValue = 10
    startDate = "2026-01-01"
    endDate = "2026-12-31"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5294/api/promotions/validate" -Method Post -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
    $response | ConvertTo-Json -Depth 5
} catch {
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $ErrResp = $streamReader.ReadToEnd()
    $streamReader.Close()
    $ErrResp
}
