# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\super-admin.spec.ts >> Super Admin Dashboard & CRUD >> should create a new Promotion successfully
- Location: frontend\e2e\tests\super-admin.spec.ts:113:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('SUMMER2026').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('SUMMER2026').first()

```

# Page snapshot

```yaml
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
          - heading "Quản Lý Mã Giảm Giá" [level=3] [ref=e61]
          - paragraph [ref=e62]: Quản lý tất cả các khuyến mãi cho phòng tập
        - button "+ Thêm Mã Mới" [ref=e63] [cursor=pointer]
      - generic [ref=e64]:
        - generic [ref=e67]:
          - generic [ref=e68]:
            - paragraph [ref=e69]: Tổng Mã Khuyến Mãi
            - heading "20" [level=3] [ref=e70]
          - img [ref=e72]
        - generic [ref=e77]:
          - generic [ref=e78]:
            - paragraph [ref=e79]: Đang Hoạt Động
            - heading "10" [level=3] [ref=e80]
          - img [ref=e82]
        - generic [ref=e87]:
          - generic [ref=e88]:
            - paragraph [ref=e89]: Sắp Hết Hạn
            - heading "0" [level=3] [ref=e90]
          - img [ref=e92]
        - generic [ref=e97]:
          - generic [ref=e98]:
            - paragraph [ref=e99]: Đã Hết Hạn
            - heading "10" [level=3] [ref=e100]
          - img [ref=e102]
      - table [ref=e107]:
        - rowgroup [ref=e108]:
          - row "Promotion Discount Branch Contract Usage Validity Status" [ref=e109]:
            - columnheader [ref=e110]:
              - checkbox [ref=e111]
            - columnheader "Promotion" [ref=e112]
            - columnheader "Discount" [ref=e113]
            - columnheader "Branch" [ref=e114]
            - columnheader "Contract" [ref=e115]
            - columnheader "Usage" [ref=e116]
            - columnheader "Validity" [ref=e117]
            - columnheader "Status" [ref=e118]
            - columnheader [ref=e119]
        - rowgroup [ref=e120]:
          - 'row "Corporate Plan Code: CORP25 25% Quận 6 Renewal 200 / 300 67 7/1/2025 8/1/2025 Inactive ⋮" [ref=e121]':
            - cell [ref=e122]:
              - checkbox [ref=e123]
            - 'cell "Corporate Plan Code: CORP25" [ref=e124]':
              - generic [ref=e125]: Corporate Plan
              - generic [ref=e126]: "Code: CORP25"
            - cell "25%" [ref=e127]:
              - generic [ref=e128]: 25%
            - cell "Quận 6" [ref=e129]:
              - generic [ref=e130]: Quận 6
            - cell "Renewal" [ref=e131]
            - cell "200 / 300 67" [ref=e132]:
              - generic [ref=e133]: 200 / 300
              - progressbar [ref=e134]
            - cell "7/1/2025 8/1/2025" [ref=e136]:
              - generic [ref=e137]:
                - text: 7/1/2025
                - text: 8/1/2025
            - cell "Inactive" [ref=e138]:
              - generic [ref=e139]: Inactive
            - cell "⋮" [ref=e140]:
              - button "⋮" [ref=e142] [cursor=pointer]
          - 'row "Spring Sale Code: SPRING20 20% Quận 6 NewContract 120 / 120 100 3/1/2024 5/1/2024 Expired ⋮" [ref=e143]':
            - cell [ref=e144]:
              - checkbox [ref=e145]
            - 'cell "Spring Sale Code: SPRING20" [ref=e146]':
              - generic [ref=e147]: Spring Sale
              - generic [ref=e148]: "Code: SPRING20"
            - cell "20%" [ref=e149]:
              - generic [ref=e150]: 20%
            - cell "Quận 6" [ref=e151]:
              - generic [ref=e152]: Quận 6
            - cell "NewContract" [ref=e153]
            - cell "120 / 120 100" [ref=e154]:
              - generic [ref=e155]: 120 / 120
              - progressbar [ref=e156]
            - cell "3/1/2024 5/1/2024" [ref=e158]:
              - generic [ref=e159]:
                - text: 3/1/2024
                - text: 5/1/2024
            - cell "Expired" [ref=e160]:
              - generic [ref=e161]: Expired
            - cell "⋮" [ref=e162]:
              - button "⋮" [ref=e164] [cursor=pointer]
          - 'row "Summer Fit Code: SUMMER15 15% Test_1778404939 Renewal 170 / 180 94 6/1/2024 8/31/2024 Expired ⋮" [ref=e165]':
            - cell [ref=e166]:
              - checkbox [ref=e167]
            - 'cell "Summer Fit Code: SUMMER15" [ref=e168]':
              - generic [ref=e169]: Summer Fit
              - generic [ref=e170]: "Code: SUMMER15"
            - cell "15%" [ref=e171]:
              - generic [ref=e172]: 15%
            - cell "Test_1778404939" [ref=e173]:
              - generic [ref=e174]: Test_1778404939
            - cell "Renewal" [ref=e175]
            - cell "170 / 180 94" [ref=e176]:
              - generic [ref=e177]: 170 / 180
              - progressbar [ref=e178]
            - cell "6/1/2024 8/31/2024" [ref=e180]:
              - generic [ref=e181]:
                - text: 6/1/2024
                - text: 8/31/2024
            - cell "Expired" [ref=e182]:
              - generic [ref=e183]: Expired
            - cell "⋮" [ref=e184]:
              - button "⋮" [ref=e186] [cursor=pointer]
          - 'row "Autumn Shape Code: AUTUMN20 20% Quận 6 Upgrade 150 / 150 100 9/1/2024 11/30/2024 Expired ⋮" [ref=e187]':
            - cell [ref=e188]:
              - checkbox [ref=e189]
            - 'cell "Autumn Shape Code: AUTUMN20" [ref=e190]':
              - generic [ref=e191]: Autumn Shape
              - generic [ref=e192]: "Code: AUTUMN20"
            - cell "20%" [ref=e193]:
              - generic [ref=e194]: 20%
            - cell "Quận 6" [ref=e195]:
              - generic [ref=e196]: Quận 6
            - cell "Upgrade" [ref=e197]
            - cell "150 / 150 100" [ref=e198]:
              - generic [ref=e199]: 150 / 150
              - progressbar [ref=e200]
            - cell "9/1/2024 11/30/2024" [ref=e202]:
              - generic [ref=e203]:
                - text: 9/1/2024
                - text: 11/30/2024
            - cell "Expired" [ref=e204]:
              - generic [ref=e205]: Expired
            - cell "⋮" [ref=e206]:
              - button "⋮" [ref=e208] [cursor=pointer]
          - 'row "Year End Deal Code: YEAREND50 $50 Test_1778404939 NewContract 290 / 300 97 12/1/2024 12/31/2024 Expired ⋮" [ref=e209]':
            - cell [ref=e210]:
              - checkbox [ref=e211]
            - 'cell "Year End Deal Code: YEAREND50" [ref=e212]':
              - generic [ref=e213]: Year End Deal
              - generic [ref=e214]: "Code: YEAREND50"
            - cell "$50" [ref=e215]:
              - generic [ref=e216]: $50
            - cell "Test_1778404939" [ref=e217]:
              - generic [ref=e218]: Test_1778404939
            - cell "NewContract" [ref=e219]
            - cell "290 / 300 97" [ref=e220]:
              - generic [ref=e221]: 290 / 300
              - progressbar [ref=e222]
            - cell "12/1/2024 12/31/2024" [ref=e224]:
              - generic [ref=e225]:
                - text: 12/1/2024
                - text: 12/31/2024
            - cell "Expired" [ref=e226]:
              - generic [ref=e227]: Expired
            - cell "⋮" [ref=e228]:
              - button "⋮" [ref=e230] [cursor=pointer]
          - 'row "Winter Promo Code: WINTER25 25% Quận 6 Renewal 200 / 200 100 1/1/2024 2/28/2024 Expired ⋮" [ref=e231]':
            - cell [ref=e232]:
              - checkbox [ref=e233]
            - 'cell "Winter Promo Code: WINTER25" [ref=e234]':
              - generic [ref=e235]: Winter Promo
              - generic [ref=e236]: "Code: WINTER25"
            - cell "25%" [ref=e237]:
              - generic [ref=e238]: 25%
            - cell "Quận 6" [ref=e239]:
              - generic [ref=e240]: Quận 6
            - cell "Renewal" [ref=e241]
            - cell "200 / 200 100" [ref=e242]:
              - generic [ref=e243]: 200 / 200
              - progressbar [ref=e244]
            - cell "1/1/2024 2/28/2024" [ref=e246]:
              - generic [ref=e247]:
                - text: 1/1/2024
                - text: 2/28/2024
            - cell "Expired" [ref=e248]:
              - generic [ref=e249]: Expired
            - cell "⋮" [ref=e250]:
              - button "⋮" [ref=e252] [cursor=pointer]
          - 'row "Student Weekend Code: STUDENT10 10% Quận 6 NewContract 20 / 100 20 2/1/2026 12/31/2026 Active ⋮" [ref=e253]':
            - cell [ref=e254]:
              - checkbox [ref=e255]
            - 'cell "Student Weekend Code: STUDENT10" [ref=e256]':
              - generic [ref=e257]: Student Weekend
              - generic [ref=e258]: "Code: STUDENT10"
            - cell "10%" [ref=e259]:
              - generic [ref=e260]: 10%
            - cell "Quận 6" [ref=e261]:
              - generic [ref=e262]: Quận 6
            - cell "NewContract" [ref=e263]
            - cell "20 / 100 20" [ref=e264]:
              - generic [ref=e265]: 20 / 100
              - progressbar [ref=e266]
            - cell "2/1/2026 12/31/2026" [ref=e268]:
              - generic [ref=e269]:
                - text: 2/1/2026
                - text: 12/31/2026
            - cell "Active" [ref=e270]:
              - generic [ref=e271]: Active
            - cell "⋮" [ref=e272]:
              - button "⋮" [ref=e274] [cursor=pointer]
          - 'row "Gym Starter Code: STARTER30 $30 Test_1778404939 NewContract 80 / 250 32 1/1/2026 12/31/2026 Active ⋮" [ref=e275]':
            - cell [ref=e276]:
              - checkbox [ref=e277]
            - 'cell "Gym Starter Code: STARTER30" [ref=e278]':
              - generic [ref=e279]: Gym Starter
              - generic [ref=e280]: "Code: STARTER30"
            - cell "$30" [ref=e281]:
              - generic [ref=e282]: $30
            - cell "Test_1778404939" [ref=e283]:
              - generic [ref=e284]: Test_1778404939
            - cell "NewContract" [ref=e285]
            - cell "80 / 250 32" [ref=e286]:
              - generic [ref=e287]: 80 / 250
              - progressbar [ref=e288]
            - cell "1/1/2026 12/31/2026" [ref=e290]:
              - generic [ref=e291]:
                - text: 1/1/2026
                - text: 12/31/2026
            - cell "Active" [ref=e292]:
              - generic [ref=e293]: Active
            - cell "⋮" [ref=e294]:
              - button "⋮" [ref=e296] [cursor=pointer]
          - 'row "Transformation Code: TRANSFORM20 20% Quận 6 Upgrade 45 / 150 30 3/1/2026 12/31/2026 Active ⋮" [ref=e297]':
            - cell [ref=e298]:
              - checkbox [ref=e299]
            - 'cell "Transformation Code: TRANSFORM20" [ref=e300]':
              - generic [ref=e301]: Transformation
              - generic [ref=e302]: "Code: TRANSFORM20"
            - cell "20%" [ref=e303]:
              - generic [ref=e304]: 20%
            - cell "Quận 6" [ref=e305]:
              - generic [ref=e306]: Quận 6
            - cell "Upgrade" [ref=e307]
            - cell "45 / 150 30" [ref=e308]:
              - generic [ref=e309]: 45 / 150
              - progressbar [ref=e310]
            - cell "3/1/2026 12/31/2026" [ref=e312]:
              - generic [ref=e313]:
                - text: 3/1/2026
                - text: 12/31/2026
            - cell "Active" [ref=e314]:
              - generic [ref=e315]: Active
            - cell "⋮" [ref=e316]:
              - button "⋮" [ref=e318] [cursor=pointer]
          - 'row "Fitness Combo Code: FITCOMBO15 15% Test_1778404939 Renewal 70 / 180 39 2/1/2026 12/31/2026 Active ⋮" [ref=e319]':
            - cell [ref=e320]:
              - checkbox [ref=e321]
            - 'cell "Fitness Combo Code: FITCOMBO15" [ref=e322]':
              - generic [ref=e323]: Fitness Combo
              - generic [ref=e324]: "Code: FITCOMBO15"
            - cell "15%" [ref=e325]:
              - generic [ref=e326]: 15%
            - cell "Test_1778404939" [ref=e327]:
              - generic [ref=e328]: Test_1778404939
            - cell "Renewal" [ref=e329]
            - cell "70 / 180 39" [ref=e330]:
              - generic [ref=e331]: 70 / 180
              - progressbar [ref=e332]
            - cell "2/1/2026 12/31/2026" [ref=e334]:
              - generic [ref=e335]:
                - text: 2/1/2026
                - text: 12/31/2026
            - cell "Active" [ref=e336]:
              - generic [ref=e337]: Active
            - cell "⋮" [ref=e338]:
              - button "⋮" [ref=e340] [cursor=pointer]
      - generic [ref=e341]:
        - generic [ref=e342]: Hiển thị 1–10 của 20
        - navigation [ref=e343]:
          - list [ref=e344]:
            - listitem [ref=e345]:
              - generic: ‹
            - listitem [ref=e346]:
              - generic [ref=e347]: "1"
            - listitem [ref=e348]:
              - generic [ref=e349]: "2"
            - listitem [ref=e350]:
              - generic [ref=e351]: ›
