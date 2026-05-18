# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\super-admin.spec.ts >> Super Admin Dashboard & CRUD >> should create a new Class
- Location: e2e\tests\super-admin.spec.ts:169:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select[name="trainerStaffId"]')
    - locator resolved to <select class="form-select" name="trainerStaffId">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    49 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms

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
          - heading "Quản Lý Lớp Học" [level=3] [ref=e61]
          - button "+ Tạo Lớp Học Mới" [ref=e62] [cursor=pointer]
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]:
              - button "Hôm nay" [ref=e67] [cursor=pointer]
              - button "Trước" [ref=e68] [cursor=pointer]
              - button "Tiếp" [ref=e69] [cursor=pointer]
            - generic [ref=e70]: May 2026
            - generic [ref=e71]:
              - button "Tháng" [ref=e72] [cursor=pointer]
              - button "Tuần" [ref=e73] [cursor=pointer]
              - button "Ngày" [ref=e74] [cursor=pointer]
              - button "Lịch trình" [ref=e75] [cursor=pointer]
          - table "Month View" [ref=e76]:
            - row "Sun Mon Tue Wed Thu Fri Sat" [ref=e77]:
              - columnheader "Sun" [ref=e79]
              - columnheader "Mon" [ref=e81]
              - columnheader "Tue" [ref=e83]
              - columnheader "Wed" [ref=e85]
              - columnheader "Thu" [ref=e87]
              - columnheader "Fri" [ref=e89]
              - columnheader "Sat" [ref=e91]
            - rowgroup [ref=e92]:
              - row "26 27 28 29 30 01 02" [ref=e101]:
                - generic [ref=e102]:
                  - cell "26" [ref=e103]:
                    - button "26" [ref=e104] [cursor=pointer]
                  - cell "27" [ref=e105]:
                    - button "27" [ref=e106] [cursor=pointer]
                  - cell "28" [ref=e107]:
                    - button "28" [ref=e108] [cursor=pointer]
                  - cell "29" [ref=e109]:
                    - button "29" [ref=e110] [cursor=pointer]
                  - cell "30" [ref=e111]:
                    - button "30" [ref=e112] [cursor=pointer]
                  - cell "01" [ref=e113]:
                    - button "01" [ref=e114] [cursor=pointer]
                  - cell "02" [ref=e115]:
                    - button "02" [ref=e116] [cursor=pointer]
            - rowgroup [ref=e117]:
              - row "03 04 05 06 07 08 09 YOGA 01 (Yoga)" [ref=e126]:
                - generic [ref=e127]:
                  - cell "03" [ref=e128]:
                    - button "03" [ref=e129] [cursor=pointer]
                  - cell "04" [ref=e130]:
                    - button "04" [ref=e131] [cursor=pointer]
                  - cell "05" [ref=e132]:
                    - button "05" [ref=e133] [cursor=pointer]
                  - cell "06" [ref=e134]:
                    - button "06" [ref=e135] [cursor=pointer]
                  - cell "07" [ref=e136]:
                    - button "07" [ref=e137] [cursor=pointer]
                  - cell "08" [ref=e138]:
                    - button "08" [ref=e139] [cursor=pointer]
                  - cell "09" [ref=e140]:
                    - button "09" [ref=e141] [cursor=pointer]
                - generic "YOGA 01 (Yoga)" [ref=e146] [cursor=pointer]
            - rowgroup [ref=e147]:
              - row "10 11 12 13 14 15 16 Yoga 10/5 (Yoga)" [ref=e156]:
                - generic [ref=e157]:
                  - cell "10" [ref=e158]:
                    - button "10" [ref=e159] [cursor=pointer]
                  - cell "11" [ref=e160]:
                    - button "11" [ref=e161] [cursor=pointer]
                  - cell "12" [ref=e162]:
                    - button "12" [ref=e163] [cursor=pointer]
                  - cell "13" [ref=e164]:
                    - button "13" [ref=e165] [cursor=pointer]
                  - cell "14" [ref=e166]:
                    - button "14" [ref=e167] [cursor=pointer]
                  - cell "15" [ref=e168]:
                    - button "15" [ref=e169] [cursor=pointer]
                  - cell "16" [ref=e170]:
                    - button "16" [ref=e171] [cursor=pointer]
                - generic "Yoga 10/5 (Yoga)" [ref=e175] [cursor=pointer]
            - rowgroup [ref=e176]:
              - row "17 18 19 20 21 22 23" [ref=e185]:
                - generic [ref=e186]:
                  - cell "17" [ref=e187]:
                    - button "17" [ref=e188] [cursor=pointer]
                  - cell "18" [ref=e189]:
                    - button "18" [ref=e190] [cursor=pointer]
                  - cell "19" [ref=e191]:
                    - button "19" [ref=e192] [cursor=pointer]
                  - cell "20" [ref=e193]:
                    - button "20" [ref=e194] [cursor=pointer]
                  - cell "21" [ref=e195]:
                    - button "21" [ref=e196] [cursor=pointer]
                  - cell "22" [ref=e197]:
                    - button "22" [ref=e198] [cursor=pointer]
                  - cell "23" [ref=e199]:
                    - button "23" [ref=e200] [cursor=pointer]
            - rowgroup [ref=e201]:
              - row "24 25 26 27 28 29 30" [ref=e210]:
                - generic [ref=e211]:
                  - cell "24" [ref=e212]:
                    - button "24" [ref=e213] [cursor=pointer]
                  - cell "25" [ref=e214]:
                    - button "25" [ref=e215] [cursor=pointer]
                  - cell "26" [ref=e216]:
                    - button "26" [ref=e217] [cursor=pointer]
                  - cell "27" [ref=e218]:
                    - button "27" [ref=e219] [cursor=pointer]
                  - cell "28" [ref=e220]:
                    - button "28" [ref=e221] [cursor=pointer]
                  - cell "29" [ref=e222]:
                    - button "29" [ref=e223] [cursor=pointer]
                  - cell "30" [ref=e224]:
                    - button "30" [ref=e225] [cursor=pointer]
            - rowgroup [ref=e226]:
              - row "31 01 02 03 04 05 06" [ref=e235]:
                - generic [ref=e236]:
                  - cell "31" [ref=e237]:
                    - button "31" [ref=e238] [cursor=pointer]
                  - cell "01" [ref=e239]:
                    - button "01" [ref=e240] [cursor=pointer]
                  - cell "02" [ref=e241]:
                    - button "02" [ref=e242] [cursor=pointer]
                  - cell "03" [ref=e243]:
                    - button "03" [ref=e244] [cursor=pointer]
                  - cell "04" [ref=e245]:
                    - button "04" [ref=e246] [cursor=pointer]
                  - cell "05" [ref=e247]:
                    - button "05" [ref=e248] [cursor=pointer]
                  - cell "06" [ref=e249]:
                    - button "06" [ref=e250] [cursor=pointer]
  - dialog [ref=e252]:
    - generic [ref=e253]:
      - generic [ref=e254]:
        - heading "Tạo Lớp Học Mới" [level=5] [ref=e255]
        - button "Close" [ref=e256] [cursor=pointer]
      - generic [ref=e258]:
        - generic [ref=e259]:
          - generic [ref=e260]: Tên lớp học
          - textbox [active] [ref=e261]: Lớp Yoga Buổi Sáng
        - generic [ref=e262]:
          - generic [ref=e263]: Loại lớp
          - combobox [ref=e264]:
            - option "Yoga" [selected]
            - option "Zumba"
            - option "Pilates"
            - option "Boxing"
            - option "Crossfit"
        - generic [ref=e265]:
          - generic [ref=e266]: Ngày
          - textbox [ref=e267]: 2026-05-10
        - generic [ref=e268]:
          - generic [ref=e269]: Giờ bắt đầu
          - textbox [ref=e270]: 18:19
        - generic [ref=e271]:
          - generic [ref=e272]: Giờ kết thúc
          - textbox [ref=e273]: 19:19
        - generic [ref=e274]:
          - generic [ref=e275]: Chi nhánh
          - combobox [ref=e276]:
            - option "-- Chọn chi nhánh --"
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
        - generic [ref=e277]:
          - generic [ref=e278]: Huấn luyện viên
          - combobox [ref=e279]:
            - option "-- Chọn HLV --" [selected]
        - generic [ref=e280]:
          - generic [ref=e281]: Phòng tập
          - combobox [ref=e282]:
            - option "-- Chọn Phòng --" [selected]
            - option "Test_1778411908"
        - generic [ref=e283]:
          - generic [ref=e284]: Sức chứa tối đa
          - spinbutton [ref=e285]: "20"
        - generic [ref=e286]:
          - generic [ref=e287]: Tối thiểu để mở lớp
          - spinbutton [ref=e288]: "5"
        - generic [ref=e289]:
          - generic [ref=e290]: Mô tả
          - textbox [ref=e291]
      - generic [ref=e292]:
        - button "Hủy" [ref=e293] [cursor=pointer]
        - button "Tạo Lớp" [ref=e294] [cursor=pointer]
```

# Test source

```ts
  77  |     await expect(page).toHaveURL(/\/admin\/sales/);
  78  |   });
  79  | 
  80  |   // --- CONTRACTS MANAGEMENT ---
  81  |   // TC_28
  82  |   test('should navigate to Contracts Management', async ({ adminPage, page }) => {
  83  |     await adminPage.navigateTo('Contracts');
  84  |     await expect(page).toHaveURL(/\/admin\/contracts/);
  85  |   });
  86  | 
  87  |   // --- ATTENDANCE MANAGEMENT ---
  88  |   // TC_29
  89  |   test('should navigate to Attendance Management', async ({ adminPage, page }) => {
  90  |     await adminPage.navigateTo('Attendance');
  91  |     await expect(page).toHaveURL(/\/admin\/attendance/);
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
> 177 |     await page.selectOption('select[name="trainerStaffId"]', { index: 1 });
      |                ^ Error: page.selectOption: Test timeout of 30000ms exceeded.
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
  192 |     await expect(page.locator('table')).toContainText('Khách hàng tiềm năng');
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