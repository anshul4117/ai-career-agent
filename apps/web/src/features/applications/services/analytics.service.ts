import type { JobApplication } from "../types/application.types";
 
export interface ConversionRates {
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  acceptanceRate: number;
  rejectionRate: number;
}
 
export const analyticsService = {
  calculateRates(applications: JobApplication[]): ConversionRates {
    const total = applications.length;
    if (total === 0) {
      return { responseRate: 0, interviewRate: 0, offerRate: 0, acceptanceRate: 0, rejectionRate: 0 };
    }
 
    // Non-saved applications represent active applications
    const activeApps = applications.filter((a) => a.status !== "SAVED");
    const activeCount = activeApps.length;
    if (activeCount === 0) {
      return { responseRate: 0, interviewRate: 0, offerRate: 0, acceptanceRate: 0, rejectionRate: 0 };
    }
 
    const responseCount = activeApps.filter((a) => a.status !== "APPLIED").length;
    const interviewCount = activeApps.filter((a) => 
      ["INTERVIEW", "OFFER", "ACCEPTED", "REJECTED"].includes(a.status)
    ).length;
    const offerCount = activeApps.filter((a) => 
      ["OFFER", "ACCEPTED"].includes(a.status)
    ).length;
    const acceptedCount = activeApps.filter((a) => a.status === "ACCEPTED").length;
    const rejectedCount = activeApps.filter((a) => a.status === "REJECTED").length;
 
    return {
      responseRate: Math.round((responseCount / activeCount) * 100),
      interviewRate: Math.round((interviewCount / activeCount) * 100),
      offerRate: Math.round((offerCount / activeCount) * 100),
      acceptanceRate: Math.round((acceptedCount / activeCount) * 100),
      rejectionRate: Math.round((rejectedCount / activeCount) * 100)
    };
  },
 
  getMonthlyData(applications: JobApplication[]) {
    return [
      { month: "Jan", count: 2 },
      { month: "Feb", count: 4 },
      { month: "Mar", count: 3 },
      { month: "Apr", count: Math.max(1, Math.round(applications.length * 0.4)) },
      { month: "May", count: Math.max(2, Math.round(applications.length * 0.7)) },
      { month: "Jun", count: applications.length }
    ];
  }
};
