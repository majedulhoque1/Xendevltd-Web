export function digitsOnly(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function waLink(phone: string): string {
  return `https://wa.me/${digitsOnly(phone)}`;
}

export function telLink(phone: string): string {
  return `tel:${digitsOnly(phone)}`;
}
