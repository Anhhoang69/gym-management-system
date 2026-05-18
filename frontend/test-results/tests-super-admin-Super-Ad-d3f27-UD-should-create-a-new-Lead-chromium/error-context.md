# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\super-admin.spec.ts >> Super Admin Dashboard & CRUD >> should create a new Lead
- Location: e2e\tests\super-admin.spec.ts:184:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('table')
Expected substring: "Khách hàng tiềm năng"
Received string:    "Họ TênLiên HệNguồnNhân ViênNgày TạoTrạng TháiThao tácNguyen Van Test0981282709nvtest_1778411758@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0995201810nvtest_1778408772@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtLê Thị Hoàng Anh0337777777leeleeanh1@gmail.comInstagram (Updated)Sales10/05/2026NewChi TiếtChốt SaleNguyen Van Test0981234001nvtest_1778407062@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0938105609nvtest_1778406752@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0991518267nvtest_1778406438@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0979651553nvtest_1778406123@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0978735375nvtest_1778405513@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0988888888nvtest@gmail.comInstagram (Updated)Sales10/05/2026ContactedChi TiếtChốt SaleLê Thị Hoàng Anh0337809545hoanganhle.work@gmail.comReferralSales 0107/05/2026QualifiedChi TiếtChốt Sale"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('table')
    8 × locator resolved to <table class="table align-middle table-hover mb-0 border">…</table>
      - unexpected value "Họ TênLiên HệNguồnNhân ViênNgày TạoTrạng TháiThao tácNguyen Van Test0981282709nvtest_1778411758@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0995201810nvtest_1778408772@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtLê Thị Hoàng Anh0337777777leeleeanh1@gmail.comInstagram (Updated)Sales10/05/2026NewChi TiếtChốt SaleNguyen Van Test0981234001nvtest_1778407062@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0938105609nvtest_1778406752@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0991518267nvtest_1778406438@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0979651553nvtest_1778406123@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0978735375nvtest_1778405513@gmail.comInstagram (Updated)Sales10/05/2026ConvertedChi TiếtNguyen Van Test0988888888nvtest@gmail.comInstagram (Updated)Sales10/05/2026ContactedChi TiếtChốt SaleLê Thị Hoàng Anh0337809545hoanganhle.work@gmail.comReferralSales 0107/05/2026QualifiedChi TiếtChốt Sale"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e5]:
      - img "EnerGym" [ref=e6] [cursor=pointer]
      - navigation [ref=e7]:
        - generic [ref=e8]:
          - textbox "Tìm kiếm..." [ref=e9]
          - img [ref=e10] [cursor=pointer]
        - button "Đăng Ký Nhanh" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e15]: Đăng Ký Nhanh
        - button "Toggle theme" [ref=e16] [cursor=pointer]:
          - img [ref=e17]
        - button [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - button "Quản Trị Viên Administrator" [ref=e24] [cursor=pointer]:
          - generic [ref=e25]:
            - img [ref=e27]
            - generic [ref=e28]:
              - generic [ref=e29]: Quản Trị Viên
              - text: Administrator
    - generic [ref=e30]:
      - list [ref=e32]:
        - listitem [ref=e33]:
          - link "Tổng Quan" [ref=e34] [cursor=pointer]:
            - /url: /admin
        - listitem [ref=e35]:
          - link "Quản Lý Người Dùng" [ref=e36] [cursor=pointer]:
            - /url: /admin/users
        - listitem [ref=e37]:
          - link "Quản Lý Chi Nhánh" [ref=e38] [cursor=pointer]:
            - /url: /admin/branches
        - listitem [ref=e39]:
          - link "-- Quản Lý Phòng" [ref=e40] [cursor=pointer]:
            - /url: /admin/rooms
        - listitem [ref=e41]:
          - link "-- Quản Lý Lớp Học" [ref=e42] [cursor=pointer]:
            - /url: /admin/classes
        - listitem [ref=e43]:
          - link "Quản Lý Gói Tập" [ref=e44] [cursor=pointer]:
            - /url: /admin/packages
        - listitem [ref=e45]:
          - link "Quản Lý Khuyến Mãi" [ref=e46] [cursor=pointer]:
            - /url: /admin/promo
        - listitem [ref=e47]:
          - link "Quản Lý Leads" [ref=e48] [cursor=pointer]:
            - /url: /admin/leads
        - listitem [ref=e49]:
          - link "Quản Lý Bán Hàng" [ref=e50] [cursor=pointer]:
            - /url: /admin/sales
        - listitem [ref=e51]:
          - link "Quản Lý Hợp Đồng" [ref=e52] [cursor=pointer]:
            - /url: /admin/contracts
        - listitem [ref=e53]:
          - link "Quản Lý Điểm Danh" [ref=e54] [cursor=pointer]:
            - /url: /admin/attendance
        - listitem [ref=e55]:
          - link "Báo Cáo Tài Chính" [ref=e56] [cursor=pointer]:
            - /url: /admin/reports
      - generic [ref=e58]:
        - generic [ref=e59]:
          - generic [ref=e60]:
            - heading "Quản Lý Leads" [level=3] [ref=e61]
            - paragraph [ref=e62]: Theo dõi khách hàng tiềm năng & CRM
          - generic [ref=e63]:
            - button "Import CSV" [ref=e64] [cursor=pointer]
            - button "+ Thêm Lead" [ref=e65] [cursor=pointer]
        - generic [ref=e66]:
          - generic [ref=e69]:
            - generic [ref=e70]: TỔNG SỐ LEADS
            - heading "10" [level=3] [ref=e71]
            - generic [ref=e72]: +9 hôm nay
          - generic [ref=e75]:
            - generic [ref=e76]: LEAD MỚI
            - heading "1" [level=3] [ref=e77]
          - generic [ref=e80]:
            - generic [ref=e81]: TỈ LỆ CHUYỂN ĐỔI
            - heading "70.0%" [level=3] [ref=e82]
          - generic [ref=e85]:
            - generic [ref=e86]: LEAD ĐÃ MẤT
            - heading "0" [level=3] [ref=e87]
        - generic [ref=e89]:
          - generic [ref=e90]:
            - generic [ref=e92]:
              - textbox "Tìm theo tên, SĐT, email..." [ref=e93]
              - button "Tìm" [ref=e94] [cursor=pointer]
            - combobox [ref=e96]:
              - option "Tất cả trạng thái" [selected]
              - option "New"
              - option "Contacted"
              - option "Qualified"
              - option "Converted"
              - option "Lost"
          - table [ref=e99]:
            - rowgroup [ref=e100]:
              - row "Họ Tên Liên Hệ Nguồn Nhân Viên Ngày Tạo Trạng Thái Thao tác" [ref=e101]:
                - columnheader "Họ Tên" [ref=e102]
                - columnheader "Liên Hệ" [ref=e103]
                - columnheader "Nguồn" [ref=e104]
                - columnheader "Nhân Viên" [ref=e105]
                - columnheader "Ngày Tạo" [ref=e106]
                - columnheader "Trạng Thái" [ref=e107]
                - columnheader "Thao tác" [ref=e108]
            - rowgroup [ref=e109]:
              - row "Nguyen Van Test 0981282709 nvtest_1778411758@gmail.com Instagram (Updated) Sales 10/05/2026 Converted Chi Tiết" [ref=e110]:
                - cell "Nguyen Van Test" [ref=e111]
                - cell "0981282709 nvtest_1778411758@gmail.com" [ref=e112]:
                  - generic [ref=e113]: "0981282709"
                  - generic [ref=e114]: nvtest_1778411758@gmail.com
                - cell "Instagram (Updated)" [ref=e115]
                - cell "Sales" [ref=e116]
                - cell "10/05/2026" [ref=e117]
                - cell "Converted" [ref=e118]:
                  - generic [ref=e119]: Converted
                - cell "Chi Tiết" [ref=e120]:
                  - button "Chi Tiết" [ref=e121] [cursor=pointer]
              - row "Nguyen Van Test 0995201810 nvtest_1778408772@gmail.com Instagram (Updated) Sales 10/05/2026 Converted Chi Tiết" [ref=e122]:
                - cell "Nguyen Van Test" [ref=e123]
                - cell "0995201810 nvtest_1778408772@gmail.com" [ref=e124]:
                  - generic [ref=e125]: "0995201810"
                  - generic [ref=e126]: nvtest_1778408772@gmail.com
                - cell "Instagram (Updated)" [ref=e127]
                - cell "Sales" [ref=e128]
                - cell "10/05/2026" [ref=e129]
                - cell "Converted" [ref=e130]:
                  - generic [ref=e131]: Converted
                - cell "Chi Tiết" [ref=e132]:
                  - button "Chi Tiết" [ref=e133] [cursor=pointer]
              - row "Lê Thị Hoàng Anh 0337777777 leeleeanh1@gmail.com Instagram (Updated) Sales 10/05/2026 New Chi Tiết Chốt Sale" [ref=e134]:
                - cell "Lê Thị Hoàng Anh" [ref=e135]
                - cell "0337777777 leeleeanh1@gmail.com" [ref=e136]:
                  - generic [ref=e137]: "0337777777"
                  - generic [ref=e138]: leeleeanh1@gmail.com
                - cell "Instagram (Updated)" [ref=e139]
                - cell "Sales" [ref=e140]
                - cell "10/05/2026" [ref=e141]
                - cell "New" [ref=e142]:
                  - generic [ref=e143]: New
                - cell "Chi Tiết Chốt Sale" [ref=e144]:
                  - button "Chi Tiết" [ref=e145] [cursor=pointer]
                  - button "Chốt Sale" [ref=e146] [cursor=pointer]
              - row "Nguyen Van Test 0981234001 nvtest_1778407062@gmail.com Instagram (Updated) Sales 10/05/2026 Converted Chi Tiết" [ref=e147]:
                - cell "Nguyen Van Test" [ref=e148]
                - cell "0981234001 nvtest_1778407062@gmail.com" [ref=e149]:
                  - generic [ref=e150]: "0981234001"
                  - generic [ref=e151]: nvtest_1778407062@gmail.com
                - cell "Instagram (Updated)" [ref=e152]
                - cell "Sales" [ref=e153]
                - cell "10/05/2026" [ref=e154]
                - cell "Converted" [ref=e155]:
                  - generic [ref=e156]: Converted
                - cell "Chi Tiết" [ref=e157]:
                  - button "Chi Tiết" [ref=e158] [cursor=pointer]
              - row "Nguyen Van Test 0938105609 nvtest_1778406752@gmail.com Instagram (Updated) Sales 10/05/2026 Converted Chi Tiết" [ref=e159]:
                - cell "Nguyen Van Test" [ref=e160]
                - cell "0938105609 nvtest_1778406752@gmail.com" [ref=e161]:
                  - generic [ref=e162]: "0938105609"
                  - generic [ref=e163]: nvtest_1778406752@gmail.com
                - cell "Instagram (Updated)" [ref=e164]
                - cell "Sales" [ref=e165]
                - cell "10/05/2026" [ref=e166]
                - cell "Converted" [ref=e167]:
                  - generic [ref=e168]: Converted
                - cell "Chi Tiết" [ref=e169]:
                  - button "Chi Tiết" [ref=e170] [cursor=pointer]
              - row "Nguyen Van Test 0991518267 nvtest_1778406438@gmail.com Instagram (Updated) Sales 10/05/2026 Converted Chi Tiết" [ref=e171]:
                - cell "Nguyen Van Test" [ref=e172]
                - cell "0991518267 nvtest_1778406438@gmail.com" [ref=e173]:
                  - generic [ref=e174]: "0991518267"
                  - generic [ref=e175]: nvtest_1778406438@gmail.com
                - cell "Instagram (Updated)" [ref=e176]
                - cell "Sales" [ref=e177]
                - cell "10/05/2026" [ref=e178]
                - cell "Converted" [ref=e179]:
                  - generic [ref=e180]: Converted
                - cell "Chi Tiết" [ref=e181]:
                  - button "Chi Tiết" [ref=e182] [cursor=pointer]
              - row "Nguyen Van Test 0979651553 nvtest_1778406123@gmail.com Instagram (Updated) Sales 10/05/2026 Converted Chi Tiết" [ref=e183]:
                - cell "Nguyen Van Test" [ref=e184]
                - cell "0979651553 nvtest_1778406123@gmail.com" [ref=e185]:
                  - generic [ref=e186]: "0979651553"
                  - generic [ref=e187]: nvtest_1778406123@gmail.com
                - cell "Instagram (Updated)" [ref=e188]
                - cell "Sales" [ref=e189]
                - cell "10/05/2026" [ref=e190]
                - cell "Converted" [ref=e191]:
                  - generic [ref=e192]: Converted
                - cell "Chi Tiết" [ref=e193]:
                  - button "Chi Tiết" [ref=e194] [cursor=pointer]
              - row "Nguyen Van Test 0978735375 nvtest_1778405513@gmail.com Instagram (Updated) Sales 10/05/2026 Converted Chi Tiết" [ref=e195]:
                - cell "Nguyen Van Test" [ref=e196]
                - cell "0978735375 nvtest_1778405513@gmail.com" [ref=e197]:
                  - generic [ref=e198]: "0978735375"
                  - generic [ref=e199]: nvtest_1778405513@gmail.com
                - cell "Instagram (Updated)" [ref=e200]
                - cell "Sales" [ref=e201]
                - cell "10/05/2026" [ref=e202]
                - cell "Converted" [ref=e203]:
                  - generic [ref=e204]: Converted
                - cell "Chi Tiết" [ref=e205]:
                  - button "Chi Tiết" [ref=e206] [cursor=pointer]
              - row "Nguyen Van Test 0988888888 nvtest@gmail.com Instagram (Updated) Sales 10/05/2026 Contacted Chi Tiết Chốt Sale" [ref=e207]:
                - cell "Nguyen Van Test" [ref=e208]
                - cell "0988888888 nvtest@gmail.com" [ref=e209]:
                  - generic [ref=e210]: "0988888888"
                  - generic [ref=e211]: nvtest@gmail.com
                - cell "Instagram (Updated)" [ref=e212]
                - cell "Sales" [ref=e213]
                - cell "10/05/2026" [ref=e214]
                - cell "Contacted" [ref=e215]:
                  - generic [ref=e216]: Contacted
                - cell "Chi Tiết Chốt Sale" [ref=e217]:
                  - button "Chi Tiết" [ref=e218] [cursor=pointer]
                  - button "Chốt Sale" [ref=e219] [cursor=pointer]
              - row "Lê Thị Hoàng Anh 0337809545 hoanganhle.work@gmail.com Referral Sales 01 07/05/2026 Qualified Chi Tiết Chốt Sale" [ref=e220]:
                - cell "Lê Thị Hoàng Anh" [ref=e221]
                - cell "0337809545 hoanganhle.work@gmail.com" [ref=e222]:
                  - generic [ref=e223]: "0337809545"
                  - generic [ref=e224]: hoanganhle.work@gmail.com
                - cell "Referral" [ref=e225]
                - cell "Sales 01" [ref=e226]
                - cell "07/05/2026" [ref=e227]
                - cell "Qualified" [ref=e228]:
                  - generic [ref=e229]: Qualified
                - cell "Chi Tiết Chốt Sale" [ref=e230]:
                  - button "Chi Tiết" [ref=e231] [cursor=pointer]
                  - button "Chốt Sale" [ref=e232] [cursor=pointer]
  - dialog [ref=e234]:
    - generic [ref=e235]:
      - generic [ref=e236]:
        - heading "Thêm Lead Mới" [level=5] [ref=e237]
        - button "Close" [ref=e238] [cursor=pointer]
      - generic [ref=e240]:
        - generic [ref=e241]:
          - generic [ref=e242]: Họ tên (*)
          - textbox [ref=e243]: Khách hàng tiềm năng
        - generic [ref=e244]:
          - generic [ref=e245]: Số điện thoại (*)
          - textbox [ref=e246]: "0987654321"
        - generic [ref=e247]:
          - generic [ref=e248]: Email
          - textbox [ref=e249]
        - generic [ref=e250]:
          - generic [ref=e251]: Nguồn Khách Hàng (*)
          - combobox [ref=e252]:
            - option "-- Chọn Nguồn --"
            - option "Instagram" [selected]
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Instagram (Updated)"
            - option "Referral"
            - option "string2"
            - option "Walk-in"
        - generic [ref=e253]:
          - generic [ref=e254]: Chi nhánh quan tâm (*)
          - combobox [ref=e255]:
            - option "-- Chọn Chi nhánh --"
            - option "Test_1778404938" [selected]
            - option "Test_1778404939"
            - option "Test_1778405500"
            - option "Test_1778405502"
            - option "Test_1778405503"
            - option "Test_1778406112"
            - option "Test_1778406114"
            - option "Test_1778406115"
            - option "Test_1778406424"
            - option "Test_1778406426"
            - option "Test_1778406427"
            - option "Test_1778406730"
            - option "Test_1778406733"
            - option "Test_1778406735"
            - option "Test_1778407049"
            - option "Test_1778407051"
            - option "Test_1778407052"
            - option "Test_1778408758"
            - option "Test_1778408760"
            - option "Test_1778408761"
            - option "Test_1778411092"
            - option "Test_1778411094"
            - option "Test_1778411335"
            - option "Test_1778411336"
            - option "Test_1778411368"
            - option "Test_1778411370"
            - option "Test_1778411509"
            - option "Test_1778411510"
            - option "Test_1778411545"
            - option "Test_1778411546"
            - option "Test_1778411665"
            - option "Test_1778411666"
            - option "Test_1778411745"
            - option "Test_1778411747"
            - option "Test_1778411748"
            - option "Test_1778411903"
            - option "Test_1778411905"
        - generic [ref=e256]:
          - generic [ref=e257]: Gán cho Sales (Tuỳ chọn)
          - combobox [ref=e258]:
            - option "-- Tự động phân bổ hoặc Chọn --" [selected]
        - generic [ref=e259]:
          - generic [ref=e260]: Ghi chú
          - textbox "Nhu cầu, tình trạng thể chất..." [ref=e261]
      - generic [ref=e262]:
        - button "Hủy" [ref=e263] [cursor=pointer]
        - button "Tạo Lead" [active] [ref=e264] [cursor=pointer]
```

# Test source

```ts
  92  |   });
  93  | 
  94  |   // --- FINANCIAL REPORTS ---
  95  |   // TC_30
  96  |   test('should navigate to Financial Reports', async ({ adminPage, page }) => {
  97  |     await adminPage.navigateTo('Reports');
  98  |     await expect(page).toHaveURL(/\/admin\/reports/);
  99  |   });
  100 | 
  101 |   // TC_31
  102 |   test('should logout successfully from Admin dashboard', async ({ adminPage, page }) => {
  103 |     // Click vào khu vực Avatar/Tên người dùng để mở dropdown
  104 |     await page.getByText('Quản Trị Viên').click();
  105 |     // Click vào nút Đăng xuất trong menu
  106 |     await page.locator('.dropdown-item', { hasText: 'Đăng xuất' }).click();
  107 |     // Kiểm tra đã quay về trang login chưa
  108 |     await expect(page).toHaveURL(/\/login/);
  109 |   });
  110 | 
  111 |   // --- ADDITIONAL CREATION TESTS ---
  112 |   
  113 |   // TC_32
  114 |   test('should create a new Member user', async ({ adminPage, page }) => {
  115 |     await adminPage.navigateTo('Users');
  116 |     await adminPage.openCreateForm();
  117 |     await page.fill('input[name="fullName"]', 'Nguyen Member Test');
  118 |     await page.fill('input[name="email"]', `member_${Date.now()}@test.com`);
  119 |     await page.fill('input[name="password"]', 'Member@123');
  120 |     await page.selectOption('select[name="role"]', 'Member');
  121 |     await page.selectOption('select[name="branchId"]', { index: 1 });
  122 |     await page.getByRole('button', { name: 'Tạo', exact: true }).click();
  123 |     await expect(page.locator('table')).toContainText('Nguyen Member Test');
  124 |   });
  125 | 
  126 |   // TC_33
  127 |   test('should create a new Sales staff', async ({ adminPage, page }) => {
  128 |     await adminPage.navigateTo('Users');
  129 |     await adminPage.openCreateForm();
  130 |     await page.fill('input[name="fullName"]', 'Nguyen Sales Test');
  131 |     await page.fill('input[name="email"]', `sales_${Date.now()}@test.com`);
  132 |     await page.fill('input[name="password"]', 'Sales@123');
  133 |     await page.selectOption('select[name="role"]', 'Staff');
  134 |     await page.selectOption('select[name="staffPosition"]', 'Sales');
  135 |     await page.selectOption('select[name="branchId"]', { index: 1 });
  136 |     await page.getByRole('button', { name: 'Tạo', exact: true }).click();
  137 |     await expect(page.locator('table')).toContainText('Nguyen Sales Test');
  138 |   });
  139 | 
  140 |   // TC_34
  141 |   test('should create a new PT staff', async ({ adminPage, page }) => {
  142 |     await adminPage.navigateTo('Users');
  143 |     await adminPage.openCreateForm();
  144 |     await page.fill('input[name="fullName"]', 'Nguyen PT Test');
  145 |     await page.fill('input[name="email"]', `pt_${Date.now()}@test.com`);
  146 |     await page.fill('input[name="password"]', 'PT@123');
  147 |     await page.selectOption('select[name="role"]', 'Staff');
  148 |     await page.selectOption('select[name="staffPosition"]', 'PT');
  149 |     await page.selectOption('select[name="branchId"]', { index: 1 });
  150 |     await page.getByRole('button', { name: 'Tạo', exact: true }).click();
  151 |     await expect(page.locator('table')).toContainText('Nguyen PT Test');
  152 |   });
  153 | 
  154 |   // TC_35
  155 |   test('should create a new Receptionist staff', async ({ adminPage, page }) => {
  156 |     await adminPage.navigateTo('Users');
  157 |     await adminPage.openCreateForm();
  158 |     await page.fill('input[name="fullName"]', 'Nguyen Recep Test');
  159 |     await page.fill('input[name="email"]', `recep_${Date.now()}@test.com`);
  160 |     await page.fill('input[name="password"]', 'Recep@123');
  161 |     await page.selectOption('select[name="role"]', 'Staff');
  162 |     await page.selectOption('select[name="staffPosition"]', 'Receptionist');
  163 |     await page.selectOption('select[name="branchId"]', { index: 1 });
  164 |     await page.getByRole('button', { name: 'Tạo', exact: true }).click();
  165 |     await expect(page.locator('table')).toContainText('Nguyen Recep Test');
  166 |   });
  167 | 
  168 |   // TC_36
  169 |   test('should create a new Class', async ({ adminPage, page }) => {
  170 |     await adminPage.navigateTo('Classes');
  171 |     await adminPage.openCreateForm();
  172 |     await page.fill('input[name="title"]', 'Lớp Yoga Buổi Sáng');
  173 |     await page.selectOption('select[name="classType"]', 'Yoga');
  174 |     // Chọn chi nhánh đầu tiên có sẵn
  175 |     await page.locator('label:has-text("Chi nhánh") + select').selectOption({ index: 1 });
  176 |     await page.waitForTimeout(500); // Đợi load HLV/Phòng
  177 |     await page.selectOption('select[name="trainerStaffId"]', { index: 1 });
  178 |     await page.selectOption('select[name="roomId"]', { index: 1 });
  179 |     await page.getByRole('button', { name: 'Tạo Lớp', exact: true }).click();
  180 |     await expect(page.locator('.modal-content')).toBeHidden();
  181 |   });
  182 | 
  183 |   // TC_37
  184 |   test('should create a new Lead', async ({ adminPage, page }) => {
  185 |     await adminPage.navigateTo('Leads');
  186 |     await adminPage.openCreateForm();
  187 |     await page.fill('input[name="name"]', 'Khách hàng tiềm năng');
  188 |     await page.fill('input[name="phone"]', '0987654321');
  189 |     await page.selectOption('select[name="sourceId"]', { index: 1 });
  190 |     await page.locator('label:has-text("Chi nhánh quan tâm") + select').selectOption({ index: 1 });
  191 |     await page.getByRole('button', { name: 'Tạo Lead', exact: true }).click();
> 192 |     await expect(page.locator('table')).toContainText('Khách hàng tiềm năng');
      |                                         ^ Error: expect(locator).toContainText(expected) failed
  193 |   });
  194 | 
  195 |   // TC_38
  196 |   test('should navigate to admin profile from header', async ({ adminPage, page }) => {
  197 |     // Mở dropdown avatar
  198 |     await page.getByText('Quản Trị Viên').click();
  199 |     await page.getByText('Hồ sơ cá nhân').click();
  200 |     await expect(page).toHaveURL(/\/admin\/profile/);
  201 |   });
  202 | });
  203 | 
```