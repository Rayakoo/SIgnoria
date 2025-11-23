"use client";

import { useState, useEffect, ReactNode } from "react";
import Loader from "./loader";

type Props = { children: ReactNode };

export default function LoaderWrapper({ children }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return <>{children}</>;
}
