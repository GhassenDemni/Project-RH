import { word, enumToOptions } from '@/helpers';
import Form from './form';
import prisma from '@/lib/prisma';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Gender, EmploymentTypeEnum } from '@prisma/client';

export default async function Users() {
  const departments = await prisma.department.findMany();
  const roles = await prisma.role.findMany();
  const employee_role_id = roles.find(role => role.name === 'EMPLOYEE')?.id;

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      placeholder: 'Amin benz',
    },
    { name: 'email', label: 'Email', placeholder: 'example@domain.com' },
    {
      name: 'phone',
      label: 'Phone number',
      placeholder: '+215 23 456 789',
    },
    {
      name: 'employee.employment_type',
      label: 'Employment type',
      placeholder: '--Select Employment Type--',
      type: 'select',
      options: enumToOptions(EmploymentTypeEnum),
    },
    {
      name: 'employee.position',
      label: 'Job position',
      placeholder: 'Full Stack Developer',
    },
    {
      name: 'employee.department_id',
      label: 'Department',
      placeholder: '--Select Department--',
      type: 'select',
      options: departments.map(d => ({ label: word(d.name), value: d.id })),
    },
    {
      name: 'employee.salary',
      label: 'Salary',
      type: 'number',
      min: 0,
      step: 100,
      placeholder: 1100,
    },
    {
      name: 'employee.hire_date',
      label: 'Hire date',
      type: 'date',
    },
    {
      name: 'gender',
      label: 'Select gender',
      type: 'radio',
      options: enumToOptions(Gender),
    },
    {
      name: 'role_id',
      label: 'Role',
      type: 'select',
      options: roles.map(r => ({ label: word(r.name), value: r.id })),
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Add User"
        text="Easily add new users to your organization with this user management dashboard."
      />
      <div className="grid gap-10">
        <Form
          fields={fields}
          defaultValues={{
            role_id: employee_role_id,
            employee: {
              hire_date: new Date().toISOString().split('T')[0],
              employment_type: EmploymentTypeEnum.FULL_TIME,
            },
          }}
        />
      </div>
    </DashboardShell>
  );
}
