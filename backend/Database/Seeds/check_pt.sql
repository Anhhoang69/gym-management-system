SELECT 
    u."FullName",
    pr."PeriodMonth",
    pr."PeriodYear",
    pr."SessionCount" AS "PayrollRecordSessions",
    (
        SELECT COUNT(*)
        FROM "Classes" c
        WHERE c."TrainerStaffId" = pr."StaffId"
          AND c."Status" = 'Completed'
          AND EXISTS (
              SELECT 1 FROM "ClassBookings" cb 
              WHERE cb."ClassId" = c."ClassId" 
                AND cb."Status" = 'Attended'
          )
          AND EXTRACT(MONTH FROM c."Date") = pr."PeriodMonth"
          AND EXTRACT(YEAR FROM c."Date") = pr."PeriodYear"
    ) AS "ActualClassesCompleted"
FROM "PayrollRecords" pr
JOIN "AspNetUsers" u ON pr."StaffId" = u."Id"
JOIN "Staffs" s ON pr."StaffId" = s."UserId"
WHERE s."Position" IN ('PT', 'HeadPT')
  AND pr."SessionCount" != (
        SELECT COUNT(*)
        FROM "Classes" c
        WHERE c."TrainerStaffId" = pr."StaffId"
          AND c."Status" = 'Completed'
          AND EXISTS (
              SELECT 1 FROM "ClassBookings" cb 
              WHERE cb."ClassId" = c."ClassId" 
                AND cb."Status" = 'Attended'
          )
          AND EXTRACT(MONTH FROM c."Date") = pr."PeriodMonth"
          AND EXTRACT(YEAR FROM c."Date") = pr."PeriodYear"
  );
