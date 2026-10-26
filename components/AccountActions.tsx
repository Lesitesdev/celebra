"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

type Props = { showDashboardLink?: boolean };

export default function AccountActions({ showDashboardLink = false }: Props) {
  const [userName, setUserName] = useState<string>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function readUser() {
      try {
        const user = JSON.parse(localStorage.getItem("celebra.auth.user") || "null");
        const token = localStorage.getItem("celebra.auth.token");
        setUserName(token && typeof user?.fullName === "string" ? user.fullName.trim() : "");
      } catch {
        setUserName("");
      }
      setLoaded(true);
    }

    readUser();
    window.addEventListener("storage", readUser);
    return () => window.removeEventListener("storage", readUser);
  }, []);

  function logout() {
    localStorage.removeItem("celebra.auth.token");
    localStorage.removeItem("celebra.auth.user");
    localStorage.removeItem("celebra.auth.accounts");
    window.location.assign("/");
  }

  if (!loaded) return <span className="account-actions-placeholder" aria-hidden="true"/>;

  if (!userName) {
    return <Link href="/entrar" className="btn btn-light account-login">Entrar</Link>;
  }

  return (
    <div className="account-actions">
      <span className="account-welcome">Bem-vindo, <strong>{userName}</strong></span>
      {showDashboardLink && <Link href="/painel" className="btn btn-light account-dashboard">Meu painel</Link>}
      <button type="button" className="btn btn-light account-logout" onClick={logout}>
        <LogOut size={16}/> Sair
      </button>
    </div>
  );
}