```

# Test source

```ts
  35  |     await expect(page.locator('text=Gói Test Playwright').first()).toBeVisible();
  36  |   });
  37  | 
  38  |   // TC_ADMIN_04
  39  |   test('should fail to create Package if missing required fields', async ({ adminPage, page }) => {
  40  |     await adminPage.navigateTo('Packages');
  41  |     await adminPage.openCreatePackageForm();
  42  |     await adminPage.formSaveBtn.click();
  43  | 
  44  |     // UI validation error
  45  |     await expect(page.locator('text=Tên gói không được để trống')).toBeVisible();
  46  |   });
  47  | 
  48  |   // TC_ADMIN_05
  49  |   test('should edit an existing Package', async ({ adminPage, page }) => {
  50  |     await adminPage.navigateTo('Packages');
  51  |     await adminPage.firstPackageEditBtn.click();
  52  |     await expect(page.locator('.modal-content')).toBeVisible();
  53  | 
  54  |     await page.fill('input[name="name"]', 'Gói Update Playwright');
  55  |     await adminPage.formSaveBtn.click();
  56  | 
  57  |     await expect(page.locator('text=Gói Update Playwright').first()).toBeVisible();
  58  |   });
  59  | 
  60  |   // TC_ADMIN_06
  61  |   test('should toggle package status (Active/Inactive)', async ({ adminPage, page }) => {
  62  |     await adminPage.navigateTo('Packages');
  63  |     // Click toggle switch
  64  |     const toggle = page.locator('input[type="checkbox"].form-check-input').first();
  65  |     await toggle.click();
  66  |     // Verify toast or updated status
  67  |     // wait for response
  68  |   });
  69  | 
  70  |   // TC_ADMIN_07
  71  |   test('should delete a Package', async ({ adminPage, page }) => {
  72  |     await adminPage.navigateTo('Packages');
  73  |     await adminPage.firstPackageDeleteBtn.click();
  74  |     await expect(page.locator('.modal-content:has-text("Bạn có chắc chắn")')).toBeVisible();
  75  |     await adminPage.confirmDelete();
  76  | 
  77  |     // Notice Toast or item disappeared
  78  |     await expect(page.locator('.modal-content:has-text("Bạn có chắc chắn")')).toBeHidden();
  79  |   });
  80  | 
  81  |   // --- USER MANAGEMENT ---
  82  |   // TC_ADMIN_08
  83  |   test('should navigate to User Management and view list', async ({ adminPage, page }) => {
  84  |     await adminPage.navigateTo('Users');
  85  |     await expect(page).toHaveURL(/\/admin\/users/);
  86  |     await expect(page.locator('table')).toBeVisible();
  87  |   });
  88  | 
  89  |   // TC_ADMIN_09
  90  |   test('should filter users by Role', async ({ adminPage, page }) => {
  91  |     await adminPage.navigateTo('Users');
  92  |     await page.selectOption('select.filter-role', 'STAFF');
  93  |     // Expect only staff users to be visible in table
  94  |   });
  95  | 
  96  |   // TC_ADMIN_10
  97  |   test('should search users by name/phone', async ({ adminPage, page }) => {
  98  |     await adminPage.navigateTo('Users');
  99  |     await page.fill('input[placeholder*="Tìm kiếm"]', 'John');
  100 |     await page.press('input[placeholder*="Tìm kiếm"]', 'Enter');
  101 |     // Verify table has "John"
  102 |   });
  103 | 
  104 |   // --- PROMOTION MANAGEMENT ---
  105 |   // TC_ADMIN_11
  106 |   test('should navigate to Promotion Management and view list', async ({ adminPage, page }) => {
  107 |     await adminPage.navigateTo('Promotions');
  108 |     await expect(page).toHaveURL(/\/admin\/promo/);
  109 |     await expect(page.locator('h3:has-text("Khuyến Mãi")')).toBeVisible();
  110 |   });
  111 | 
  112 |   // TC_ADMIN_12
  113 |   test('should create a new Promotion successfully', async ({ adminPage, page }) => {
  114 |     await adminPage.navigateTo('Promotions');
  115 | 
  116 |     // Click nút mở modal
  117 |     await page.getByRole('button', { name: 'Thêm Mã Mới' }).click();
  118 | 
  119 |     // Điền thông tin vào form
  120 |     await page.fill('input[name="name"]', 'Khuyến mãi hè 2026');
  121 |     await page.fill('input[name="code"]', 'SUMMER2026');
  122 |     await page.selectOption('select[name="discountType"]', 'Percentage');
  123 |     await page.fill('input[name="discountValue"]', '20');
  124 |     await page.selectOption('select[name="contractType"]', 'NewContract');
  125 | 
  126 |     // Playwright hỗ trợ điền input[type="date"] bằng định dạng YYYY-MM-DD
  127 |     await page.fill('input[name="startDate"]', '2026-06-01');
  128 |     await page.fill('input[name="endDate"]', '2026-08-31');
  129 |     await page.fill('input[name="maxUsage"]', '100');
  130 | 
  131 |     // Nhấn nút tạo trong modal footer
  132 |     await page.getByRole('button', { name: 'Tạo khuyến mãi', exact: true }).click();
  133 | 
  134 |     // Xác nhận mã mới đã xuất hiện trong danh sách
> 135 |     await expect(page.getByText('SUMMER2026').first()).toBeVisible();
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  136 |   });
  137 | 
  138 | 
  139 |   // --- BRANCH MANAGEMENT ---
  140 |   // TC_ADMIN_13
  141 |   test('should view list of branches', async ({ adminPage, page }) => {
  142 |     await adminPage.navigateTo('Branches');
  143 |     await expect(page).toHaveURL(/\/admin\/branches/);
  144 |   });
  145 | 
  146 |   // TC_ADMIN_14
  147 |   test('should edit a Branch address', async ({ adminPage, page }) => {
  148 |     await adminPage.navigateTo('Branches');
  149 |     await adminPage.firstPackageEditBtn.click(); // Reuse edit btn locator
  150 |     await page.fill('input[name="address"]', '123 New Address, TP.HCM');
  151 |     await adminPage.formSaveBtn.click();
  152 |   });
  153 | 
  154 |   // --- ROOM MANAGEMENT ---
  155 |   // TC_ADMIN_15
  156 |   test('should navigate to Room Management', async ({ adminPage, page }) => {
  157 |     await adminPage.navigateTo('Rooms');
  158 |     await expect(page).toHaveURL(/\/admin\/rooms/);
  159 |   });
  160 | 
  161 |   // --- CLASS MANAGEMENT ---
  162 |   // TC_ADMIN_16
  163 |   test('should navigate to Class Management', async ({ adminPage, page }) => {
  164 |     await adminPage.navigateTo('Classes');
  165 |     await expect(page).toHaveURL(/\/admin\/classes/);
  166 |   });
  167 | 
  168 |   // --- LEADS MANAGEMENT ---
  169 |   // TC_ADMIN_17
  170 |   test('should navigate to Leads Management', async ({ adminPage, page }) => {
  171 |     await adminPage.navigateTo('Leads');
  172 |     await expect(page).toHaveURL(/\/admin\/leads/);
  173 |   });
  174 | 
  175 |   // --- SALES MANAGEMENT ---
  176 |   // TC_ADMIN_18
  177 |   test('should navigate to Sales Management', async ({ adminPage, page }) => {
  178 |     await adminPage.navigateTo('Sales');
  179 |     await expect(page).toHaveURL(/\/admin\/sales/);
  180 |   });
  181 | 
  182 |   // --- CONTRACTS MANAGEMENT ---
  183 |   // TC_ADMIN_19
  184 |   test('should navigate to Contracts Management', async ({ adminPage, page }) => {
  185 |     await adminPage.navigateTo('Contracts');
  186 |     await expect(page).toHaveURL(/\/admin\/contracts/);
  187 |   });
  188 | 
  189 |   // --- ATTENDANCE MANAGEMENT ---
  190 |   // TC_ADMIN_20
  191 |   test('should navigate to Attendance Management', async ({ adminPage, page }) => {
  192 |     await adminPage.navigateTo('Attendance');
  193 |     await expect(page).toHaveURL(/\/admin\/attendance/);
  194 |   });
  195 | 
  196 |   // --- FINANCIAL REPORTS ---
  197 |   // TC_ADMIN_21
  198 |   test('should navigate to Financial Reports', async ({ adminPage, page }) => {
  199 |     await adminPage.navigateTo('Reports');
  200 |     await expect(page).toHaveURL(/\/admin\/reports/);
  201 |   });
  202 | 
  203 |   // TC_ADMIN_22
  204 |   test('should logout successfully from Admin dashboard', async ({ adminPage, page }) => {
  205 |     // Click vào khu vực Avatar/Tên người dùng để mở dropdown
  206 |     await page.getByText('Quản Trị Viên').click();
  207 |     // Click vào nút Đăng xuất trong menu
  208 |     await page.locator('.dropdown-item', { hasText: 'Đăng xuất' }).click();
  209 |     // Kiểm tra đã quay về trang login chưa
  210 |     await expect(page).toHaveURL(/\/login/);
  211 |   });
  212 | });
  213 | 
```