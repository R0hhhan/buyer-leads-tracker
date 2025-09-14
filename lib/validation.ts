import {z} from "zod"

export const buyerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Invalid email")
      .or(z.literal(""))
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
    city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
    propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]),
    bhk: z.enum(["1", "2", "3", "4", "Studio"]).optional(),
    purpose: z.enum(["Buy", "Rent"]),
    budgetMin: z
      .preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number().min(0).optional()
      )
      .optional(),
    budgetMax: z
      .preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number().min(0).optional()
      )
      .optional(),
    timeline: z.enum(["0-3m", "3-6m", ">6m", "Exploring"]),
    source: z.enum(["Website", "Referral", "Walk-in", "Call", "Other"]),
    notes: z.string().max(1000, "Max 1000 chars").optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional().default([]),
  })
  .refine(
    (data) =>
      !(
        ["Apartment", "Villa"].includes(data.propertyType) && !data.bhk
      ),
    { message: "BHK is required for Apartment/Villa", path: ["bhk"] }
  )
  .refine(
    (data) =>
      !(data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin),
    { message: "Max budget must be greater than min budget", path: ["budgetMax"] }
  );