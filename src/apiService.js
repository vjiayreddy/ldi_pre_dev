export const getApiData = (urlPath, state, setIsDataLoading) => {
  fetch(urlPath)
    .then((res) => res.json())
    .then((data) => {
      state(data.data);
    })
    .catch((error) => {
      setIsDataLoading(true);
    });
};

export const postData = (urlPath, body) => {
  return fetch(urlPath, {
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

export const postApiData = (urlPath, body) => {
  return fetch(urlPath, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};
