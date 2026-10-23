import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/tailgrids/core/input";
import { Label } from "../components/tailgrids/core/label";
import { Button } from "../components/tailgrids/core/button";
import { Link } from "react-router-dom";

const Signup = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed.");
      }
      setUser(data);
      navigate("/user");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <>
      <section>
        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col gap-4 max-w-sm mx-auto my-10"
        >
          <h1 className="text-3xl">Sign up </h1>
          <Label htmlFor="email">Email</Label>
          <Input
            required
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={100}
            autoComplete="email"
          />

          <Label htmlFor="username">Username</Label>
          <Input
            required
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={100}
            autoComplete="username"
          />

          <Label htmlFor="password">Password</Label>
          <Input
            required
            type="password"
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            autoComplete="password"
          />

          {error && <p className="text-red-600">{error}</p>}

          <Button
            type="submit"
            className="bg-black text-white hover:bg-black/50 hover:text-white"
          >
            Sign up
          </Button>

          <Link to="/login">Have an account? Log In</Link>
          <Link className="text-3xl" to="/user">
            🔙
          </Link>
        </form>
      </section>
    </>
  );
};

export default Signup;
