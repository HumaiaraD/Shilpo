import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Label } from '../components/tailgrids/core/label';
import { Input } from '../components/tailgrids/core/input';
import { Button } from '../components/tailgrids/core/button';
import { Link } from 'react-router-dom';

const Account = ({ user, setUser }) => {
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Changes failed.");
      }
      setUser(data);
      navigate("/user");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
        <section className="max-w-2xl mx-auto my-12 px-4">
            {/* Back link + header */}
            <Link
                to="/user"
                className="text-sm text-gray-500 hover:text-black transition"
            >
                ← Back to dashboard
            </Link>

            <div className="mt-4 mb-8">
                <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                Manage your username and email address.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {/* Username */}
                <div className="p-6 border-b border-gray-200">
                    <Label htmlFor="username" className="text-base font-semibold">
                    Username
                    </Label>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                    This is your public display name on Shilpo.
                    </p>
                    <Input
                    required
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="max-w-sm"
                    />
                </div>

                {/* Email */}
                <div className="p-6">
                    <Label htmlFor="email" className="text-base font-semibold">
                    Email
                    </Label>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                    Used for login and account notifications.
                    </p>
                    <Input
                    required
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="max-w-sm"
                    />
                    
                </div>
                <Link
                        to="/changepassword"
                        className="text-sm md:text-lg m-6 text-green-400 hover:text-red-400 transition"
                    >
                        Change Password
                </Link>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 bg-gray-50 border-t border-gray-200 px-6 py-3">
                    <p
                    className={`text-sm ${error ? "text-red-600" : "text-gray-500"}`}
                    >
                    {error || "Changes apply as soon as you save."}
                    </p>
                    <Button
                    type="submit"
                    className="bg-black text-white hover:bg-black/80"
                    >
                    Save changes
                    </Button>
                </div>
                </div>
            </form>
        </section>
    </>
  );
};

export default Account;
