import EditUserPage from '../[userId]/edit/page';

export default function NewUserPage() {
  return <EditUserPage params={{ userId: undefined }} mode="create" />;
}