import ExperienceService from "./experience.service";

export default class ExperienceController {
    experienceService: ExperienceService;
    
    constructor(experienceService : ExperienceService) {
        this.experienceService = experienceService;
    }

    async create(req: any, res: any) {
        try {
            const newExperienceItem = {
                detail: req.body
            };
                
            const experience = await this.experienceService.create(newExperienceItem);
            res.status(201).json(experience);
        } catch (error) {
            console.error('Error creating experience:', error);
            res.status(500).json({ error: 'Failed to create experience' });
        }
    }

    async getAllExperiences(req: any, res: any) {
        try {
            const experiences = await this.experienceService.getAll();
            res.status(200).json(experiences);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            res.status(500).json({ error: 'Failed to fetch experiences' });
        }
    }
}