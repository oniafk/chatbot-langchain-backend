async function orderInfo() {
  const url = "https://chatbot-langchain-backend.onrender.com/orders";
  const response = await fetch(url);
  const data = await response.json();

  return data.orders;
}

export async function getInfo() {
  const orderInfoResult = await orderInfo();

  const fullUserInfo = {
    orderInfo: orderInfoResult,
  };

  let userInfoString = JSON.stringify(fullUserInfo);

  return userInfoString;
}
