export interface Skill {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    escoUri?: string;
    isCustom?: boolean;
    uri?: string;  // Temporary for API response mapping

  }