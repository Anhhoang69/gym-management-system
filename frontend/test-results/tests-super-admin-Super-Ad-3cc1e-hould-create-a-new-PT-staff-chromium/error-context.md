# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\super-admin.spec.ts >> Super Admin Dashboard & CRUD >> should create a new PT staff
- Location: e2e\tests\super-admin.spec.ts:141:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('table')
Expected substring: "Nguyen PT Test"
Received string:    "Người dùngVai tròChi nhánhTrạng tháiLần đăng nhậpUser_1778411899jolie.senger@hotmail.comStaffTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaNguyen Van Testnvtest_1778411758@gmail.comMember-Active-⋮Chỉnh sửaTạm ngưngXóaUser_1778411742wilber8@hotmail.comStaffTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411731@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411719@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Salessales_new@mail.comSalesTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411645@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaUser_1778411505johnathan_feeney@hotmail.comStaffTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411495@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411490@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóa"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('table')
    8 × locator resolved to <table class="table table-sm align-middle">…</table>
      - unexpected value "Người dùngVai tròChi nhánhTrạng tháiLần đăng nhậpUser_1778411899jolie.senger@hotmail.comStaffTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaNguyen Van Testnvtest_1778411758@gmail.comMember-Active-⋮Chỉnh sửaTạm ngưngXóaUser_1778411742wilber8@hotmail.comStaffTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411731@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411719@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Salessales_new@mail.comSalesTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411645@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaUser_1778411505johnathan_feeney@hotmail.comStaffTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411495@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóaTest Membertestmember_1778411490@gym.comMemberTest_1778411748Active-⋮Chỉnh sửaTạm ngưngXóa"

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
        - heading "Quản Lý Người Dùng" [level=3] [ref=e60]
        - button "+ Tạo Người Dùng Mới" [ref=e61] [cursor=pointer]
      - generic [ref=e62]:
        - generic [ref=e65]:
          - generic [ref=e66]:
            - paragraph [ref=e67]: Tổng Người Dùng
            - heading "39" [level=3] [ref=e68]
          - img [ref=e70]
        - generic [ref=e75]:
          - generic [ref=e76]:
            - paragraph [ref=e77]: Người Dùng Hoạt Động
            - heading "39" [level=3] [ref=e78]
          - img [ref=e80]
        - generic [ref=e85]:
          - generic [ref=e86]:
            - paragraph [ref=e87]: Tài Khoản Staff
            - heading "9" [level=3] [ref=e88]
          - img [ref=e90]
        - generic [ref=e95]:
          - generic [ref=e96]:
            - paragraph [ref=e97]: Thành Viên
            - heading "25" [level=3] [ref=e98]
          - img [ref=e100]
      - generic [ref=e104]:
        - textbox "Tìm theo tên, email..." [ref=e105]
        - combobox [ref=e106]:
          - option "Tất cả vai trò" [selected]
          - option "Super Admin"
          - option "Gym Owner"
          - option "Staff"
          - option "Member"
        - combobox [ref=e107]:
          - option "Tất cả chi nhánh" [selected]
          - option "Test_1778404938"
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
        - button "Reset" [ref=e108] [cursor=pointer]
      - table [ref=e112]:
        - rowgroup [ref=e113]:
          - row "Người dùng Vai trò Chi nhánh Trạng thái Lần đăng nhập" [ref=e114]:
            - columnheader [ref=e115]:
              - checkbox [ref=e116]
            - columnheader "Người dùng" [ref=e117]
            - columnheader "Vai trò" [ref=e118]
            - columnheader "Chi nhánh" [ref=e119]
            - columnheader "Trạng thái" [ref=e120]
            - columnheader "Lần đăng nhập" [ref=e121]
            - columnheader [ref=e122]
        - rowgroup [ref=e123]:
          - row "User_1778411899 jolie.senger@hotmail.com Staff Test_1778411748 Active - ⋮" [ref=e124] [cursor=pointer]:
            - cell [ref=e125]:
              - checkbox [ref=e126]
            - cell "User_1778411899 jolie.senger@hotmail.com" [ref=e127]:
              - generic [ref=e128]: User_1778411899
              - generic [ref=e129]: jolie.senger@hotmail.com
            - cell "Staff" [ref=e130]:
              - generic [ref=e131]: Staff
            - cell "Test_1778411748" [ref=e132]
            - cell "Active" [ref=e133]:
              - generic [ref=e134]: Active
            - cell "-" [ref=e135]
            - cell "⋮" [ref=e136]:
              - button "⋮" [ref=e138]
          - row "Nguyen Van Test nvtest_1778411758@gmail.com Member - Active - ⋮" [ref=e139] [cursor=pointer]:
            - cell [ref=e140]:
              - checkbox [ref=e141]
            - cell "Nguyen Van Test nvtest_1778411758@gmail.com" [ref=e142]:
              - generic [ref=e143]: Nguyen Van Test
              - generic [ref=e144]: nvtest_1778411758@gmail.com
            - cell "Member" [ref=e145]:
              - generic [ref=e146]: Member
            - cell "-" [ref=e147]
            - cell "Active" [ref=e148]:
              - generic [ref=e149]: Active
            - cell "-" [ref=e150]
            - cell "⋮" [ref=e151]:
              - button "⋮" [ref=e153]
          - row "User_1778411742 wilber8@hotmail.com Staff Test_1778411748 Active - ⋮" [ref=e154] [cursor=pointer]:
            - cell [ref=e155]:
              - checkbox [ref=e156]
            - cell "User_1778411742 wilber8@hotmail.com" [ref=e157]:
              - generic [ref=e158]: User_1778411742
              - generic [ref=e159]: wilber8@hotmail.com
            - cell "Staff" [ref=e160]:
              - generic [ref=e161]: Staff
            - cell "Test_1778411748" [ref=e162]
            - cell "Active" [ref=e163]:
              - generic [ref=e164]: Active
            - cell "-" [ref=e165]
            - cell "⋮" [ref=e166]:
              - button "⋮" [ref=e168]
          - row "Test Member testmember_1778411731@gym.com Member Test_1778411748 Active - ⋮" [ref=e169] [cursor=pointer]:
            - cell [ref=e170]:
              - checkbox [ref=e171]
            - cell "Test Member testmember_1778411731@gym.com" [ref=e172]:
              - generic [ref=e173]: Test Member
              - generic [ref=e174]: testmember_1778411731@gym.com
            - cell "Member" [ref=e175]:
              - generic [ref=e176]: Member
            - cell "Test_1778411748" [ref=e177]
            - cell "Active" [ref=e178]:
              - generic [ref=e179]: Active
            - cell "-" [ref=e180]
            - cell "⋮" [ref=e181]:
              - button "⋮" [ref=e183]
          - row "Test Member testmember_1778411719@gym.com Member Test_1778411748 Active - ⋮" [ref=e184] [cursor=pointer]:
            - cell [ref=e185]:
              - checkbox [ref=e186]
            - cell "Test Member testmember_1778411719@gym.com" [ref=e187]:
              - generic [ref=e188]: Test Member
              - generic [ref=e189]: testmember_1778411719@gym.com
            - cell "Member" [ref=e190]:
              - generic [ref=e191]: Member
            - cell "Test_1778411748" [ref=e192]
            - cell "Active" [ref=e193]:
              - generic [ref=e194]: Active
            - cell "-" [ref=e195]
            - cell "⋮" [ref=e196]:
              - button "⋮" [ref=e198]
          - row "Test Sales sales_new@mail.com Sales Test_1778411748 Active - ⋮" [ref=e199] [cursor=pointer]:
            - cell [ref=e200]:
              - checkbox [ref=e201]
            - cell "Test Sales sales_new@mail.com" [ref=e202]:
              - generic [ref=e203]: Test Sales
              - generic [ref=e204]: sales_new@mail.com
            - cell "Sales" [ref=e205]:
              - generic [ref=e206]: Sales
            - cell "Test_1778411748" [ref=e207]
            - cell "Active" [ref=e208]:
              - generic [ref=e209]: Active
            - cell "-" [ref=e210]
            - cell "⋮" [ref=e211]:
              - button "⋮" [ref=e213]
          - row "Test Member testmember_1778411645@gym.com Member Test_1778411748 Active - ⋮" [ref=e214] [cursor=pointer]:
            - cell [ref=e215]:
              - checkbox [ref=e216]
            - cell "Test Member testmember_1778411645@gym.com" [ref=e217]:
              - generic [ref=e218]: Test Member
              - generic [ref=e219]: testmember_1778411645@gym.com
            - cell "Member" [ref=e220]:
              - generic [ref=e221]: Member
            - cell "Test_1778411748" [ref=e222]
            - cell "Active" [ref=e223]:
              - generic [ref=e224]: Active
            - cell "-" [ref=e225]
            - cell "⋮" [ref=e226]:
              - button "⋮" [ref=e228]
          - row "User_1778411505 johnathan_feeney@hotmail.com Staff Test_1778411748 Active - ⋮" [ref=e229] [cursor=pointer]:
            - cell [ref=e230]:
              - checkbox [ref=e231]
            - cell "User_1778411505 johnathan_feeney@hotmail.com" [ref=e232]:
              - generic [ref=e233]: User_1778411505
              - generic [ref=e234]: johnathan_feeney@hotmail.com
            - cell "Staff" [ref=e235]:
              - generic [ref=e236]: Staff
            - cell "Test_1778411748" [ref=e237]
            - cell "Active" [ref=e238]:
              - generic [ref=e239]: Active
            - cell "-" [ref=e240]
            - cell "⋮" [ref=e241]:
              - button "⋮" [ref=e243]
          - row "Test Member testmember_1778411495@gym.com Member Test_1778411748 Active - ⋮" [ref=e244] [cursor=pointer]:
            - cell [ref=e245]:
              - checkbox [ref=e246]
            - cell "Test Member testmember_1778411495@gym.com" [ref=e247]:
              - generic [ref=e248]: Test Member
              - generic [ref=e249]: testmember_1778411495@gym.com
            - cell "Member" [ref=e250]:
              - generic [ref=e251]: Member
            - cell "Test_1778411748" [ref=e252]
            - cell "Active" [ref=e253]:
              - generic [ref=e254]: Active
            - cell "-" [ref=e255]
            - cell "⋮" [ref=e256]:
              - button "⋮" [ref=e258]
          - row "Test Member testmember_1778411490@gym.com Member Test_1778411748 Active - ⋮" [ref=e259] [cursor=pointer]:
            - cell [ref=e260]:
              - checkbox [ref=e261]
            - cell "Test Member testmember_1778411490@gym.com" [ref=e262]:
              - generic [ref=e263]: Test Member
              - generic [ref=e264]: testmember_1778411490@gym.com
            - cell "Member" [ref=e265]:
              - generic [ref=e266]: Member
            - cell "Test_1778411748" [ref=e267]
            - cell "Active" [ref=e268]:
              - generic [ref=e269]: Active
            - cell "-" [ref=e270]
            - cell "⋮" [ref=e271]:
              - button "⋮" [ref=e273]
      - generic [ref=e274]:
        - generic [ref=e275]: Hiển thị 1–10 của 39
        - navigation [ref=e276]:
          - list [ref=e277]:
            - listitem [ref=e278]:
              - generic: ‹
            - listitem [ref=e279]:
              - generic [ref=e280]: "1"
            - listitem [ref=e281]:
              - generic [ref=e282]: "2"
            - listitem [ref=e283]:
              - generic [ref=e284]: "3"
            - listitem [ref=e285]:
              - generic [ref=e286]: ›
      - generic [ref=e288]:
        - generic [ref=e289]:
          - generic [ref=e290]: Tạo người dùng
          - button "×" [ref=e291] [cursor=pointer]
        - generic [ref=e292]:
          - heading "Thông tin cá nhân" [level=6] [ref=e293]
          - generic [ref=e294]:
            - generic [ref=e295]:
              - generic [ref=e296]: Họ tên
              - textbox [ref=e297]: Nguyen PT Test
            - generic [ref=e298]:
              - generic [ref=e299]: Email
              - textbox [ref=e300]: pt_1778411949904@test.com
            - generic [ref=e301]:
              - generic [ref=e302]: Mật khẩu
              - textbox [ref=e303]: PT@123
            - generic [ref=e304]:
              - generic [ref=e305]: SĐT
              - textbox [ref=e306]
            - generic [ref=e307]:
              - generic [ref=e308]: Giới tính
              - combobox [ref=e309]:
                - option "Chọn" [selected]
                - option "Nam"
                - option "Nữ"
                - option "Khác"
            - generic [ref=e310]:
              - generic [ref=e311]: Ngày sinh
              - textbox [ref=e312]
            - generic [ref=e313]:
              - generic [ref=e314]: Địa chỉ
              - textbox [ref=e315]
          - heading "Phân quyền" [level=6] [ref=e316]
          - generic [ref=e317]:
            - generic [ref=e318]:
              - generic [ref=e319]: Role
              - combobox [ref=e320]:
                - option "Chọn"
                - option "Super Admin"
                - option "Branch Admin"
                - option "Member"
                - option "Staff" [selected]
            - generic [ref=e321]:
              - generic [ref=e322]: Chi nhánh
              - combobox [ref=e323]:
                - option "Chọn chi nhánh"
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
            - generic [ref=e324]:
              - generic [ref=e325]: Chức vụ
              - combobox [ref=e326]:
                - option "Chọn"
                - option "Branch Admin"
                - option "PT" [selected]
                - option "Head PT"
                - option "Sales"
                - option "Receptionist"
        - generic [ref=e327]:
          - button "Hủy" [ref=e328] [cursor=pointer]
          - button "Tạo" [active] [ref=e329] [cursor=pointer]
