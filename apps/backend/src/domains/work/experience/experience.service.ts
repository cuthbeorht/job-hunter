
import ExperienceRepository from "./experience.repostory";
import { Experience, ExperienceEntity, ExperienceItem } from "./experience.types";

export default class ExperienceService {
    experienceRepository: ExperienceRepository;

    constructor(experienceRepository: ExperienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    async create(entity: ExperienceItem): Promise<Experience> {
        const experienceEntityItem: ExperienceEntity = {
            detail: entity.detail
        };
        
        const newExperienceEntity = await this.experienceRepository.create(experienceEntity);
        
        return {
            id: newExperienceEntity.id,
            company: newExperienceEntity.company,
            position: newExperienceEntity.position,
            startDate: new Date(newExperienceEntity.startDate),
            endDate: newExperienceEntity.endDate ? new Date(newExperienceEntity.endDate) : undefined,
            description: newExperienceEntity.description.map((item: any) => ({
                id: item.id,
                detail: item.detail
            }))
        };
    }

    async getAll(): Promise<ExperienceEntity[]> {
        return await this.experienceRepository.findAll();
    }
}
