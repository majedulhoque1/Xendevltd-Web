// Single source of truth for Xen's real contact details, verified against
// page 8 of the printed brochure (D:\ASSETS\Brochure Print-01-03-2026 (small).pdf).
// Every component that shows a phone/email/address should import from here
// rather than hardcoding its own copy — that's how the site ended up showing
// a fabricated Gulshan office and a placeholder phone number in the first place.

export const SITE_CONTACT = {
  phonePrimary: "01717-19 27 30",
  phonePrimaryTel: "+8801717192730",
  phoneSecondary: "01718-15 18 00",
  phoneSecondaryTel: "+8801718151800",
  phoneTertiary: "01750-11 40 75",
  phoneTertiaryTel: "+8801750114075",
  whatsapp: "https://wa.me/8801717192730",
  email: "XenDevLtd@gmail.com",
  addressLine1: "House 808, Road 11, Avenue 6",
  addressLine2: "DOHS Mirpur, Dhaka",
  facebook: "https://www.facebook.com/XenDevelopments",
} as const;
