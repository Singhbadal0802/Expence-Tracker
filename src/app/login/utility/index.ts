import constants from "@/utilities/constants";

export const fetchUserData = async( email : string ) => {
  const entriesUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOSTING_DOMAIN}${constants.NEW_TRANSACTION_API_URL}`;
  const response = await fetch(entriesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const userData = await response.json() ?? {};
  return userData;
};
