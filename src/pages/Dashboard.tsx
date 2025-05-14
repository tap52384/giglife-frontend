export default function Dashboard() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Welcome to your Dashboard
      </h1>
      <p className="max-w-xl text-muted-foreground text-lg">
        Here you can manage your gigs and profile.
      </p>
    </section>
  );
}
