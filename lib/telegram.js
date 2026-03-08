const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Send a message to the Telegram chat.
 * Uses HTML parse mode for formatting.
 * Fails silently — order should still succeed even if Telegram is down.
 */
export async function sendTelegram(text) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram not configured — skipping notification');
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Telegram send failed:', err);
    }
  } catch (error) {
    console.error('Telegram error:', error.message);
  }
}

/**
 * Build the Telegram message for a new order, including returning customer hints.
 */
export function buildOrderMessage(order, customer, items, returning, deliveryMethod) {
  const lines = [];
  const isPickup = deliveryMethod === 'pickup';

  lines.push(`🛒 <b>Comandă Nouă: #${order.orderNumber}</b>`);
  lines.push(isPickup ? '🏬 <b>PICK-UP din magazin</b>' : '🚚 <b>LIVRARE la adresă</b>');
  lines.push('');

  // Returning customer warnings
  if (returning.isReturning) {
    lines.push('⚠️ <b>CLIENT CUNOSCUT:</b>');
    if (returning.phoneOrders > 0) {
      lines.push(`  📱 Telefonul s-a mai folosit (${returning.phoneOrders} comenzi anterioare)`);
    }
    if (returning.nameOrders > 0) {
      lines.push(`  👤 Numele se repetă (${returning.nameOrders} comenzi anterioare)`);
    }
    if (returning.addressOrders > 0) {
      lines.push(`  📍 Adresa se repetă (${returning.addressOrders} comenzi anterioare)`);
    }
    lines.push(`  📦 Total comenzi anterioare: ${returning.totalPreviousOrders}`);
    lines.push('');
  }

  // Customer info
  lines.push(`👤 <b>${customer.nume} ${customer.prenume}</b>`);
  lines.push(`📱 ${customer.telefon}`);
  if (customer.email) lines.push(`📧 ${customer.email}`);
  lines.push('');

  // Delivery
  if (customer.adresa) {
    lines.push(`📍 ${customer.adresa}, ${customer.oras}`);
  } else {
    lines.push('📍 Ridicare din magazin');
  }
  lines.push('');

  // Items
  lines.push('<b>Produse:</b>');
  items.forEach((item) => {
    lines.push(`  • ${item.name} (${item.color || '-'} / ${item.size || '-'}) ×${item.quantity} — ${item.price * item.quantity} MDL`);
  });
  lines.push('');

  // Totals
  if (order.shippingCost > 0) {
    lines.push(`🚚 Livrare: ${order.shippingCost} MDL`);
  }
  lines.push(`💰 <b>Total: ${order.total} MDL</b>`);

  // Notes
  if (order.customerNote) {
    lines.push('');
    lines.push(`📝 <i>${order.customerNote}</i>`);
  }

  return lines.join('\n');
}
