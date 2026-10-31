import { OFFICIAL_SERVICES, EXPERIENCE_ASPECTS } from '../data/servicesData';

interface GenerateDraftParams {
  serviceId: string;
  feedback: string;
  selectedAspectIds: string[];
}

export function generateStructuredDraft({
  serviceId,
  feedback,
  selectedAspectIds,
}: GenerateDraftParams): string {
  const serviceObj = OFFICIAL_SERVICES.find(s => s.id === serviceId);
  const serviceName = serviceObj ? serviceObj.name : 'Salon Services';

  const trimmedFeedback = feedback.trim();
  if (!trimmedFeedback && selectedAspectIds.length === 0) {
    return '';
  }

  const aspectLabels = selectedAspectIds
    .map(id => {
      const match = EXPERIENCE_ASPECTS.find(a => a.id === id);
      return match ? match.label : null;
    })
    .filter((label): label is string => Boolean(label));

  const parts: string[] = [];
  parts.push(`Visited Apple Beauty Salon in Kudasan, Gandhinagar for ${serviceName}.`);
  if (trimmedFeedback) {
    parts.push(trimmedFeedback);
  }
  if (aspectLabels.length > 0) {
    parts.push(`Appreciated the ${aspectLabels.join(' and ')}.`);
  }
  parts.push('A great salon experience in Kudasan.');
  return parts.join(' ');
}
