export type StateInfo = { name: string; code: string; cities: string[] };

export const indiaStates: StateInfo[] = [
  { name: "Andhra Pradesh", code: "AP", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"] },
  { name: "Arunachal Pradesh", code: "AR", cities: ["Itanagar", "Naharlagun", "Pasighat"] },
  { name: "Assam", code: "AS", cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"] },
  { name: "Bihar", code: "BR", cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"] },
  { name: "Chhattisgarh", code: "CG", cities: ["Raipur", "Bhilai", "Bilaspur", "Korba"] },
  { name: "Goa", code: "GA", cities: ["Panaji", "Margao", "Vasco da Gama"] },
  { name: "Gujarat", code: "GJ", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"] },
  { name: "Haryana", code: "HR", cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"] },
  { name: "Himachal Pradesh", code: "HP", cities: ["Shimla", "Solan", "Baddi", "Mandi"] },
  { name: "Jharkhand", code: "JH", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"] },
  { name: "Karnataka", code: "KA", cities: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Hosur"] },
  { name: "Kerala", code: "KL", cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"] },
  { name: "Madhya Pradesh", code: "MP", cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"] },
  { name: "Maharashtra", code: "MH", cities: ["Mumbai", "Navi Mumbai", "Bhiwandi", "Pune", "Chakan", "Nashik", "Nagpur", "Aurangabad", "Kolhapur"] },
  { name: "Manipur", code: "MN", cities: ["Imphal", "Thoubal"] },
  { name: "Meghalaya", code: "ML", cities: ["Shillong", "Tura"] },
  { name: "Mizoram", code: "MZ", cities: ["Aizawl", "Lunglei"] },
  { name: "Nagaland", code: "NL", cities: ["Kohima", "Dimapur"] },
  { name: "Odisha", code: "OD", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"] },
  { name: "Punjab", code: "PB", cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali"] },
  { name: "Rajasthan", code: "RJ", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bhiwadi", "Ajmer"] },
  { name: "Sikkim", code: "SK", cities: ["Gangtok", "Namchi"] },
  { name: "Tamil Nadu", code: "TN", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruppur", "Salem", "Hosur"] },
  { name: "Telangana", code: "TS", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"] },
  { name: "Tripura", code: "TR", cities: ["Agartala", "Udaipur"] },
  { name: "Uttar Pradesh", code: "UP", cities: ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi", "Meerut"] },
  { name: "Uttarakhand", code: "UK", cities: ["Dehradun", "Haridwar", "Rudrapur", "Haldwani"] },
  { name: "West Bengal", code: "WB", cities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"] },
  { name: "Andaman & Nicobar Islands", code: "AN", cities: ["Port Blair"] },
  { name: "Chandigarh", code: "CH", cities: ["Chandigarh"] },
  { name: "Dadra & Nagar Haveli and Daman & Diu", code: "DN", cities: ["Silvassa", "Daman", "Diu"] },
  { name: "Delhi", code: "DL", cities: ["New Delhi", "Delhi", "Dwarka", "Okhla"] },
  { name: "Jammu & Kashmir", code: "JK", cities: ["Srinagar", "Jammu"] },
  { name: "Ladakh", code: "LA", cities: ["Leh", "Kargil"] },
  { name: "Lakshadweep", code: "LD", cities: ["Kavaratti"] },
  { name: "Puducherry", code: "PY", cities: ["Puducherry", "Karaikal"] },
];

export function citiesForState(stateName: string) {
  return indiaStates.find((s) => s.name === stateName)?.cities ?? [];
}

export type BankInfo = { name: string; states: string[] };

/** Major scheduled banks in India; `states: ["*"]` means available nationwide. */
export const indianBanks: BankInfo[] = [
  { name: "State Bank of India", states: ["*"] },
  { name: "HDFC Bank", states: ["*"] },
  { name: "ICICI Bank", states: ["*"] },
  { name: "Axis Bank", states: ["*"] },
  { name: "Punjab National Bank", states: ["*"] },
  { name: "Bank of Baroda", states: ["*"] },
  { name: "Kotak Mahindra Bank", states: ["*"] },
  { name: "Canara Bank", states: ["*"] },
  { name: "Union Bank of India", states: ["*"] },
  { name: "Bank of India", states: ["*"] },
  { name: "IDBI Bank", states: ["*"] },
  { name: "Yes Bank", states: ["*"] },
  { name: "IndusInd Bank", states: ["*"] },
  { name: "Central Bank of India", states: ["*"] },
  { name: "Indian Bank", states: ["*"] },
  { name: "Federal Bank", states: ["Kerala", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi"] },
  { name: "RBL Bank", states: ["Maharashtra", "Gujarat", "Karnataka", "Delhi"] },
  { name: "Bandhan Bank", states: ["West Bengal", "Bihar", "Assam", "Jharkhand", "Odisha", "Delhi", "Maharashtra"] },
  { name: "AU Small Finance Bank", states: ["Rajasthan", "Maharashtra", "Gujarat", "Madhya Pradesh", "Delhi"] },
  { name: "IDFC FIRST Bank", states: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "Gujarat"] },
  { name: "Maharashtra Gramin Bank", states: ["Maharashtra"] },
  { name: "Vidarbha Konkan Gramin Bank", states: ["Maharashtra"] },
  { name: "Rajasthan Marudhara Gramin Bank", states: ["Rajasthan"] },
  { name: "Karnataka Vikas Grameena Bank", states: ["Karnataka"] },
  { name: "Tamil Nadu Grama Bank", states: ["Tamil Nadu"] },
  { name: "Punjab Gramin Bank", states: ["Punjab"] },
  { name: "Sarva Haryana Gramin Bank", states: ["Haryana"] },
  { name: "Uttar Bihar Gramin Bank", states: ["Bihar"] },
  { name: "Kerala Gramin Bank", states: ["Kerala"] },
  { name: "Andhra Pradesh Grameena Vikas Bank", states: ["Andhra Pradesh", "Telangana"] },
  { name: "Madhya Pradesh Gramin Bank", states: ["Madhya Pradesh"] },
  { name: "Gujarat Gramin Bank", states: ["Gujarat"] },
];

/** Banks available in a state — nationwide banks plus state-specific ones. */
export function banksForState(stateName: string) {
  if (!stateName || stateName === "all") return indianBanks.map((b) => b.name);
  return indianBanks.filter((b) => b.states.includes("*") || b.states.includes(stateName)).map((b) => b.name);
}

export function stateCode(stateName: string) {
  return indiaStates.find((s) => s.name === stateName)?.code ?? "";
}

/** "Mumbai, MH" → matches state code / city name */
export function locationMatches(location: string, stateName: string, city: string) {
  if (stateName !== "all") {
    const code = stateCode(stateName);
    const suffix = location.split(",")[1]?.trim();
    if (suffix && code && suffix.toLowerCase() !== code.toLowerCase()) return false;
  }
  if (city !== "all") {
    const name = location.split(",")[0]?.trim().toLowerCase();
    if (name !== city.toLowerCase()) return false;
  }
  return true;
}
