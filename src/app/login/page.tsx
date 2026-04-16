import { BrandHero } from "./_components/BrandHero";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-creamWhite">
      {/* Visual branding section */}
      <BrandHero />

      {/* Form section */}
      <section className="flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 h-full">
        <LoginForm />
      </section>
    </main>
  );
}
