export type Role = "transporter" | "business" | "admin";

export type Truck = {
  id: string;
  regNumber: string;
  vehicleType: string;
  capacityTons: number;
  currentLocation: string;
  driverName: string;
  driverMobile: string;
  docs: { rc: boolean; insurance: boolean; puc: boolean };
  status: "On Trip" | "Idle" | "Maintenance";
};

export type EmptyReturnPrediction = {
  id: string;
  truckId: string;
  outbound: string;
  returnLeg: string;
  capacityTons: number;
  emptyProbability: number;
  freeFrom: string;
};

export type Shipment = {
  id: string;
  pickup: string;
  delivery: string;
  cargoType: string;
  weightTons: number;
  packages: number;
  vehicleType: string;
  pickupAt: string;
  deadline: string;
  budget: number;
  business: string;
  gstVerified: boolean;
  rating: number;
  matchScore: number;
  distanceToPickupKm: number;
  status: "Open" | "Confirmed" | "Picked Up" | "In Transit" | "Delivered";
};

export type Transporter = {
  id: string;
  company: string;
  owner: string;
  gst: string;
  pan: string;
  city: string;
  fleetSize: number;
  deliveries: number;
  rating: number;
  verified: boolean;
  trusted: boolean;
  vehicleTypes: string[];
  priceQuote: number;
  capacityTons: number;
};

