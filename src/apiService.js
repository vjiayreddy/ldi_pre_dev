export const getApiData = (urlPath, state, setIsDataLoading) => {
  setIsDataLoading(false);
  fetch(urlPath)
    .then((res) => res.json())
    .then((data) => {
      state(data.data);
      setIsDataLoading(true);
    })
    .catch((error) => {
      setIsDataLoading(false);
    });
};

export const postData = (urlPath, body) => {
  console.log("body", body);
  fetch(urlPath, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Successfully Saved");
    })
    .catch((error) => {});
};
