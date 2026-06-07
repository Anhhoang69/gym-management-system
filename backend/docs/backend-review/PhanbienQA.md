# ❓ Câu hỏi phản biện tổng hợp — Mọi Module

> Tập hợp các câu hỏi phản biện khó nhất theo chủ đề. Đọc kỹ để tự tin trả lời.

---

## 🏗️ Architecture & Design

**Q: Tại sao không dùng Clean Architecture?**
> Clean Architecture (Domain/Application/Infrastructure/Presentation) phù hợp dự án lớn, team nhiều người. Đồ án chọn Layered Architecture đơn giản hơn: Controller → Service → EF Core → DB. Đủ separation of concerns, dễ maintain, không overhead. Nếu scale: tách Service thành Application + Domain layer.

**Q: Tại sao không có Repository Pattern?**
> EF Core DbContext + DbSet<T> đã implement Repository và Unit of Work pattern. Thêm `IRepository<T>` chỉ tăng boilerplate. Đây là architectural decision có chủ ý, được Microsoft khuyến nghị cho projects vừa và nhỏ.

**Q: Service lifetime là Scoped — tại sao không Singleton?**
> Scoped = 1 instance per HTTP request. `ApplicationDbContext` là Scoped (vì EF Core DbContext không thread-safe). Services phụ thuộc DbContext phải cùng lifetime. Singleton HttpClient (như OpenAIService) được inject qua `IHttpClientFactory`.

**Q: AutoMapper có overhead không?**
> AutoMapper reflection overhead nhỏ, khoảng 1-5ms per map. Với `ProjectTo<T>()`, mapping xảy ra ở DB level (SQL projection) — không load full entities vào memory. Acceptable với scale hiện tại.

**Q: Tại sao không dùng MediatR / CQRS?**
> MediatR/CQRS thêm complexity không cần thiết cho scope này. Commands/Queries thêm indirection layer. Trực tiếp gọi service đơn giản hơn, debug dễ hơn. Áp dụng khi có nhiều cross-cutting concerns (events, logging tập trung).

---

## 🔐 Security

**Q: JWT secret key lưu ở đâu trên production?**
> Railway Environment Variables (encrypted). Không trong code, không trong git. Key rotate bằng cách update Railway env var + redeploy.

**Q: Có thể forge JWT token không?**
> Không thể nếu secret key đủ mạnh (32+ bytes random). Attacker cần biết secret key để sign. HMAC-SHA256 là thuật toán mạnh.

**Q: CORS AllowAll có nguy hiểm không?**
> Với API backend (không set cookies), AllowAll không phải vấn đề lớn vì không có CSRF risk. Nhưng tốt hơn nên restrict origin về frontend domain để tránh unexpected clients. Trade-off: development convenience vs security strictness.

**Q: Làm sao protect API khỏi DDoS?**
> Railway load balancer có basic protection. Cloudflare WAF (nếu dùng). Rate limiting middleware. IP blocking. Với scale đồ án, không cần thiết implement đầy đủ.

---

## 🗄️ Database

**Q: Tại sao dùng Guid thay vì int identity?**
> Guid: globally unique (merge data từ multiple sources dễ), không predictable (security), không cần sequence. Trade-off: 16 bytes vs 8 bytes, index slightly less efficient. Modern PostgreSQL optimize Guid index tốt.

**Q: N+1 query problem có không?**
> Có thể xảy ra nếu không dùng Include() đúng chỗ. Hệ thống dùng Eager Loading (`Include().ThenInclude()`) và `ProjectTo<T>()` để minimize queries. EF Core profiler có thể detect N+1 issues.

**Q: Transactions được dùng khi nào?**
> `SaveChangesAsync()` là atomic cho 1 call. Khi cần multi-step transaction (lead import, merge): `await using var transaction = await _context.Database.BeginTransactionAsync()`.

**Q: Tại sao enum lưu string?**
> Debug dễ hơn (đọc DB thấy "Active" thay vì "2"). Migration an toàn hơn (thêm enum value không cần update existing data). Trade-off: tốn thêm storage nhỏ.

**Q: Soft delete có vấn đề performance không?**
> Queries phải filter `Status != Inactive`. Cần index trên Status column. EF Core Global Query Filter có thể auto-filter (chưa implement). Production: thêm `HasQueryFilter(x => x.Status != Inactive)` ở DbContext.

---

## 🚀 Performance & Scale

**Q: Hệ thống handle được bao nhiêu concurrent users?**
> Railway free tier: 512MB RAM, 1 vCPU. ASP.NET Core async/await: ~1000-2000 concurrent requests. Bottleneck: DB connections (Supabase free: 60). Connection pooling (built-in EF Core) giúp reuse connections.

