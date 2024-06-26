// server.js
const express = require("express");
const { fyersModel } = require("fyers-api-v3");
const fs = require("fs");
const cors = require('cors');
require("dotenv").config();

// Create the logs directory if it doesn't exist
const logsDir = "./logs";
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a new instance of fyersModel with logging enabled
const fyers = new fyersModel({ path: logsDir, enableLogging: true });

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());
const corsOptions = {
  origin: 'https://fyers-demo.netlify.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// Set your APPID and RedirectURL from environment variables
const APPID = process.env.FYERS_APPID;
const SECRET_KEY = process.env.FYERS_SECRET_KEY;
const REDIRECT_URI = process.env.FYERS_REDIRECT_URI;

fyers.setAppId(APPID);
fyers.setRedirectUrl(REDIRECT_URI);

// API to generate auth code URL
app.get("/api/fyers", (req, res) => {
  const authCodeURL = fyers.generateAuthCode();
  res.json({ authCodeURL });
});

// API to generate access token
app.post("/generateAccessToken", async (req, res) => {
  const uri = req.body.uri;

  if (!uri) {
    return res
      .status(400)
      .json({ error: "URI is required in the request body" });
  }

  const urlParams = new URLSearchParams(uri);
  const authCode = urlParams.get("auth_code");

  if (!authCode) {
    return res.status(400).json({ error: "Auth code not found in URI" });
  }

  console.log(authCode);

  try {
    const response = await fyers.generate_access_token({
      client_id: APPID,
      secret_key: SECRET_KEY,
      auth_code: authCode,
    });

    if (response.s === "ok") {
      fyers.setAccessToken(response.access_token);
      res.json({ accessToken: response.access_token });
    } else {
      res.status(400).json({ error: response });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch profile details
app.get("/fetchProfile", async (req, res) => {
  try {
    const response = await fyers.get_profile();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch funds
app.get("/fetchFunds", async (req, res) => {
  try {
    const response = await fyers.get_funds();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch holdings
app.get("/fetchHoldings", async (req, res) => {
  try {
    const response = await fyers.get_holdings();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch positions
app.get("/fetchPositions", async (req, res) => {
  try {
    const response = await fyers.get_positions();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch trades
app.get("/fetchTrades", async (req, res) => {
  try {
    const response = await fyers.get_tradebook();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to place a single order with proper validations
app.post("/placeOrder", async (req, res) => {
  const orderDetails = req.body;

  // Validate required fields
  const requiredFields = [
    "symbol",
    "qty",
    "type",
    "side",
    "productType",
    "limitPrice",
    "stopPrice",
    "disclosedQty",
    "validity",
    "offlineOrder",
    "stopLoss",
    "takeProfit",
    "orderTag",
  ];
  for (const field of requiredFields) {
    if (!orderDetails.hasOwnProperty(field)) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  // Validate field types and values
  if (typeof orderDetails.symbol !== "string") {
    return res.status(400).json({ error: "symbol must be a string" });
  }

  if (typeof orderDetails.qty !== "number" || orderDetails.qty <= 0) {
    return res.status(400).json({ error: "qty must be a positive number" });
  }

  if (![1, 2, 3, 4].includes(orderDetails.type)) {
    return res.status(400).json({ error: "type must be one of 1, 2, 3, 4" });
  }

  if (![1, -1].includes(orderDetails.side)) {
    return res.status(400).json({ error: "side must be one of 1, -1" });
  }

  const validProductTypes = ["CNC", "INTRADAY", "MARGIN", "CO", "BO"];
  if (!validProductTypes.includes(orderDetails.productType)) {
    return res.status(400).json({
      error: `productType must be one of ${validProductTypes.join(", ")}`,
    });
  }

  if (
    typeof orderDetails.limitPrice !== "number" ||
    orderDetails.limitPrice < 0
  ) {
    return res
      .status(400)
      .json({ error: "limitPrice must be a non-negative number" });
  }

  if (
    typeof orderDetails.stopPrice !== "number" ||
    orderDetails.stopPrice < 0
  ) {
    return res
      .status(400)
      .json({ error: "stopPrice must be a non-negative number" });
  }

  if (
    typeof orderDetails.disclosedQty !== "number" ||
    orderDetails.disclosedQty < 0
  ) {
    return res
      .status(400)
      .json({ error: "disclosedQty must be a non-negative number" });
  }

  if (!["DAY", "IOC"].includes(orderDetails.validity)) {
    return res.status(400).json({ error: "validity must be one of DAY, IOC" });
  }

  if (typeof orderDetails.offlineOrder !== "boolean") {
    return res.status(400).json({ error: "offlineOrder must be a boolean" });
  }

  if (typeof orderDetails.stopLoss !== "number" || orderDetails.stopLoss < 0) {
    return res
      .status(400)
      .json({ error: "stopLoss must be a non-negative number" });
  }

  if (
    typeof orderDetails.takeProfit !== "number" ||
    orderDetails.takeProfit < 0
  ) {
    return res
      .status(400)
      .json({ error: "takeProfit must be a non-negative number" });
  }

  if (typeof orderDetails.orderTag !== "string") {
    return res.status(400).json({ error: "orderTag must be a string" });
  }

  try {
    const response = await fyers.place_order(orderDetails);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to place multiple orders with proper validations
app.post("/placeMultipleOrders", async (req, res) => {
  const ordersDetails = req.body;

  // Check if ordersDetails is an array
  if (!Array.isArray(ordersDetails)) {
    return res
      .status(400)
      .json({ error: "Request body must be an array of order details" });
  }

  // Validate each order in the array
  for (let i = 0; i < ordersDetails.length; i++) {
    const order = ordersDetails[i];
    const requiredFields = [
      "symbol",
      "qty",
      "type",
      "side",
      "productType",
      "limitPrice",
      "stopPrice",
      "disclosedQty",
      "validity",
      "offlineOrder",
      "stopLoss",
      "takeProfit",
    ];
    for (const field of requiredFields) {
      if (!order.hasOwnProperty(field)) {
        return res
          .status(400)
          .json({ error: `${field} is required for order at index ${i}` });
      }
    }

    // Validate field types and values
    if (typeof order.symbol !== "string") {
      return res
        .status(400)
        .json({ error: `symbol for order at index ${i} must be a string` });
    }

    if (typeof order.qty !== "number" || order.qty <= 0) {
      return res.status(400).json({
        error: `qty for order at index ${i} must be a positive number`,
      });
    }

    if (![1, 2, 3, 4].includes(order.type)) {
      return res.status(400).json({
        error: `type for order at index ${i} must be one of 1, 2, 3, 4`,
      });
    }

    if (![1, -1].includes(order.side)) {
      return res
        .status(400)
        .json({ error: `side for order at index ${i} must be one of 1, -1` });
    }

    const validProductTypes = ["CNC", "INTRADAY", "MARGIN", "CO", "BO"];
    if (!validProductTypes.includes(order.productType)) {
      return res.status(400).json({
        error: `productType for order at index ${i} must be one of ${validProductTypes.join(
          ", "
        )}`,
      });
    }

    if (typeof order.limitPrice !== "number" || order.limitPrice < 0) {
      return res.status(400).json({
        error: `limitPrice for order at index ${i} must be a non-negative number`,
      });
    }

    if (typeof order.stopPrice !== "number" || order.stopPrice < 0) {
      return res.status(400).json({
        error: `stopPrice for order at index ${i} must be a non-negative number`,
      });
    }

    if (typeof order.disclosedQty !== "number" || order.disclosedQty < 0) {
      return res.status(400).json({
        error: `disclosedQty for order at index ${i} must be a non-negative number`,
      });
    }

    if (!["DAY", "IOC"].includes(order.validity)) {
      return res.status(400).json({
        error: `validity for order at index ${i} must be one of DAY, IOC`,
      });
    }

    if (typeof order.offlineOrder !== "boolean") {
      return res.status(400).json({
        error: `offlineOrder for order at index ${i} must be a boolean`,
      });
    }

    if (typeof order.stopLoss !== "number" || order.stopLoss < 0) {
      return res.status(400).json({
        error: `stopLoss for order at index ${i} must be a non-negative number`,
      });
    }

    if (typeof order.takeProfit !== "number" || order.takeProfit < 0) {
      return res.status(400).json({
        error: `takeProfit for order at index ${i} must be a non-negative number`,
      });
    }
  }

  try {
    const response = await fyers.place_multi_order(ordersDetails);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch orders
app.get("/getOrders", async (req, res) => {
  try {
    const response = await fyers.get_orders();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch order by id
app.post("/getOrderById", async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  try {
    const response = await fyers.get_filtered_orders({ order_id });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to modify order
app.post("/modifyOrder", async (req, res) => {
  const { id, qty, type, side, limitPrice, stopPrice, offlineOrder } = req.body;

  // Validation
  if (
    !id ||
    !qty ||
    !type ||
    !side ||
    !limitPrice ||
    !stopPrice ||
    typeof offlineOrder !== "boolean"
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const validOrderTypes = [1, 2, 3, 4];

  if (!validOrderTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid order type." });
  }

  const orderData = {
    id,
    qty,
    type,
    side,
    limitPrice,
    stopPrice,
    offlineOrder,
  };

  try {
    const response = await fyers.modify_order(orderData);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to modify multiple order
app.post("/modifyMultipleOrders", async (req, res) => {
  const orders = req.body;

  // Validation
  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Orders array is required." });
  }

  const validOrderTypes = [1, 2, 3, 4];

  for (let order of orders) {
    const { id, qty, type, side, limitPrice, stopPrice, offlineOrder } = order;

    if (
      !id ||
      !qty ||
      !type ||
      !side ||
      !limitPrice ||
      !stopPrice ||
      typeof offlineOrder !== "boolean"
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required in each order." });
    }

    if (!validOrderTypes.includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid order type in one of the orders." });
    }
  }

  try {
    const response = await fyers.modify_multi_order(orders);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel a single order
app.post("/cancelOrder", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  try {
    const response = await fyers.cancel_order({ id });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel multiple orders
app.post("/cancelMultipleOrders", async (req, res) => {
  const orders = req.body;

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Orders array is required." });
  }

  for (let order of orders) {
    if (!order.id) {
      return res.status(400).json({ error: "Each order must have an ID." });
    }
  }

  try {
    const response = await fyers.cancel_multi_order(orders);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exit positions
app.post("/exitPositions", async (req, res) => {
  const { exit_all } = req.body;

  if (exit_all !== 1) {
    return res
      .status(400)
      .json({ error: "'exit_all' must be 1 to exit all positions." });
  }

  try {
    const response = await fyers.exit_position({ exit_all });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate productType values
const validProductTypes = ["INTRADAY", "CNC", "CO", "BO", "MARGIN", "ALL"];

// Exit positions by segment, side, and product type
app.post("/exitPositionsByFilter", async (req, res) => {
  const { segment, side, productType } = req.body;

  if (!segment || !Array.isArray(segment) || segment.length === 0) {
    return res
      .status(400)
      .json({ error: "Segment is required and must be an array." });
  }

  if (!side || !Array.isArray(side) || side.length === 0) {
    return res
      .status(400)
      .json({ error: "Side is required and must be an array." });
  }

  if (!productType || !Array.isArray(productType) || productType.length === 0) {
    return res
      .status(400)
      .json({ error: "Product type is required and must be an array." });
  }

  // Validate productType values
  const invalidProductTypes = productType.filter(
    (type) => !validProductTypes.includes(type)
  );
  if (invalidProductTypes.length > 0) {
    return res.status(400).json({
      error: `Invalid product types: ${invalidProductTypes.join(", ")}`,
    });
  }

  try {
    const response = await fyers.exit_position({
      segment,
      side,
      productType,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert position API
app.post("/convertPosition", async (req, res) => {
  const {
    symbol,
    positionSide,
    convertQty,
    convertFrom,
    convertTo,
    overnight,
  } = req.body;

  if (!symbol || typeof symbol !== "string") {
    return res
      .status(400)
      .json({ error: "Symbol is required and must be a string." });
  }

  if (typeof positionSide !== "number" || ![1, -1].includes(positionSide)) {
    return res
      .status(400)
      .json({ error: "Position side must be either 1 or -1." });
  }

  if (typeof convertQty !== "number" || convertQty <= 0) {
    return res
      .status(400)
      .json({ error: "Convert quantity must be a positive number." });
  }

  const validProductTypes = ["INTRADAY", "CNC", "CO", "BO", "MARGIN"];
  if (
    !validProductTypes.includes(convertFrom) ||
    !validProductTypes.includes(convertTo)
  ) {
    return res.status(400).json({
      error:
        "Convert from and convert to must be one of: INTRADAY, CNC, CO, BO, MARGIN.",
    });
  }

  if (typeof overnight !== "number" || ![0, 1].includes(overnight)) {
    return res.status(400).json({ error: "Overnight must be either 0 or 1." });
  }

  try {
    const response = await fyers.convert_position({
      symbol,
      positionSide,
      convertQty,
      convertFrom,
      convertTo,
      overnight,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get market status
app.get("/marketStatus", async (req, res) => {
  try {
    const response = await fyers.market_status();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to validate symbol format
function isValidSymbol(symbol) {
  const symbolRegex = /^[A-Z]+:[A-Z0-9\-_]+$/;
  return symbolRegex.test(symbol);
}

// Function to validate resolution format
function isValidResolution(resolution) {
  const validResolutions = [
    "D",
    "1D",
    "5S",
    "10S",
    "15S",
    "30S",
    "45S",
    "1",
    "2",
    "3",
    "5",
    "10",
    "15",
    "20",
    "30",
    "60",
    "120",
    "240",
  ];
  return validResolutions.includes(resolution);
}

// Function to validate date format and value
function isValidDate(dateStr, dateFormat) {
  if (dateFormat === "0") {
    return !isNaN(Date.parse(dateStr));
  } else if (dateFormat === "1") {
    return moment(dateStr, "YYYY-MM-DD", true).isValid();
  }
  return false;
}

// Function to validate cont_flag
function isValidContFlag(contFlag) {
  return contFlag === "0" || contFlag === "1";
}

// API Endpoint for Historical Data
app.post("/historical-data", async (req, res) => {
  const { symbol, resolution, date_format, range_from, range_to, cont_flag } =
    req.body;

  // Validate inputs
  if (!isValidSymbol(symbol)) {
    return res.status(400).json({
      error: "Invalid symbol format. Expected EXCHANGE:SYMBOL-TYPE format.",
    });
  }
  if (!isValidResolution(resolution)) {
    return res.status(400).json({
      error: "Invalid resolution. Allowed values are D, 1D, 5S, 10S, ..., 240.",
    });
  }
  if (!isValidDate(range_from, date_format)) {
    return res
      .status(400)
      .json({ error: "Invalid range_from date format or value." });
  }
  if (!isValidDate(range_to, date_format)) {
    return res
      .status(400)
      .json({ error: "Invalid range_to date format or value." });
  }
  if (!isValidContFlag(cont_flag)) {
    return res
      .status(400)
      .json({ error: "Invalid cont_flag value. Expected '0' or '1'." });
  }

  const inp = {
    symbol: symbol,
    resolution: resolution,
    date_format: date_format,
    range_from: range_from,
    range_to: range_to,
    cont_flag: cont_flag,
  };

  try {
    const response = await fyers.getHistory(inp);
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch historical data: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
