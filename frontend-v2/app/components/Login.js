"use client";

import { useRouter } from "next/navigation";
function Login() {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString(); // 10 minutos
      document.cookie = `auth-token=${data.tokens.access}; path=/; expires=${expires}`;
      document.cookie = `user=${JSON.stringify({
        email: data.user.email,
        username: data.user.username,
      })}; path=/; expires=${expires}`;

      router.push("/orders");
    } else {
      alert("Login failed");
    }
  };
  return (
    <div className="bg-white p-8 rounded shadow-md w-80">
      <h2 className="text-center text-2xl font-bold mb-4 text-[#3c3b54]">
        Bienvenido de nuevo
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded text-[#3c3b54]"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded text-[#3c3b54]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