**Q: Nếu cần scale, làm gì?**
> 1. Cache: Redis cho hot data (packages, branches, user context)
> 2. DB: PgBouncer connection pool, read replicas
> 3. Horizontal: Railway multiple instances
> 4. Queue: Background jobs cho email, payroll calc
> 5. CDN: Cloudinary đã handle static assets

**Q: Tại sao không có pagination cho mọi endpoint?**
> PagedResult được implement cho lists quan trọng (leads, contracts, invoices, users). Một số lists nhỏ (branches, packages, rooms) không paginate — dữ liệu ít, không cần thiết.

**Q: Background jobs có không?**
> Không có Hangfire/Quartz. Email gửi inline trong request (không async background). Production improvement: queue email jobs, schedule auto-expire contracts, daily payroll reminders.

---

## 💼 Business Logic

**Q: Promotion stack — có thể abuse không?**
> Promotions check: IsActive, còn hạn, đúng gói, còn slot. Admin control promotion maxUsage. Không có "per-member" limit — 1 member có thể dùng cùng promotion nhiều lần nếu maxUsage cho phép. Production: thêm per-member promotion usage tracking.

**Q: Khi contract expire, access card tự động deactivate không?**
> Không có background job auto-deactivate. AccessCard.ExpireDate tham chiếu nhưng không auto-check khi check-in. AttendanceService.CheckInAsync() check `c.EndDate >= DateTime.UtcNow` (contract) nhưng không check card ExpireDate riêng. Có thể là inconsistency nhỏ.

**Q: Member có thể có nhiều active contracts không?**
> Không có constraint ngăn. `BookClassAsync` lấy FirstOrDefault active contract — nếu nhiều, lấy contract đầu tiên. Production: enforce 1 active contract tại 1 thời điểm với unique constraint hoặc business validation.

**Q: Lead score algorithm có thể cải thiện không?**
> Hiện tại: nguồn + có email + contact count. Có thể thêm: urgency (timeline), budget, engagement score (số lần reply), demographic data. Machine learning: train model predict conversion probability.

---

## 🤖 AI Module

**Q: AI có thể replace human trainer không?**
> Không. AI cung cấp general advice dựa trên best practices. Không có assessment thực tế (xem form, measure strength). Không có feedback loop. AI là "supplement", không phải replacement. Disclaimer cần rõ ràng.

**Q: Chi phí OpenAI tháng bao nhiêu?**
> GPT-4o-mini: $0.15/1M input tokens, $0.60/1M output tokens. 1000 chat messages/tháng × 500 tokens/message ≈ $0.075-0.30/tháng. Rất rẻ cho scale đồ án.

**Q: Nếu OpenAI tăng giá hoặc thay đổi API?**
> Interface `IAIService` và `IEmailService` cho phép swap implementation. Có thể switch sang Gemini API, Claude API mà không ảnh hưởng caller code. `OpenAIService` là implementation detail, có thể replace.

---

## 🌐 Deployment & Ops

**Q: Database backup strategy?**
> Supabase tự động backup daily (free tier: 1 ngày giữ). Có thể export manual bằng pg_dump. Production: Point-in-Time Recovery (Supabase Pro), cross-region backup.

**Q: Monitoring & Logging?**
> ASP.NET Core structured logging (ILogger). Railway console logs. Chưa có centralized logging (Elasticsearch, Datadog). Production: thêm Serilog → Seq hoặc Railway log forwarding.

**Q: Health check endpoint?**
> Chưa implement `/health` endpoint. Railway cần health check để zero-downtime deploy. Production: `app.MapHealthChecks("/health")` kiểm tra DB connection.

**Q: Zero-downtime deployment?**
> Railway rolling deploy: deploy new container → health check → swap traffic. Cần health check endpoint để Railway know khi nào app ready.

---

## 📱 API Design

**Q: Tại sao không versioning API (/api/v1/...)?**
> Chưa cần — single frontend, single backend. Production với multiple clients (mobile app, 3rd party): thêm versioning header hoặc URL prefix.

**Q: REST hay GraphQL?**
> REST phù hợp với use case hiện tại — CRUD operations, rõ ràng endpoints. GraphQL over-engineering cho đồ án. Trade-off: REST cần multiple requests cho complex data, GraphQL flexible hơn.

**Q: Response format có chuẩn hóa không?**
> `ApiResponse<T>` wrapper: `{ success, message, data, errors }`. Consistent format giúp frontend xử lý dễ. Tuy nhiên, một số endpoints trả raw data không wrap. Cần standardize toàn bộ.
