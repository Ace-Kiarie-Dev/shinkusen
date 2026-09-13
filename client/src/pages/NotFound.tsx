import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-6xl text-brand-crimson">404</h1>
      <p className="mt-4 text-brand-muted">This page does not exist.</p>
      <Link to="/" className="mt-8 inline-block">
        <Button>Back Home</Button>
      </Link>
    </div>
  );
}
