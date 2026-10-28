import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Button } from '../components/tailgrids/core/button';
import { Input } from '../components/tailgrids/core/input';
import { Label } from '../components/tailgrids/core/label';

const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/account/password", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ 
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword, })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Password changes failed.");
            }
            setSuccess(data.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            navigate("/account");
        } catch (err) {
            setError(err.message);
        }
    }



  return (
    <>
        <section className="max-w-2xl mx-auto my-12 px-4">
            {/* Back link + header */}
            <Link
                to="/account"
                className="text-sm text-gray-500 hover:text-black transition"
            >
                ← Back to account settings
            </Link>

            <div className="mt-4 mb-8">
                <h1 className="text-3xl font-semibold tracking-tight">Account Settings for Password</h1>
                <p className="text-sm text-gray-500 mt-1">
                Change password
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="p-6 border-gray-200">
                    <Label htmlFor="currentPassword" className="text-base font-semibold">
                    Current Password 
                    </Label>
                    
                    <Input
                    required
                    id="currentPassword"
                    type="text"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="currentPassword"
                    className=""
                    />
                </div>

                <div className="p-6">
                    <Label htmlFor="newPassword" className="text-base font-semibold">
                    New Password
                    </Label>
                    <Input
                    required
                    id="newPassword"
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="newPassword"
                    className=""
                    />
                </div>

                <div className="p-6">
                    <Label htmlFor="confirmPassword" className="text-base font-semibold">
                    Confirm New Password
                    </Label>
                    <Input
                    required
                    id="confirmPassword"
                    type="text"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="confirmPassword"
                    className=""
                    />
                </div>

                <div className="flex items-center justify-between gap-4 bg-gray-50 border-t border-gray-200 px-6 py-3">
                    <p className={`text-sm ${
                        error
                        ? "text-red-600"
                        : success
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                    {error || success || "Changes apply as soon as you save."}
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
  )
}

export default ChangePassword