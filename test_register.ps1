$body = @{
    fullName = "Test Member Auto"
    email = "regtest_12345@gym.local"
    phoneNumber = "0912345678"
    packageId = "fb5cd99d-16a4-44cd-a365-188b77d612e6"
    pricingId = "ee0d2afb-7a38-4228-bbf7-10646c039b56"
    branchId = "550e8400-e29b-41d4-a716-446655440000"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5294/api/register" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json -Depth 5
} catch {
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $ErrResp = $streamReader.ReadToEnd()
    $streamReader.Close()
    $ErrResp
}
