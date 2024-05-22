async function checkUrl(url: string): Promise<boolean> {
  const response = await fetch(url, { method: "HEAD" });
  return response.ok;
}

async function orderInfo() {
  const url = "https://chatbot-langchain-backend.onrender.com/orders";

  const isUrlAvailable = await checkUrl(url);
  if (!isUrlAvailable) {
    throw new Error(`URL ${url} is not available`);
  }

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
