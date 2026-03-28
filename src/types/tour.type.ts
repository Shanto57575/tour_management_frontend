export interface ITourEntityRef {
  _id: string;
  name?: string;
  slug?: string;
}

export interface ITourPlan {
  day: number;
  title: string;
  description?: string;
  meals?: string[];
}

export interface ITour {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  tags?: string[];
  division: string | ITourEntityRef;
  district: string | ITourEntityRef;
  destination: string | ITourEntityRef;
  departureLocation?: string;
  arrivalLocation?: string;
  guide?: string | ITourEntityRef;
  tourType: string | ITourEntityRef;
  pricePerPerson: number;
  discount?: number;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  durationNights?: number;
  maxGuest?: number;
  minAge?: number;
  bookedCount?: number;
  groupType?: "private" | "group" | "both";
  difficulty?: "easy" | "moderate" | "hard";
  languages?: string[];
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: ITourPlan[];
  cancellationPolicy?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isAvailable?: boolean;
  averageRating?: number;
  totalReviews?: number;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;

  // Legacy compatibility fields still referenced elsewhere in the frontend.
  location?: string;
  costFrom?: number;
  __v?: number;
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
