using Microsoft.AspNetCore.Identity;

// Generate ASP.NET Identity v3 password hash for seed SQL
var hasher = new PasswordHasher<object>();
var password = "123456Aa@";

var hash = hasher.HashPassword(null!, password);

Console.WriteLine("=== ASP.NET Identity Password Hash ===");
Console.WriteLine($"Password : {password}");
Console.WriteLine($"Hash     : {hash}");
Console.WriteLine();
Console.WriteLine("-- Copy this into 02_users.sql PasswordHash column:");
Console.WriteLine($"'{hash}'");
Console.WriteLine();

// Verify it works
var result = hasher.VerifyHashedPassword(null!, hash, password);
Console.WriteLine($"Verify   : {result}"); // should be Success
