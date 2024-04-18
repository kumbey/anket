import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h2 className="text-3xl font-bold">Not Found</h2>
      <p className="mt-2">Could not find requested resource</p>
      <Link href="/" className="mt-4 underline hover:no-underline">
        Return Home
      </Link>
    </div>
  );
}
