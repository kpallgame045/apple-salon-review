export interface ServiceCategory {
  id: string;
  name: string;
  showcaseTitle?: string;
  showcaseGroup?: string;
  description: string;
  tag: string;
  highlights: string[];
}

export interface ReviewState {
  selectedService: string;
  customerFeedback: string;
  rating: number;
  aspects: string[];
  draftText: string;
  isDraftEdited: boolean;
}
