$baseUrl = "http://localhost:5294"

# 1. Login as Admin
$adminBody = @{
    emailOrPhone = "superadmin@gymfit.vn"
    password = "123456Aa@"
} | ConvertTo-Json
$adminRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
$adminToken = $adminRes.data.token
Write-Host "Admin Token obtained."

# 2. Get Room
$roomsRes = Invoke-RestMethod -Uri "$baseUrl/api/rooms" -Method Get -ContentType "application/json" -Headers @{ Authorization = "Bearer $adminToken" }
$roomId = $roomsRes.data[0].roomId
Write-Host "Room ID: $roomId"

# 3. Get PT Staff
$ptRes = Invoke-RestMethod -Uri "$baseUrl/api/users?page=1&pageSize=50&role=PT" -Method Get -ContentType "application/json" -Headers @{ Authorization = "Bearer $adminToken" }
$ptStaffUserId = $ptRes.data.items[0].userId
Write-Host "PT Staff ID: $ptStaffUserId"

# 4. Create Class
$rand = Get-Random -Minimum 1000 -Maximum 9999
$day = Get-Random -Minimum 10 -Maximum 28
$date = "2026-12-$day"

$classBody = @{
    title = "Yoga Morning $rand"
    description = "Fresh start"
    date = $date
    startTime = "10:00:00"
    endTime = "11:00:00"
    classType = "Yoga"
    capacity = 2
    minCapacity = 1
    trainerStaffId = $ptStaffUserId
    roomId = $roomId
} | ConvertTo-Json

$classRes = Invoke-RestMethod -Uri "$baseUrl/api/classes" -Method Post -Body $classBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $adminToken" }
$classId = $classRes.data
Write-Host "Class Created: $classId"

# 5. Login as Member
$memberBody = @{
    emailOrPhone = "nguyen.van.an@gmail.com"
    password = "123456Aa@"
} | ConvertTo-Json
$memberRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $memberBody -ContentType "application/json"
$memberToken = $memberRes.data.token
Write-Host "Member Token obtained."

# 6. Book Class
try {
    $bookRes = Invoke-RestMethod -Uri "$baseUrl/api/classes/$classId/book" -Method Post -ContentType "application/json" -Headers @{ Authorization = "Bearer $memberToken" }
    Write-Host "Book Success: " ($bookRes | ConvertTo-Json -Depth 5)
} catch {
    $streamReader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
    $errRes = $streamReader.ReadToEnd()
    Write-Host "Book Failed: " $errRes
}
