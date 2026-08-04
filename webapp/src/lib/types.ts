// Shared client-side types mirroring the JSON shapes returned by the API routes.

export type Course = {
  id: number;
  name: string;
  duration: string | null;
  fullPrice: number | null;
  monthlyPrice: number | null;
  monthlyInstallments: number;
  isActive: boolean;
};

export type RegistrationListItem = {
  id: number;
  receipt_no: string;
  registration_date: string;
  total_amount: number;
  admission_fees: number;
  paid_amount: number;
  due_amount: number;
  payment_method: string | null;
  payment_status: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  overdue_months: number;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Installment = {
  id: number;
  month_number: number;
  month_name: string;
  due_date: string;
  installment_amount: number;
  paid_amount: number;
  payment_status: string;
  payment_date: string | null;
  course_name: string;
};

export type RegistrationDetail = {
  id: number;
  receipt_no: string;
  registration_date: string;
  total_amount: number;
  admission_fees: number;
  discount_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_method: string | null;
  payment_status: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  address: string | null;
  date_of_birth: string | null;
  student_id: number | null;
  // Every registration held by this student (including the current one), for the
  // "student files" strip that lets the desk hop between separate registrations.
  student_registrations: {
    receipt_no: string;
    registration_date: string;
    payment_status: string;
    due_amount: number;
    course_names: string[];
  }[];
  courses: {
    course_id: number | null;
    course_name: string;
    payment_plan: string;
    course_fee: number;
    duration: string | null;
  }[];
  monthly_installments: Installment[];
};

export type DashboardStats = {
  totalRegistrations: number;
  totalStudents: number;
  totalRevenue: number;
  pendingPayments: number;
  registrationsThisMonth: number;
  popularCourses: { name: string; enrollment_count: number }[];
};
