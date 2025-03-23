import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import "../../index.css";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import Login from "@/lib/data/auth/Login";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useMutation({ mutationFn: Login });

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!password) return;

    login(
      {
        username: email,
        password,
      },
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  };
  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto mt-5">
      <Card className="bg-zinc-850">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Log in with email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  Log In
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/register"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