```

# Test source

```ts
  51  | 
  52  |   // --- ROOM MANAGEMENT ---
  53  |   // TC_24
  54  |   test('should navigate to Room Management', async ({ adminPage, page }) => {
  55  |     await adminPage.navigateTo('Rooms');
  56  |     await expect(page).toHaveURL(/\/admin\/rooms/);
  57  |   });
  58  | 
  59  |   // --- CLASS MANAGEMENT ---
  60  |   // TC_25
  61  |   test('should navigate to Class Management', async ({ adminPage, page }) => {
  62  |     await adminPage.navigateTo('Classes');
  63  |     await expect(page).toHaveURL(/\/admin\/classes/);
  64  |   });
  65  | 
  66  |   // --- LEADS MANAGEMENT ---
  67  |   // TC_26
  68  |   test('should navigate to Leads Management', async ({ adminPage, page }) => {
  69  |     await adminPage.navigateTo('Leads');
  70  |     await expect(page).toHaveURL(/\/admin\/leads/);
  71  |   });
  72  | 
  73  |   // --- SALES MANAGEMENT ---
  74  |   // TC_27
  75  |   test('should navigate to Sales Management', async ({ adminPage, page }) => {
  76  |     await adminPage.navigateTo('Sales');
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
> 151 |     await expect(page.locator('table')).toContainText('Nguyen PT Test');
      |                                         ^ Error: expect(locator).toContainText(expected) failed
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