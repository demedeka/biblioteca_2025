import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, X, Save, Shield, Users, Box, PenBox, PackageOpen, FileText, Settings } from "lucide-react"; // Import icons from lucide-react
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UI } from "react-day-picker";


interface UserFormProps {
    initialData?: {
        id: string;
        name: string;
        email: string;
    };
    page?: string;
    perPage?: string;
}

// Field error display component
function FieldInfo({ field }: { field: AnyFieldApi }) {
    function t(arg0: string): import("react").ReactNode {
        throw new Error("Function not implemented.");
    }

    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                </p>
            ) : null}
            {field.state.meta.isValidating ? (
                <p className="mt-1 text-sm text-muted-foreground">{t("ui.create.validating")}</p>
            ) : null}
        </>
    );
}

export function UserForm({ initialData, page, perPage }: UserFormProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();

    // TanStack Form setup
    const form = useForm({
        defaultValues: {
            name: initialData?.name ?? "",
            email: initialData?.email ?? "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["users"] });

                    // Construct URL with page parameters
                    let url = "/users";
                    if (page) {
                        url += `?page=${page}`;
                        if (perPage) {
                            url += `&per_page=${perPage}`;
                        }
                    }

                    router.visit(url);
                },
                onError: (errors: Record<string, string>) => {
                    if (Object.keys(errors).length === 0) {
                        toast.error(
                            initialData
                                ? t("messages.users.error.update")
                                : t("messages.users.error.create")
                        );
                    }
                },
            };

            // Submit with Inertia
            if (initialData) {
                router.put(`/users/${initialData.id}`, value, options);
            } else {
                router.post("/users", value, options);
            }
        },
    });

    // Form submission handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Tabs defaultValue="account" className="w-[800px]">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center">
                            <User className="mr-2 text-blue-500" />
                            {t("ui.create.create_new_user_text")}
                        </h1>
                        <h3 className="mt-1 text-sm text-muted-foreground">
                        {t("ui.create.header3")}
                        </h3>
                    </div>
                    <div>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">{t("ui.create.basic_information")}</TabsTrigger>
                            <TabsTrigger value="password">{t("ui.create.roles_and_permissions")}</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="account">
                        <Card>
                            <CardContent className="space-y-2">
                                {/* Name field */}
                                <div>
                                    <form.Field
                                        name="name"
                                        validators={{
                                            onChangeAsync: async ({ value }) => {
                                                await new Promise((resolve) => setTimeout(resolve, 500));
                                                return !value
                                                    ? t("ui.validation.required", { attribute: t("ui.users.fields.name").toLowerCase() })
                                                    : value.length < 2
                                                        ? t("ui.validation.min.string", { attribute: t("ui.users.fields.name").toLowerCase(), min: "2" })
                                                        : undefined;
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <>
                                                <Label htmlFor={field.name} className="flex items-center">
                                                    <User className="mr-2" />
                                                    {t("ui.create.name")}
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        onBlur={field.handleBlur}
                                                        placeholder={t("ui.create.fullNameUser_ph")}
                                                        disabled={form.state.isSubmitting}
                                                        required={false}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <FieldInfo field={field} />
                                            </>
                                        )}
                                    </form.Field>
                                </div>

                                {/* Email field */}
                                <div>
                                    <form.Field
                                        name="email"
                                        validators={{
                                            onChangeAsync: async ({ value }) => {
                                                await new Promise((resolve) => setTimeout(resolve, 500));
                                                return !value
                                                    ? t("ui.validation.required", { attribute: t("ui.users.fields.email").toLowerCase() })
                                                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                                                        ? t("ui.validation.email", { attribute: t("ui.users.fields.email").toLowerCase() })
                                                        : undefined;
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <>
                                                <Label htmlFor={field.name} className="flex items-center">
                                                    <Mail className="mr-2" />
                                                    {t("ui.create.email")}
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="text"
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        onBlur={field.handleBlur}
                                                        placeholder={t("ui.create.emailUser_ph")}
                                                        disabled={form.state.isSubmitting}
                                                        required={false}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <FieldInfo field={field} />
                                            </>
                                        )}
                                    </form.Field>
                                </div>
                                <div>
                                    <form.Field
                                        name="password"
                                        validators={{
                                            onChangeAsync: async ({ value }) => {
                                                await new Promise((resolve) => setTimeout(resolve, 500));
                                                if (!initialData && (!value || value.length === 0)) {
                                                    return t("ui.validation.required", { attribute: t("ui.users.fields.password").toLowerCase() });
                                                }
                                                if (value && value.length > 0 && value.length < 8) {
                                                    return t("ui.validation.min.string", { attribute: t("ui.users.fields.password").toLowerCase(), min: "8" });
                                                }
                                                return undefined;
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <>
                                                <Label htmlFor={field.name} className="flex items-center">
                                                    <Lock className="mr-2" />
                                                    {initialData
                                                        ? t("ui.create.optional_password")
                                                        : t("ui.create.password")}
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="password"
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        onBlur={field.handleBlur}
                                                        placeholder={t("ui.create.passwordUser_ph")}
                                                        disabled={form.state.isSubmitting}
                                                        autoComplete="off"
                                                        required={false}
                                                    />
                                                </div>
                                                <FieldInfo field={field} />
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                   {t("ui.create.password_requirements")}
                                                </p>
                                            </>
                                        )}
                                    </form.Field>
                                </div>
                                {/* Form buttons */}
                                <div className="flex justify-between">
                                    <div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                let url = "/users";
                                                if (page) {
                                                    url += `?page=${page}`;
                                                    if (perPage) {
                                                        url += `&per_page=${perPage}`;
                                                    }
                                                }
                                                router.visit(url);
                                            }}
                                            disabled={form.state.isSubmitting}
                                        >
                                            <X className="mr-2" />
                                            {t("ui.create.cancel_button")}
                                        </Button>
                                    </div>

                                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                        {([canSubmit, isSubmitting]) => (
                                            <div>
                                                <Button type="submit" disabled={!canSubmit} className="bg-blue-500 text-white">
                                                    <Save className="mr-2" />
                                                    {isSubmitting ? t("ui.create.saving") : initialData ? t("ui.create.save_button") : t("ui.create.save_button")}
                                                </Button>
                                            </div>
                                        )}
                                    </form.Subscribe>
                                </div>

                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardContent className="space-y-4">
                                {/* Selección de Rol */}
                                <div className="space-y-1">
                                    <Label className="font-semibold, flex items-center">
                                        <Shield className="mr-2" />
                                        {t("ui.roles_and_permissions.label_Principal_Role")}
                                    </Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("ui.roles_and_permissions.select_role")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">{t("ui.create.roles.administrator")}</SelectItem>
                                            <SelectItem value="visualizador">{t("ui.create.roles.visualizer")}</SelectItem>
                                            <SelectItem value="usuario">{t("ui.create.roles.user")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        {t("ui.create.role_description")}
                                    </p>
                                    <br />
                                    <hr />
                                    <p className=" font-semibold flex items-center mt-7">
                                        <Shield className="mr-2 text-blue-500" />
                                        {t("ui.create.specific_permissions")}
                                    </p>
                                </div>
                                {/* Sección de Permisos */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Usuarios */}
                                    <Card className="bg-gray-100">
                                        <CardHeader>
                                            <CardTitle className="text-sm font-semibold flex items-center">
                                            <Users className="mr-2 text-blue-500" />
                                                {t("ui.roles_and_permissions.users_map")}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {[t("ui.roles_and_permissions.users_crud.read"), t("ui.roles_and_permissions.users_crud.create"), t("ui.roles_and_permissions.users_crud.update"), t("ui.roles_and_permissions.users_crud.delete")].map(
                                                (permiso, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <Checkbox id={`usuarios-${index}`} className="border-blue-500"/>
                                                        <Label htmlFor={`usuarios-${index}`} className="text-sm">
                                                            {permiso}
                                                        </Label>
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Productos */}
                                    <Card className="bg-gray-100">
                                        <CardHeader>
                                        <CardTitle className="text-sm font-semibold flex items-center">
                                        <PackageOpen className="mr-2 text-blue-500" />
                                                {t("ui.roles_and_permissions.products_map")}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {[t("ui.roles_and_permissions.crud.read"), t("ui.roles_and_permissions.crud.create"), t("ui.roles_and_permissions.crud.update"), t("ui.roles_and_permissions.crud.delete")].map(
                                                (permiso, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <Checkbox id={`productos-${index}`} className="border-blue-500"/>
                                                        <Label htmlFor={`productos-${index}`} className="text-sm">
                                                            {permiso}
                                                        </Label>
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Reportes */}
                                    <Card className="bg-gray-100">
                                        <CardHeader>
                                        <CardTitle className="text-sm font-semibold flex items-center">
                                        <FileText className="mr-2 text-blue-500"/>
                                            {t("ui.roles_and_permissions.reports_map")}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {[t("ui.roles_and_permissions.report_checkboxs.view_reports"), t("ui.roles_and_permissions.report_checkboxs.export_reports"), t("ui.roles_and_permissions.report_checkboxs.print_reports")].map((permiso, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Checkbox id={`reportes-${index}`} className="border-blue-500" />
                                                    <Label htmlFor={`reportes-${index}`} className="text-sm">
                                                        {permiso}
                                                    </Label>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Configuración */}
                                    <Card className="bg-gray-100">
                                        <CardHeader>
                                        <CardTitle className="text-sm font-semibold flex items-center">
                                        <Settings className="mr-2 text-blue-500"/>
                                                {t("ui.roles_and_permissions.config_map")}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {[t("ui.roles_and_permissions.config_checkboxs.config_access"), t("ui.roles_and_permissions.config_checkboxs.config_modify")].map((permiso, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Checkbox id={`configuracion-${index}`} className="border-blue-500" />
                                                    <Label htmlFor={`configuracion-${index}`} className="text-sm">
                                                        {permiso}
                                                    </Label>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                                <hr />
                                {/* Form buttons */}
                                <div className="flex justify-between">
                                    <div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                let url = "/users";
                                                if (page) {
                                                    url += `?page=${page}`;
                                                    if (perPage) {
                                                        url += `&per_page=${perPage}`;
                                                    }
                                                }
                                                router.visit(url);
                                            }}
                                            disabled={form.state.isSubmitting}
                                        >
                                            <X className="mr-2" />
                                            {t("ui.create.cancel_button")}
                                        </Button>
                                    </div>

                                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                        {([canSubmit, isSubmitting]) => (
                                            <div>
                                                <Button type="submit" disabled={!canSubmit} className="bg-blue-500 text-white">
                                                    <Save className="mr-2" />
                                                    {isSubmitting ? t("ui.create.saving") : initialData ? t("ui.create.save_button") : t("ui.create.save_button")}
                                                </Button>
                                            </div>
                                        )}
                                    </form.Subscribe>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}