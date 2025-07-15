
export enum Role {
  Admin = 'ADMIN',
  Resident = 'RESIDENT',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Should not be sent to client, but needed for creation
  role: Role;
  address: string;
  contactNumber: string;
  createdAt: string;
  approved: boolean;
}

export enum StaffStatus {
  Active = 'Active',
  OnLeave = 'On Leave',
  Terminated = 'Terminated',
}

export interface Staff {
  id: string;
  fullName: string;
  role: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  joinDate: string;
  salaryInfo: string; // Encrypted or masked
  status: StaffStatus;
}

export interface StaffLeave {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  approved: boolean;
}

export enum BidStatus {
  Open = 'Open',
  UnderReview = 'Under Review',
  Awarded = 'Awarded',
  Closed = 'Closed',
}

export interface Bid {
  id: string;
  title: string;
  description: string;
  budgetEstimate: number;
  submissionDeadline: string;
  status: BidStatus;
  awardedTo?: string; // Vendor name
}

export interface BidSubmission {
    id: string;
    bidId: string;
    vendorName: string;
    bidAmount: number;
    proposal: string; // link to doc or text
    submittedBy: string; // User ID
    submittedAt: string;
}

export enum ServiceRequestStatus {
  New = 'New',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum ServiceRequestCategory {
    Roads = "Roads",
    Streetlights = "Streetlights",
    WaterSupply = "Water Supply",
    WasteManagement = "Waste Management",
    Other = "Other"
}

export interface ServiceRequest {
  id: string;
  submittedBy: string; // User ID
  category: ServiceRequestCategory;
  description: string;
  location: string;
  photoUrl?: string;
  status: ServiceRequestStatus;
  submittedAt: string;
  adminNotes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  publishedAt: string;
}

export interface DataState {
  users: User[];
  staff: Staff[];
  staffLeave: StaffLeave[];
  bids: Bid[];
  bidSubmissions: BidSubmission[];
  serviceRequests: ServiceRequest[];
  announcements: Announcement[];
}

export type DataAction =
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_STAFF'; payload: Staff }
  | { type: 'UPDATE_STAFF'; payload: Staff }
  | { type: 'DELETE_STAFF'; payload: string }
  | { type: 'ADD_BID'; payload: Bid }
  | { type: 'UPDATE_BID'; payload: Bid }
  | { type: 'DELETE_BID'; payload: string }
  | { type: 'ADD_BID_SUBMISSION'; payload: BidSubmission }
  | { type: 'ADD_ANNOUNCEMENT'; payload: Announcement }
  | { type: 'UPDATE_ANNOUNCEMENT'; payload: Announcement }
  | { type: 'DELETE_ANNOUNCEMENT'; payload: string }
  | { type: 'ADD_SERVICE_REQUEST'; payload: ServiceRequest }
  | { type: 'UPDATE_SERVICE_REQUEST'; payload: ServiceRequest };

