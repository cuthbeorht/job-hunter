interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: ExperienceItem[];
}

interface ExperienceEntity {
  id: string;
  company: string;
  position: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description: ExperienceItemEntity[];
}

interface ExperienceItemEntity {
  id: string;
  detail: string;
}

interface ExperienceItem {
  id: string;
  detail: string;
}

export type { Experience, ExperienceEntity, ExperienceItem, ExperienceItemEntity };