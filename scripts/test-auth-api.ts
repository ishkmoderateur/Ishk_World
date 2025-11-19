// Test authentication API directly
const testLogin = async () => {
  console.log("🧪 Testing Login API\n");
  
  const response = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: "superadmin@ishk.test",
      password: "test123",
      redirect: "false",
    }),
  });
  
  console.log("Status:", response.status);
  console.log("Headers:", Object.fromEntries(response.headers.entries()));
  const text = await response.text();
  console.log("Response:", text.substring(0, 500));
};

testLogin().catch(console.error);






