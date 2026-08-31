export type DroneOperator = {
  id: string;
  name: string;
  rating: number;
  jobs: number;
  basePricePerAcre: number;
  travelFee: number;
  phone: string;
  serviceArea: string;
  availableSlots: string[];
};

/**
 * Demo directory for the booking flow. These are not real operator contacts;
 * replace them with verified local FPO/custom-hiring-centre partners before
 * launching a public booking service.
 */
export const DRONE_OPERATORS: DroneOperator[] = [
  {
    id: "greenwing",
    name: "GreenWing Drone Services",
    rating: 4.8,
    jobs: 146,
    basePricePerAcre: 450,
    travelFee: 120,
    phone: "18001801551",
    serviceArea: "Nashik & nearby villages",
    availableSlots: ["7:00 – 9:00 AM", "9:30 – 11:30 AM", "4:00 – 6:00 PM"],
  },
  {
    id: "kisan-sky",
    name: "Kisan Sky Sprayers",
    rating: 4.6,
    jobs: 89,
    basePricePerAcre: 425,
    travelFee: 180,
    phone: "18001801551",
    serviceArea: "Nashik district",
    availableSlots: ["6:30 – 8:30 AM", "10:00 AM – 12:00 PM", "3:30 – 5:30 PM"],
  },
  {
    id: "agri-air",
    name: "AgriAir Custom Hiring",
    rating: 4.7,
    jobs: 203,
    basePricePerAcre: 475,
    travelFee: 90,
    phone: "18001801551",
    serviceArea: "Maharashtra",
    availableSlots: ["7:30 – 9:30 AM", "1:30 – 3:30 PM", "4:30 – 6:30 PM"],
  },
];

export function sprayEstimate(operator: DroneOperator, acres: number) {
  const service = Math.round(operator.basePricePerAcre * Math.max(0.5, acres));
  return { service, travel: operator.travelFee, total: service + operator.travelFee };
}

