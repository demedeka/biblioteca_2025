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
import { User, Mail, Lock, X, Save } from "lucide-react"; // Import icons from lucide-react
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                </p>
            ) : null}
            {field.state.meta.isValidating ? (
                <p className="mt-1 text-sm text-muted-foreground">Validando...</p>
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
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Información Básica</TabsTrigger>
                        <TabsTrigger value="password">Roles y Permisos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Crear Nuevo Usuario</CardTitle>
                            </CardHeader>
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
                                                    Nombre
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        onBlur={field.handleBlur}
                                                        placeholder="Nombre completo del usuario"
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
                                                    Email
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="text"
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        onBlur={field.handleBlur}
                                                        placeholder="correo@ejemplo.com"
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
                                                        ? "Contraseña (opcional)"
                                                        : "Contraseña"}
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="password"
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        onBlur={field.handleBlur}
                                                        placeholder="Contraseña segura"
                                                        disabled={form.state.isSubmitting}
                                                        autoComplete="off"
                                                        required={false}
                                                    />
                                                </div>
                                                <FieldInfo field={field} />
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    La contraseña debe tener al menos 8 caracteres, incluyendo letras y números
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
                                            Cancelar
                                        </Button>
                                    </div>

                                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                        {([canSubmit, isSubmitting]) => (
                                            <div>
                                                <Button type="submit" disabled={!canSubmit} className="bg-blue-500 text-white">
                                                    <Save className="mr-2" />
                                                    {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Guardar"}
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
                            <CardHeader>
                                <CardTitle>Roles y Permisos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Selección de Rol */}
                                <div className="space-y-1">
                                    <Label className="font-semibold">Rol Principal</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="usuario">Usuario</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        El rol determina el nivel de acceso general del usuario.
                                    </p>
                                </div>

                                {/* Sección de Permisos */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Usuarios */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-semibold">Usuarios</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {["Ver usuarios", "Crear usuarios", "Editar usuarios", "Eliminar usuarios"].map(
                                                (permiso, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <Checkbox id={`usuarios-${index}`} />
                                                        <Label htmlFor={`usuarios-${index}`} className="text-sm">
                                                            {permiso}
                                                        </Label>
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Productos */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-semibold">Productos</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {["Ver productos", "Crear productos", "Editar productos", "Eliminar productos"].map(
                                                (permiso, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <Checkbox id={`productos-${index}`} />
                                                        <Label htmlFor={`productos-${index}`} className="text-sm">
                                                            {permiso}
                                                        </Label>
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Reportes */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-semibold">Reportes</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {["Ver reportes", "Exportar reportes", "Imprimir reportes"].map((permiso, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Checkbox id={`reportes-${index}`} />
                                                    <Label htmlFor={`reportes-${index}`} className="text-sm">
                                                        {permiso}
                                                    </Label>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Configuración */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-semibold">Configuración</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {["Acceso a configuración", "Modificar configuración"].map((permiso, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Checkbox id={`configuracion-${index}`} />
                                                    <Label htmlFor={`configuracion-${index}`} className="text-sm">
                                                        {permiso}
                                                    </Label>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
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
                                            Cancelar
                                        </Button>
                                    </div>

                                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                        {([canSubmit, isSubmitting]) => (
                                            <div>
                                                <Button type="submit" disabled={!canSubmit} className="bg-blue-500 text-white">
                                                    <Save className="mr-2" />
                                                    {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Guardar"}
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