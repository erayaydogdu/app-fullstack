import { RoleForm } from '@/features/user/components/role-form';

export default function NewRolePage() {
  return (
    <div className="p-4 md:p-8">
      {/* Render the form for creating a new role (no initialData) */}
      <RoleForm />
    </div>
  );
}