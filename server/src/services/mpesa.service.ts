import axios from "axios";

const BASE_URL = process.env.MPESA_BASE_URL ?? "https://sandbox.safaricom.co.ke";

interface AccessTokenResponse {
  access_token: string;
  expires_in: string;
}

export interface StkPushResult {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

function formatTimestamp(date: Date): string {
  const pad = (n: number): string => n.toString().padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;

  return digits;
}

async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa consumer key/secret are not configured");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const { data } = await axios.get<AccessTokenResponse>(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } },
  );

  return data.access_token;
}

export async function stkPush(
  phone: string,
  amount: number,
  accountReference: string,
  transactionDesc: string,
): Promise<StkPushResult> {
  const till = process.env.MPESA_TILL;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!till || !passkey || !callbackUrl) {
    throw new Error("M-Pesa till/passkey/callback URL are not configured");
  }

  const accessToken = await getAccessToken();
  const timestamp = formatTimestamp(new Date());
  const password = Buffer.from(`${till}${passkey}${timestamp}`).toString("base64");
  const partyPhone = normalizePhone(phone);

  const { data } = await axios.post<StkPushResult>(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: till,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: Math.round(amount),
      PartyA: partyPhone,
      PartyB: till,
      PhoneNumber: partyPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return data;
}
