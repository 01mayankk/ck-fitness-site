declare module "razorpay" {
  interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status?: string;
  }

  interface RazorpayOrderOptions {
    amount: number;
    currency: string;
    receipt?: string;
  }

  export default class Razorpay {
    constructor(options: { key_id: string; key_secret: string });

    orders: {
      create(options: RazorpayOrderOptions): Promise<RazorpayOrder>;
    };
  }
}
