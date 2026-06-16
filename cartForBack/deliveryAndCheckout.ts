/// <reference types="node" />
import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

type NovaPoshtaCity = {
  Ref: string;
  Description: string;
};

type NovaPoshtaWarehouse = {
  Ref: string;
  Description: string;
};

type NovaPoshtaResponse<T> = {
  success: boolean;
  data: T[];
};

router.get('/api/delivery/cities', async (req, res) => {
  try {
    const { search } = req.query;
    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: process.env.NOVAPOSHTA_API_KEY,
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
          FindByString: search,
          Limit: '10',
        },
      }),
    });
    const result =
      (await response.json()) as NovaPoshtaResponse<NovaPoshtaCity>;

    if (!result.success) return res.status(400).json([]);

    const formatted = result.data.map((city: NovaPoshtaCity) => ({
      ref: city.Ref,
      name: city.Description,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Nova Poshta Cities Error:', err);
    res.status(500).json([]);
  }
});

router.get('/api/delivery/warehouses', async (req, res) => {
  try {
    const { cityRef, type } = req.query;
    const typeRef =
      type === 'poshtomat' ?
        'f9b8c635-9274-11e7-af0f-005056b24376'
      : '9a44d07d-f8c2-11e3-baf0-005056b24376';

    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: process.env.NOVAPOSHTA_API_KEY,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef,
          TypeOfWarehouseRef: typeRef,
          Limit: '500',
        },
      }),
    });
    const result =
      (await response.json()) as NovaPoshtaResponse<NovaPoshtaWarehouse>;

    if (!result.success) return res.status(400).json([]);

    const formatted = result.data.map((wh: NovaPoshtaWarehouse) => ({
      ref: wh.Ref,
      name: wh.Description,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Nova Poshta Warehouses Error:', err);
    res.status(500).json([]);
  }
});

router.post('/api/orders/checkout', async (req, res) => {
  try {
    const { total } = req.body;
    const privateKey = process.env.LIQPAY_PRIVATE_KEY;
    const publicKey = process.env.LIQPAY_PUBLIC_KEY;

    const jsonString = {
      public_key: publicKey,
      version: '3',
      action: 'pay',
      amount: total,
      currency: 'UAH',
      description: 'Книжковий інтернет-магазин. Оплата замовлення.',
      order_id: `book_order_${Date.now()}`,
      sandbox: '1',
      result_url:
        process.env.SITE_URL ?
          `${process.env.SITE_URL}/order-success`
        : 'http://localhost:3000/order-success',
    };

    const data = Buffer.from(JSON.stringify(jsonString)).toString('base64');
    const signature = crypto
      .createHash('sha1')
      .update((privateKey || '') + data + (privateKey || ''))
      .digest('base64');

    res.json({ data, signature });
  } catch (err) {
    console.error('LiqPay Checkout Error:', err);
    res.status(500).json({ error: 'Failed to initiate checkout' });
  }
});

export default router;
