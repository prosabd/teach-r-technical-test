import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { verifyToken } from "@/utils/userInstance";
import { login } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle } from "@/components/ui/alert"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    if (verifyToken()) {
        navigate("/products");
        return;
    }
  }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            Cookies.set('token', response.token); // Store the token in a cookie
            navigate("/products"); // Redirect to dashboard after successful login
        } catch (error) {
            setErrorLogin("Invalid email or password");
        }
    };

  return (
    <div className="flex mt-20 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crud Login</CardTitle>
          <CardDescription>Enter your credentials to access CRUD actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="col-span-3" />
              </div>
            </div>
            {errorLogin != "" &&
                <Alert variant="destructive" className="mt-10">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="pt-1">{errorLogin}</AlertTitle>
                    </div>
                </Alert>
            }
            <CardFooter className="flex justify-center mt-8">
              <Button type="submit">Login</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