export type Business = {
  id: string;
  company: string;
  gst: string;
  industry: string;
  city: string;
  shipments: number;
  rating: number;
  paymentReliability: number;
  verified: boolean;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export const trucks: Truck[] = [
  {
    id: "TRK-01",
    regNumber: "MH12 AB 4521",
    vehicleType: "32ft Multi-Axle",
    capacityTons: 15,
    currentLocation: "Pune, MH",
    driverName: "Ramesh Pawar",
    driverMobile: "+91 98XXXXXX21",
    docs: { rc: true, insurance: true, puc: true },
    status: "On Trip",
  },
  {
    id: "TRK-02",
    regNumber: "MH14 CJ 7788",
    vehicleType: "19ft Container",
    capacityTons: 9,
    currentLocation: "Mumbai, MH",
    driverName: "Sandeep Yadav",
    driverMobile: "+91 99XXXXXX09",
    docs: { rc: true, insurance: true, puc: false },
    status: "Idle",
  },
  {
    id: "TRK-03",
    regNumber: "GJ01 KL 3390",
    vehicleType: "Open Body 14ft",
    capacityTons: 6,
    currentLocation: "Surat, GJ",
    driverName: "Iqbal Shaikh",
    driverMobile: "+91 97XXXXXX40",
    docs: { rc: true, insurance: false, puc: true },
    status: "On Trip",
  },
  {
    id: "TRK-04",
    regNumber: "KA05 MN 1201",
    vehicleType: "Tata Ace",
    capacityTons: 1.5,
    currentLocation: "Bengaluru, KA",
    driverName: "Vinod Kumar",
    driverMobile: "+91 96XXXXXX77",
    docs: { rc: true, insurance: true, puc: true },
    status: "Idle",
  },
];

export const predictions: EmptyReturnPrediction[] = [
  {
    id: "PRD-1",
    truckId: "TRK-01",
    outbound: "Pune → Mumbai",
    returnLeg: "Mumbai → Pune",
    capacityTons: 5,
    emptyProbability: 87,
    freeFrom: "Today, 4:30 PM",
  },
  {
    id: "PRD-2",
    truckId: "TRK-03",
    outbound: "Surat → Ahmedabad",
    returnLeg: "Ahmedabad → Surat",
    capacityTons: 4,
    emptyProbability: 74,
    freeFrom: "Tomorrow, 9:00 AM",
  },
  {
    id: "PRD-3",
    truckId: "TRK-02",
    outbound: "Mumbai → Nashik",
    returnLeg: "Nashik → Mumbai",
    capacityTons: 7,
    emptyProbability: 62,
    freeFrom: "Fri, 11:00 AM",
  },
];

export const openLoads: Shipment[] = [
  {
    id: "SHP-2481",
    pickup: "Mumbai, MH",
    delivery: "Pune, MH",
    cargoType: "Machine Parts",
    weightTons: 2,
    packages: 14,
    vehicleType: "32ft Multi-Axle",
    pickupAt: "Today, 6:00 PM",
    deadline: "Tomorrow, 10:00 AM",
    budget: 4500,
    business: "ABC Manufacturing",
    gstVerified: true,
    rating: 4.8,
    matchScore: 96,
    distanceToPickupKm: 6,
    status: "Open",
  },
  {
    id: "SHP-2492",
    pickup: "Bhiwandi, MH",
    delivery: "Pune, MH",
    cargoType: "FMCG Cartons",
    weightTons: 3.5,
    packages: 210,
    vehicleType: "32ft Multi-Axle",
    pickupAt: "Today, 8:30 PM",
    deadline: "Tomorrow, 2:00 PM",
    budget: 5200,
    business: "Shreeji Distributors",
    gstVerified: true,
    rating: 4.5,
    matchScore: 88,
    distanceToPickupKm: 21,
    status: "Open",
  },
  {
    id: "SHP-2503",
    pickup: "Navi Mumbai, MH",
    delivery: "Chakan, MH",
    cargoType: "Auto Components",
    weightTons: 4.2,
    packages: 32,
    vehicleType: "19ft Container",
    pickupAt: "Tomorrow, 7:00 AM",
    deadline: "Tomorrow, 6:00 PM",
    budget: 6100,
    business: "Kinetic Auto Systems",
    gstVerified: true,
    rating: 4.2,
    matchScore: 79,
    distanceToPickupKm: 34,
    status: "Open",
  },
  {
    id: "SHP-2517",
    pickup: "Ahmedabad, GJ",
    delivery: "Surat, GJ",
    cargoType: "Textile Rolls",
    weightTons: 3.8,
    packages: 96,
    vehicleType: "Open Body 14ft",
    pickupAt: "Tomorrow, 10:00 AM",
    deadline: "Tomorrow, 9:00 PM",
    budget: 3900,
    business: "Vraj Textiles",
    gstVerified: false,
    rating: 3.9,
    matchScore: 71,
    distanceToPickupKm: 12,
    status: "Open",
  },
];

export const transporters: Transporter[] = [
  {
    id: "TR-001",
    company: "Shivneri Roadlines Pvt Ltd",
    owner: "Mahesh Deshmukh",
    gst: "27AABCS1429R1ZP",
    pan: "AABCS1429R",
    city: "Pune, Maharashtra",
    fleetSize: 24,
    deliveries: 1284,
    rating: 4.8,
    verified: true,
    trusted: true,
    vehicleTypes: ["32ft Multi-Axle", "19ft Container", "Tata Ace"],
    priceQuote: 4500,
    capacityTons: 15,
  },
  {
    id: "TR-002",
    company: "Konkan Cargo Movers",
    owner: "Prashant Sawant",
    gst: "27AACCK8821L1Z4",
    pan: "AACCK8821L",
    city: "Mumbai, Maharashtra",
    fleetSize: 12,
    deliveries: 642,
    rating: 4.5,
    verified: true,
    trusted: false,
    vehicleTypes: ["19ft Container", "Open Body 14ft"],
    priceQuote: 4850,
    capacityTons: 9,
  },
  {
    id: "TR-003",
    company: "Gujarat Freight Lines",
    owner: "Nikunj Patel",
    gst: "24AAGCG4410M1ZK",
    pan: "AAGCG4410M",
    city: "Surat, Gujarat",
    fleetSize: 31,
    deliveries: 1930,
    rating: 4.6,
    verified: true,
    trusted: true,
    vehicleTypes: ["32ft Multi-Axle", "Trailer", "Open Body 14ft"],
    priceQuote: 5100,
    capacityTons: 21,
  },
];

export const businesses: Business[] = [
  {
    id: "BZ-001",
    company: "ABC Manufacturing Pvt Ltd",
    gst: "27AAACA1234F1Z5",
    industry: "Industrial Machinery",
    city: "Mumbai, Maharashtra",
    shipments: 412,
    rating: 4.8,
    paymentReliability: 98,
    verified: true,
  },
  {
    id: "BZ-002",
    company: "Shreeji Distributors",
    gst: "27AAECS7781H1ZB",
    industry: "FMCG Distribution",
    city: "Bhiwandi, Maharashtra",
    shipments: 268,
    rating: 4.5,
    paymentReliability: 94,
    verified: true,
  },
  {
    id: "BZ-003",
    company: "Kinetic Auto Systems",
    gst: "27AADCK3390P1ZQ",
    industry: "Automotive Components",
    city: "Navi Mumbai, Maharashtra",
    shipments: 155,
    rating: 4.2,
    paymentReliability: 89,
    verified: true,
  },
];

export const reviews: Review[] = [
  {
    id: "RV-1",
    author: "ABC Manufacturing",
    rating: 5,
    text: "Backhaul truck reached the dock in 40 minutes. Delivered before deadline with clean POD.",
    date: "12 Aug 2026",
  },
  {
    id: "RV-2",
    author: "Shreeji Distributors",
    rating: 4,
    text: "Good communication from driver. Slight delay at Khopoli toll but ETA was updated live.",
    date: "04 Aug 2026",
  },
  {
    id: "RV-3",
    author: "Kinetic Auto Systems",
    rating: 5,
    text: "Rates far better than spot market because it was a return trip. Will book again.",
    date: "28 Jul 2026",
  },
];

export const revenueTrend = [
  { month: "Mar", base: 412000, backhaul: 48000 },
  { month: "Apr", base: 438000, backhaul: 71000 },
  { month: "May", base: 451000, backhaul: 96000 },
  { month: "Jun", base: 468000, backhaul: 124000 },
  { month: "Jul", base: 472000, backhaul: 158000 },
  { month: "Aug", base: 495000, backhaul: 191000 },
];

export const utilisationTrend = [
  { month: "Mar", utilisation: 61 },
  { month: "Apr", utilisation: 65 },
  { month: "May", utilisation: 70 },
  { month: "Jun", utilisation: 74 },
  { month: "Jul", utilisation: 79 },
  { month: "Aug", utilisation: 84 },
];

export const lanesSplit = [
  { name: "Mumbai–Pune", value: 38 },
  { name: "Surat–Ahmedabad", value: 24 },
  { name: "Bengaluru–Hosur", value: 21 },
  { name: "Delhi–Jaipur", value: 17 },
];

export const vehicleTypes = [
  "Tata Ace",
  "Open Body 14ft",
  "19ft Container",
  "32ft Multi-Axle",
  "Trailer",
  "Refrigerated",
];

export const businessTypes = [
  "Proprietorship",
  "Partnership",
  "Private Limited",
  "LLP",
  "Public Limited",
];

export const trackingStages = ["Confirmed", "Picked Up", "In Transit", "Delivered"] as const;

export function mask(value: string, visible = 4) {
  if (!value) return "";
  const tail = value.slice(-visible);
  return `${"X".repeat(Math.max(value.length - visible, 0))}${tail}`;
}

export function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}
