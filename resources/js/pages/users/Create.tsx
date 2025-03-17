import { UserForm } from "@/pages/users/components/UserForm";
import { UserLayout } from "@/layouts/users/UserLayout";
import { useTranslations } from "@/hooks/use-translations";

export default function CreateUser() {
  const { t } = useTranslations();

  return (
    <UserLayout title={t("ui.users.create")}>
      <div className="flex justify-center items-start min-h-screen">
        <div className="p-6">
          <div className="max-w-xl">
            <UserForm />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
