$body = @{
    emailOrPhone = "superadmin@gymfit.vn"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5294/api/auth/forgot-password" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json -Depth 5
} catch {
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $ErrResp = $streamReader.ReadToEnd()
    $streamReader.Close()
    $ErrResp
}
