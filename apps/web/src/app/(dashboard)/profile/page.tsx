import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockEducation,
  mockExperience,
  mockProfile,
  mockProjects,
  mockSkills,
} from "@/features/profile/mock/profile";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  const profile = mockProfile;

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your candidate profile for AI matching."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Name" value={`${profile.firstName} ${profile.lastName}`} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Phone" value={profile.phone} />
            <InfoRow label="Location" value={profile.location} />
            <InfoRow label="Headline" value={profile.headline} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Preferred Role" value={profile.preferredRole} />
            <InfoRow label="Preferred Location" value={profile.preferredLocation} />
            <InfoRow label="Employment Type" value={profile.employmentType} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {mockSkills.map((skill) => (
              <Badge key={skill.id} variant="secondary">
                {skill.name} · {skill.level}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockEducation.map((edu) => (
              <div key={edu.id} className="text-sm">
                <p className="font-semibold">{edu.institution}</p>
                <p className="text-foreground-secondary">
                  {edu.degree} in {edu.fieldOfStudy} · CGPA {edu.cgpa}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockExperience.map((exp) => (
              <div key={exp.id} className="text-sm">
                <p className="font-semibold">{exp.role}</p>
                <p className="text-foreground-secondary">
                  {exp.companyName} · {exp.duration}
                </p>
                <p className="mt-1 text-foreground-muted">{exp.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="text-sm">
                <p className="font-semibold">{project.title}</p>
                <p className="text-foreground-secondary">{project.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/20 py-2 last:border-0">
      <span className="text-foreground-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
