import { object, string, literal, union, z } from 'zod';
import { EmploymentTypeEnum, Gender } from '@prisma/client';

export const NAME_REGEX = /^[A-Za-z\s]+$/;
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const USERNAME_REGEX = /^(?!.*[_.]{2})(?![0-9])[a-zA-Z0-9_.]{4,15}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@#$%^&+=]{12,32}$/;

const passwordSchema = (label = 'Password') => {
  return string({
    required_error: `The ${label} field is required`,
    invalid_type_error: `Invalid input type. The ${label} field must be a string`,
  })
    .nonempty(`The ${label} field cannot be empty`)
    .min(12, {
      message: `The ${label} must have a minimum length of 12 characters`,
    })
    .max(32, {
      message: `The ${label} must have a maximum length of 32 characters`,
    })
    .refine(value => PASSWORD_REGEX.test(value), {
      message: `The ${label} must include at least one uppercase letter, one lowercase letter, and one number`,
    });
};

export const nameSchema = string({
  required_error: 'The name field is required',
  invalid_type_error: 'Invalid input type. The name field must be a string',
})
  .trim()
  .min(3, {
    message: 'The username must have a minimum length of 3 characters',
  })
  .max(30, {
    message: 'The username must have a length between 3 and 20 characters',
  })
  .regex(NAME_REGEX, 'Name must contain only letters and spaces');

export const emailSchema = z
  .string({
    required_error: 'The email field is required',
    invalid_type_error: 'Invalid input type. The email field must be a string',
  })
  .toLowerCase()
  .trim()
  .nonempty('The email field cannot be empty')
  .email({ message: 'The email address provided is invalid' });

export const usernameSchema = string({
  required_error: 'The username field is required',
  invalid_type_error: 'Invalid input type. The username field must be a string',
})
  .toLowerCase()
  .min(4, {
    message: 'The username must have a minimum length of 4 characters',
  })
  .max(20, {
    message: 'The username must have a length between 4 and 20 characters',
  })
  .refine(
    val => {
      return USERNAME_REGEX.test(val);
    },
    {
      message: 'The username contains invalid characters',
    }
  );

export const userRegisterSchema = object({
  email: emailSchema,
  new_password: passwordSchema().optional(),
  first_name: z.string().min(3).max(20).optional(),
  last_name: z.string().min(3).max(20).optional(),
  name: z.string().min(3).max(20).optional(),
  username: usernameSchema.optional(),
  type: z.enum(['federated', 'password', 'auto', 'passwordless']).optional(),
});

export const userLoginSchema = object({
  username: string({
    required_error: 'Please provide your email or username',
    invalid_type_error: 'Email or username must be a text',
  })
    .toLowerCase()
    .trim()
    .nonempty({ message: 'Please provide your email or username' }),
  password: string({
    required_error: 'Please provide your password',
    invalid_type_error: 'Password must be a string',
  })
    .nonempty({ message: 'Please provide your password' })
    .optional(),
  otp: string({
    required_error: 'OTP field is required',
    invalid_type_error: 'OTP must be a digits 0,9',
  })
    .trim()
    .nonempty('OTP field is required to complete this process.')
    .length(6, 'OTP must be 6 digits')
    .optional(),
  type: z.enum(['federated', 'password', 'auto']).optional(),
  name: z.string().optional(),
}).strict();

type UserLoginSchema = z.infer<typeof userLoginSchema>;

export const smsSchema = object({
  phone: string().min(10).max(20),
  method: z.enum(['sms', 'call']),
});

export const resetPasswordSchema = object({
  user_id: string(),
  phone: string().optional(),
  email: string().optional(),
  new_password: passwordSchema('New password'),
  confirm_new_password: z.string().min(1, ' Please confirm password'),
}).refine(data => data.new_password === data.confirm_new_password, {
  path: ['new_password'],
  message: "Passwords don't match",
});

export const setNewPasswordSchema = object({
  user_id: string().optional(),
  email: emailSchema.optional(),
  new_password: passwordSchema('New password'),
  confirm_new_password: z.string().min(1, ' Please confirm password'),
}).refine(data => data.new_password === data.confirm_new_password, {
  path: ['new_password'],
  message: "Passwords don't match",
});

export type SetNewPasswordSchema = z.infer<typeof setNewPasswordSchema>;

export const changePasswordSchema = object({
  user_id: string().optional(),
  old_password: z.string().min(8, 'Please enter your old password'),
  new_password: passwordSchema('New password'),
  confirm_new_password: z.string().min(1, ' Please confirm password'),
}).refine(data => data.new_password === data.confirm_new_password, {
  path: ['new_password'],
  message: "Passwords don't match",
});

export const setPasswordSchema = object({
  user_id: string().optional(),
  password: passwordSchema(),
});

export type SetPasswordSchema = z.infer<typeof setPasswordSchema>;

export const roleSchema = z.object({
  id: z
    .string({
      required_error: 'The role id field is required',
      invalid_type_error: `Invalid input type. The role id field must be a string`,
    })
    .nonempty('The role id field cannot be empty')
    .optional(),
  name: z
    .string({
      required_error: 'The role name field is required',
      invalid_type_error: `Invalid input type. The role name field must be a string`,
    })
    .trim()
    .nonempty('The role name field cannot be empty')
    .min(3, {
      message: `The role name must have a minimum length of 3 characters`,
    })
    .max(20, {
      message: `The role name must have a maximum length of 20 characters`,
    })
    .toUpperCase()
    .transform(value => value.replaceAll(' ', '_')),
  description: z
    .string({
      invalid_type_error: `Invalid input type. The role description field must be a string`,
    })
    .trim()
    .min(10, {
      message: `The role description must have a minimum length of 10 characters`,
    })
    .max(100, {
      message: `The role description must have a maximum length of 100 characters`,
    })
    .nullish(),
});

export const employeeSchema = z.object({
  employment_type: z.nativeEnum(EmploymentTypeEnum),
  hire_date: z.coerce.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date',
  }),
  salary: z.preprocess(a => parseFloat(a as string), z.number().nonnegative().nullish()),
  department_id: z
    .string({
      required_error: 'Department ID is required',
    })
    .nonempty('The role id field cannot be empty'),
  position: z
    .string({
      required_error: 'Position is required',
    })
    .nonempty('The position id field cannot be empty'),
});

export const userSchema = z.object({
  id: string().optional(),
  name: nameSchema,
  email: emailSchema,
  phone: string({}).optional(),
  gender: z
    .nativeEnum(Gender, {
      invalid_type_error: 'Gender must be male or female.',
      required_error: 'Gender is required.',
    })
    .nullable()
    .optional(),
  employee: employeeSchema.nullish(),
  role_id: z
    .string({
      required_error: 'The role id field is required',
      invalid_type_error: `Invalid input type. The role id field must be a string`,
    })
    .nonempty('The role id field cannot be empty')
    .nullish(),
});

export type UserSchema = z.infer<typeof userSchema>;
