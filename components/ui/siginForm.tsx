"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";

type FormType = "signin" | "signup";

const SigninForm = ({ formType }: { formType: FormType }) => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      pushUser();
    }
  }, [session, router]);

  const pushUser = async () => {
    try {
      const response = await axios.put("/api/users/signup", session?.user);
      if (response.data === "Created New Account") {
        router.push("/setup-profile");
      } else {
        router.push("/home");
      }
    } catch (error) {
      if (!session?.user?.image) {
        router.push("/setup-profile");
      } else {
        router.push("/home");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formType === "signin" && userInput.email && userInput.password) {
      const { email, password } = userInput;
      const user = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!user?.url) toast.error("Email or password is incorrect");
    } else if (
      formType === "signup" &&
      userInput.name &&
      userInput.password &&
      userInput.email
    ) {
      try {
        const response = await axios.put("/api/users/signup", userInput);
        if (response.data === "Created New Account") {
          router.push("/signin");
        }
      } catch (error) {
        toast.error(
          `Account with email "${userInput.email}" already exists`
        );
      }
    } else {
      toast.error("Fill all details");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-2">
      <form
        className="flex flex-col items-center justify-center gap-4 p-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        {formType === "signup" && (
          <input
            type="text"
            className="min-w-0 rounded-lg border-2 border-darkGray bg-transparent p-2"
            placeholder="Full Name"
            value={userInput.name}
            onChange={(e) =>
              setUserInput((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
          />
        )}
        <input
          type="email"
          className="min-w-0 rounded-lg border-2 border-darkGray bg-transparent p-2"
          placeholder="Email"
          value={userInput.email}
          onChange={(e) =>
            setUserInput((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
        />
        <input
          type="password"
          className="min-w-0 rounded-lg border-2 border-darkGray bg-transparent p-2"
          placeholder="Password"
          value={userInput.password}
          onChange={(e) =>
            setUserInput((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
        <button
          type="submit"
          className="mt-4 rounded-lg bg-lightGray p-2 px-14 font-semibold dark:bg-darkGray md:w-full"
        >
          {formType === "signup" ? "Create Account" : "Sign in"}
        </button>
      </form>
      <p className="-my-3 text-xl font-semibold">or</p>
      <button
        className="flex items-center gap-2 rounded-md bg-extraLightGray p-2 font-bold shadow-xl dark:bg-lightTheme dark:text-darkTheme md:w-full"
        onClick={() => signIn("google")}
      >
        <FcGoogle />
        {formType === "signup" ? "Sign Up" : "Sign in"} with Google
      </button>
      <p>
        {formType === "signup"
          ? "Already have an account, "
          : "Don't have an Account , "}
        <a
          href={formType === "signup" ? "/signin" : "/signup"}
          className="text-blue-500 underline dark:text-blue-300"
        >
          {formType === "signup" ? "Sign in" : "sign up"}
        </a>
      </p>
    </div>
  );
};

export default SigninForm;
          
