export interface ITour {
  _id: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  amenities: string[];
  arrivalLocation: string;
  costFrom: number;
  createdAt: string;
  departureLocation: string;
  division: string;
  endDate: string;
  excluded: string[];
  included: string[];
  maxGuest: number;
  minAge: number;
  slug: string;
  startDate: string;
  tourPlan: string[];
  tourType: string;
  updatedAt: string;
  __v: number;
}

// // Optional: More specific types for better type safety
// export interface ITourResponse {
//   data: ITour;
//   success: boolean;
//   message?: string;
// }

// export interface IToursListResponse {
//   data: ITour[];
//   success: boolean;
//   message?: string;
//   total?: number;
//   page?: number;
//   limit?: number;
// }
