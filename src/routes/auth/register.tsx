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
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Register from "@/lib/data/auth/Register";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useMutation({ mutationFn: Register });

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!password) return;

    register(
      {
        name,
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
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                  Create Account
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/auth/login" className="underline underline-offset-4">
                  Log In
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterScreen;
