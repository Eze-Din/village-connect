
import { DataState, Role, StaffStatus, BidStatus, ServiceRequestStatus, ServiceRequestCategory } from './types';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);


export const MOCK_DATA: DataState = {
  users: [
    { id: 'admin-1', fullName: 'Admin User', email: 'admin@village.com', password: 'password123', role: Role.Admin, address: '1 Village Hall', contactNumber: '111-222-3333', createdAt: new Date().toISOString(), approved: true },
    { id: 'resident-1', fullName: 'John Doe', email: 'john.doe@email.com', password: 'password123', role: Role.Resident, address: '123 Main St', contactNumber: '555-123-4567', createdAt: new Date().toISOString(), approved: true },
    { id: 'resident-2', fullName: 'Jane Smith', email: 'jane.smith@email.com', password: 'password123', role: Role.Resident, address: '456 Oak Ave', contactNumber: '555-987-6543', createdAt: new Date().toISOString(), approved: true },
    { id: 'resident-3', fullName: 'Bob Johnson', email: 'bob.j@email.com', password: 'password123', role: Role.Resident, address: '789 Pine Ln', contactNumber: '555-555-5555', createdAt: new Date().toISOString(), approved: false },
  ],
  staff: [
    { id: 'staff-1', fullName: 'Alice Williams', role: 'Office Clerk', contactInfo: { email: 'alice.w@village.com', phone: '111-222-4444' }, joinDate: '2022-08-15', salaryInfo: '****', status: StaffStatus.Active },
    { id: 'staff-2', fullName: 'Charlie Brown', role: 'Maintenance', contactInfo: { email: 'charlie.b@village.com', phone: '111-222-5555' }, joinDate: '2021-05-20', salaryInfo: '****', status: StaffStatus.Active },
    { id: 'staff-3', fullName: 'Diana Prince', role: 'Security', contactInfo: { email: 'diana.p@village.com', phone: '111-222-6666' }, joinDate: '2023-01-10', salaryInfo: '****', status: StaffStatus.OnLeave },
  ],
  staffLeave: [],
  bids: [
    { id: 'bid-1', title: 'Community Park Landscaping', description: 'Seeking proposals for the complete redesign and landscaping of the central community park.', budgetEstimate: 50000, submissionDeadline: nextWeek.toISOString(), status: BidStatus.Open },
    { id: 'bid-2', title: 'Town Hall Roof Repair', description: 'Urgent repairs needed for the Town Hall roof. Materials and labor must be included in the bid.', budgetEstimate: 25000, submissionDeadline: tomorrow.toISOString(), status: BidStatus.UnderReview },
    { id: 'bid-3', title: 'Annual Street Paving Project', description: 'Paving and repair work for several designated streets within the village.', budgetEstimate: 120000, submissionDeadline: lastMonth.toISOString(), status: BidStatus.Awarded, awardedTo: 'PaveCo Inc.' },
    { id: 'bid-4', title: 'Waste Management Contract 2025', description: 'Comprehensive waste and recycling collection services for the entire village.', budgetEstimate: 85000, submissionDeadline: nextMonth.toISOString(), status: BidStatus.Open },
  ],
  bidSubmissions: [
      { id: 'sub-1', bidId: 'bid-2', vendorName: 'Roofers United', bidAmount: 24500, proposal: 'We can start next week.', submittedBy: 'resident-2', submittedAt: new Date().toISOString() }
  ],
  serviceRequests: [
    { id: 'req-1', submittedBy: 'resident-1', category: ServiceRequestCategory.Streetlights, description: 'The streetlight at the corner of Main and Oak is flickering.', location: 'Corner of Main St and Oak Ave', status: ServiceRequestStatus.New, submittedAt: new Date().toISOString() },
    { id: 'req-2', submittedBy: 'resident-2', category: ServiceRequestCategory.WasteManagement, description: 'Missed garbage pickup on my street this week.', location: '456 Oak Ave', status: ServiceRequestStatus.InProgress, adminNotes: 'Contacted waste management company. They will do a special pickup tomorrow.', submittedAt: new Date(today.setDate(today.getDate() - 2)).toISOString() },
    { id: 'req-3', submittedBy: 'resident-1', category: ServiceRequestCategory.Roads, description: 'Large pothole in front of my house.', location: '123 Main St', status: ServiceRequestStatus.Resolved, submittedAt: new Date(today.setDate(today.getDate() - 10)).toISOString() },
  ],
  announcements: [
    { id: 'ann-1', title: 'Annual Village Fair', content: 'The annual village fair will take place next Saturday at the community park. Join us for food, games, and fun!', isUrgent: false, publishedAt: new Date().toISOString() },
    { id: 'ann-2', title: 'Road Closure on Main St', content: 'Main Street will be closed between Oak and Pine on Monday for paving work. Please use alternate routes.', isUrgent: true, publishedAt: new Date().toISOString() },
  ],
};
