import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Terminal, LogOut, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/achievements", label: "Achievements" },
  { href: "/members", label: "Members" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="ZeroDay Squad logo"
                className="w-9 h-9 object-contain group-hover:animate-pulse-glow transition-all duration-300"
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-display text-lg font-bold text-primary cyber-text-glow">
              ZeroDay<span className="text-secondary">Squad</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-mono uppercase tracking-wider transition-all duration-300 relative",
                  location.pathname === link.href
                    ? "text-primary cyber-text-glow"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary cyber-glow" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={getDashboardLink()}>
                  <Button variant="outline" size="sm">
                    {role === "admin" ? (
                      <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                    ) : (
                      <User className="w-4 h-4 mr-2" />
                    )}
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <Terminal className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary/20 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-mono uppercase tracking-wider transition-all duration-300",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10 cyber-border"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                    <Button variant="cyber" className="w-full mt-2">
                      {role === "admin" ? (
                        <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                      ) : (
                        <User className="w-4 h-4 mr-2" />
                      )}
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full mt-2" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="cyber" className="w-full mt-2">
                    <Terminal className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
