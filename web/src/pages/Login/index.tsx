import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { loginService, persistAuth } from "@/services/auth.service";

interface LoginForm {
  correo: string;
  contrasena: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { correo: "", contrasena: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await loginService(data);
      persistAuth(res);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al iniciar sesión";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[hsl(222,47%,6%)]">
      {/* ── Orbes decorativos ─────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/12 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-cyan-500/8 blur-[100px]" />

      {/* ── Grid pattern sutil ────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Card de Login ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glow detrás de la card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-violet-600/20 blur-xl opacity-60" />

        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40 p-8 sm:p-10">
          {/* ── Logo ───────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                SmartPOS
              </h1>
              <p className="text-sm text-white/40 mt-1">
                Inicia sesión en tu cuenta
              </p>
            </div>
          </div>

          {/* ── Error Alert ───────────────────────────────────────────────── */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 p-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          {/* ── Formulario ────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Correo */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-correo"
                className="block text-xs font-semibold text-white/50 uppercase tracking-wider"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
                <input
                  id="login-correo"
                  type="email"
                  autoComplete="email"
                  placeholder="Correo electrónico"
                  className={`w-full rounded-xl border bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/40 ${
                    errors.correo
                      ? "border-red-500/40"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                  {...register("correo", {
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo válido",
                    },
                  })}
                />
              </div>
              {errors.correo && (
                <p className="text-xs text-red-400 pl-1">{errors.correo.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-contrasena"
                className="block text-xs font-semibold text-white/50 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
                <input
                  id="login-contrasena"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-white/[0.04] pl-11 pr-12 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/40 ${
                    errors.contrasena
                      ? "border-red-500/40"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                  {...register("contrasena", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 4,
                      message: "Mínimo 4 caracteres",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-white/25 hover:text-white/50 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-xs text-red-400 pl-1">{errors.contrasena.message}</p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="group relative w-full rounded-xl bg-gradient-to-r from-primary to-violet-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ingresando…
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </span>
            </button>
          </form>

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div className="mt-8 pt-5 border-t border-white/[0.06]">
            <p className="text-center text-xs text-white/25">
              SmartPOS v1.0.0 — Sistema de Punto de Venta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
