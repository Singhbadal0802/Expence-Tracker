export const fetchUserData = async( url :string, email : string, name? : string) => {
  if(!url || !email) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name }),
  });

  const userData = await response.json() ?? {};
  return userData;
};
