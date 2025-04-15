import { z } from "zod";

export const registerUserCommandSchema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  userName: z.string().nullable(),
  password: z.string().nullable(),
  confirmPassword: z.string().nullable(),
  phoneNumber: z.string().nullable(),
});

export const registerUserResponseSchema = z.object({
  userId: z.string().nullable(),
});

export const updateUserCommandSchema = z.object({
  id: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  image: z.object({}).nullable().optional(), // FileUploadCommand
  deleteCurrentImage: z.boolean().optional(),
});

export const userDetailSchema = z.object({
  id: z.string().uuid(),
  userName: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  isActive: z.boolean(),
  emailConfirmed: z.boolean(),
  phoneNumber: z.string().nullable(),
  imageUrl: z.string().nullable(),
});

export const forgotPasswordCommandSchema = z.object({
  email: z.string().nullable(),
});

export const changePasswordCommandSchema = z.object({
  password: z.string().nullable(),
  newPassword: z.string().nullable(),
  confirmNewPassword: z.string().nullable(),
});

export const resetPasswordCommandSchema = z.object({
  email: z.string().nullable(),
  password: z.string().nullable(),
  token: z.string().nullable(),
});

export const toggleUserStatusCommandSchema = z.object({
  activateUser: z.boolean(),
  userId: z.string().nullable(),
});

export const assignUserRoleCommandSchema = z.object({
  userRoles: z.array(z.object({
    roleId: z.string().nullable(),
    roleName: z.string().nullable(),
    description: z.string().nullable(),
    enabled: z.boolean(),
  })).nullable(),
});

export const userRoleDetailSchema = z.object({
  roleId: z.string().nullable(),
  roleName: z.string().nullable(),
  description: z.string().nullable(),
  enabled: z.boolean(),
});

export const auditTrailSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  operation: z.string().nullable(),
  entity: z.string().nullable(),
  dateTime: z.string(), // DateTime
  previousValues: z.string().nullable(),
  newValues: z.string().nullable(),
  modifiedProperties: z.string().nullable(),
  primaryKey: z.string().nullable(),
});