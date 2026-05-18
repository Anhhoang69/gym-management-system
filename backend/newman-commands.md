# Newman CLI – Gym Management System API Tests

## Cài đặt Newman

```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

---

## Cấu trúc files kiểm thử

```
backend/
├── postman_environment.json        # Biến môi trường (baseUrl, tokens, IDs)
├── postman_part1_auth.json         # Module: Auth, Register, Profile/Me
├── postman_part2_admin.json        # Module: Users, Branch, Room, Package, Promotion
├── postman_part3_membership.json   # Module: Lead Sources, Lead, Member, Contract, Invoice, Payment
├── postman_part4_ops.json          # Module: Attendance, Class, Payroll, Notification, Request, Reports, AI, Audit
└── postman_environment.json
```

---

## Chạy từng phần

```bash
# Part 1 – Auth, Register, Profile
newman run postman_part1_auth.json \
  -e postman_environment.json

# Part 2 – Users, Branch, Room, Package, Promotion
newman run postman_part2_admin.json \
  -e postman_environment.json

# Part 3 – Lead, Member, Contract, Invoice, Payment
newman run postman_part3_membership.json \
  -e postman_environment.json

# Part 4 – Attendance, Class, Payroll, Notification, Request, Reports, AI, Audit
newman run postman_part4_ops.json \
  -e postman_environment.json
```

---

## Chạy toàn bộ tuần tự với báo cáo HTML

```bash
for part in postman_part1_auth postman_part2_admin postman_part3_membership postman_part4_ops; do
  newman run ${part}.json \
    -e postman_environment.json \
    --reporters cli,htmlextra,json \
    --reporter-htmlextra-export ./reports/${part}_report.html \
    --reporter-json-export ./reports/${part}_report.json \
    --delay-request 300
done
```

**Trên Windows (PowerShell):**

```powershell
$parts = @(
    "postman_part1_auth",
    "postman_part2_admin",
    "postman_part3_membership",
    "postman_part4_ops"
)

foreach ($part in $parts) {
    newman run "$part.json" `
        -e postman_environment.json `
        --reporters cli,htmlextra,json `
        --reporter-htmlextra-export "reports\${part}_report.html" `
        --reporter-json-export "reports\${part}_report.json" `
        --delay-request 300
}
```

---

## Thứ tự thực thi bắt buộc

> ⚠️ Phải chạy theo đúng thứ tự Part 1 → 2 → 3 → 4. Các biến môi trường như `superAdminToken`, `branchId`, `packageId`, `contractId`, `invoiceId` được sinh ra tuần tự và dùng cho các part sau.

| Thứ tự | File | Biến được sinh ra |
|--------|------|------------------|
| 1 | `postman_part1_auth.json` | `superAdminToken`, `gymOwnerToken`, `staffToken`, `memberToken`, `packageId`, `pricingId` |
| 2 | `postman_part2_admin.json` | `branchId`, `roomId`, `userId`, `staffUserId`, `promotionId`, `leadSourceId` |
| 3 | `postman_part3_membership.json` | `leadId`, `memberUserId`, `contractId`, `invoiceId`, `draftId` |
| 4 | `postman_part4_ops.json` | `classId`, `payrollFormulaId`, `notificationId`, `requestId` |

---

## Chạy trong CI/CD (GitHub Actions)

```yaml
# .github/workflows/api-test.yml
name: API Integration Tests
on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  api-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Node & Newman
        run: |
          npm install -g newman newman-reporter-htmlextra

      - name: Create reports directory
        run: mkdir -p reports

      - name: Run Part 1 – Auth & Register
        run: |
          newman run backend/postman_part1_auth.json \
            -e backend/postman_environment.json \
            --reporters cli,json \
            --reporter-json-export reports/part1.json \
            --delay-request 200

      - name: Run Part 2 – Admin Modules
        run: |
          newman run backend/postman_part2_admin.json \
            -e backend/postman_environment.json \
            --reporters cli,json \
            --reporter-json-export reports/part2.json \
            --delay-request 200

      - name: Run Part 3 – Membership Flow
        run: |
          newman run backend/postman_part3_membership.json \
            -e backend/postman_environment.json \
            --reporters cli,json \
            --reporter-json-export reports/part3.json \
            --delay-request 200

      - name: Run Part 4 – Operations & Reports
        run: |
          newman run backend/postman_part4_ops.json \
            -e backend/postman_environment.json \
            --reporters cli,json \
            --reporter-json-export reports/part4.json \
            --delay-request 200

      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: api-test-reports
          path: reports/
```

---

## Tham số Newman hay dùng

| Tham số | Mô tả |
|---------|-------|
| `-e` | File environment variables |
| `--delay-request <ms>` | Thời gian chờ giữa các request (tránh rate limit) |
| `--timeout-request <ms>` | Timeout cho từng request |
| `--bail` | Dừng ngay khi có test fail |
| `--folder "<tên>"` | Chỉ chạy một folder trong collection |
| `--reporters` | Loại báo cáo: `cli`, `json`, `htmlextra` |
| `--reporter-htmlextra-export` | Đường dẫn xuất báo cáo HTML |
| `--reporter-json-export` | Đường dẫn xuất báo cáo JSON |
| `--iteration-count <n>` | Số lần lặp lại collection |
